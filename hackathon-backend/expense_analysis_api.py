import os
import io
import re
import json
import uuid
import base64
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib

matplotlib.use("Agg")
import plotly.express as px
import plotly.graph_objects as go
from plotly.utils import PlotlyJSONEncoder
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import pytesseract
from pypdf import PdfReader

# --- LangChain, FAISS, and LLM setup ---
try:
    from langchain_groq import ChatGroq
    from langchain.prompts import ChatPromptTemplate
    from langchain.schema import Document
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_community.vectorstores import FAISS
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.chains import RetrievalQA
    from dotenv import load_dotenv

    load_dotenv()

    GROQ_API_KEY = os.getenv("groq_api_key")
    USE_LLM = bool(GROQ_API_KEY)
    if USE_LLM:
        llm = ChatGroq(
            api_key=GROQ_API_KEY,
            model_name="llama-3.3-70b-versatile",
        )
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    else:
        raise Exception(
            "GROQ_API_KEY not set. LLM features must be enabled for analysis."
        )
except ImportError as e:
    raise Exception("Required LangChain or GROQ packages are not installed.") from e

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Data classes ---
class AmountRange(BaseModel):
    name: str
    min_amount: float
    max_amount: float
    color: str


class AnalysisResponse(BaseModel):
    message: str
    transactions: List[Dict[str, Any]]
    spending_by_amount_range: Dict[str, float]
    spending_by_day: Dict[str, float]
    spending_by_week: Dict[str, float]
    spending_by_month: Dict[str, Dict[str, float]]
    unusual_transactions: List[Dict[str, Any]]
    suggestions: List[str]
    charts: Dict[str, str]  # JSON encoded chart data
    summary: str


# Define transaction amount ranges (for reference if needed)
amount_ranges = [
    AmountRange(name="Small (₹0-500)", min_amount=0, max_amount=500, color="#8dd3c7"),
    AmountRange(
        name="Medium (₹500-2,000)", min_amount=500, max_amount=2000, color="#ffffb3"
    ),
    AmountRange(
        name="Large (₹2,000-10,000)", min_amount=2000, max_amount=10000, color="#bebada"
    ),
    AmountRange(
        name="Very Large (₹10,000+)",
        min_amount=10000,
        max_amount=float("inf"),
        color="#fb8072",
    ),
]


# --- Helper Functions ---
def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from PDF file."""
    try:
        pdf_io = io.BytesIO(pdf_content)
        pdf_reader = PdfReader(pdf_io)
        text = ""
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {str(e)}")
        return ""


def extract_text_from_image(image_content: bytes) -> str:
    """Extract text from image using OCR."""
    try:
        image = Image.open(io.BytesIO(image_content))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Error extracting image text: {str(e)}")
        return ""


def parse_bank_statement(text: str) -> pd.DataFrame:
    """
    (Optional) Use regex to extract transaction details from the text.
    Since the bank statement is very naive, we attempt to extract date and amount.
    If no valid transactions are found, return an empty DataFrame.
    """
    data = []
    # Define simple regex patterns (you may need to adjust these as per your statement format)
    date_pattern = r"\d{1,2}[-/]\d{1,2}[-/]\d{2,4}"
    amount_pattern = r"[₹$]?\s*\d{1,3}(?:,?\d{3})*(?:\.\d+)?"
    lines = text.splitlines()
    for line in lines:
        date_match = re.search(date_pattern, line)
        amount_matches = re.findall(amount_pattern, line)
        if date_match and amount_matches:
            date_str = date_match.group(0)
            amounts = []
            for amt in amount_matches:
                cleaned = re.sub(r"[₹$,]", "", amt)
                try:
                    amounts.append(float(cleaned))
                except ValueError:
                    continue
            if amounts:
                # Use the maximum amount found as the transaction amount
                transaction_amount = max(amounts)
                # Assume debit unless keywords indicate credit
                transaction_type = "debit"
                if "credit" in line.lower() or "deposit" in line.lower():
                    transaction_type = "credit"
                data.append(
                    {
                        "date": date_str,
                        "amount": transaction_amount,
                        "transaction_type": transaction_type,
                        "description": line.strip(),
                    }
                )
    if data:
        df = pd.DataFrame(data)
        # Attempt to parse dates using common formats
        for fmt in [
            "%d/%m/%Y",
            "%d-%m-%Y",
            "%Y/%m/%d",
            "%Y-%m-%d",
            "%d/%m/%y",
            "%d-%m-%y",
        ]:
            try:
                df["date"] = pd.to_datetime(df["date"], format=fmt)
                break
            except Exception:
                continue
        return df
    return pd.DataFrame([])


def generate_charts(insights: Dict[str, Any]) -> Dict[str, str]:
    """
    Given the insights dictionary (returned from the LLM chain), create Plotly chart JSONs.
    Expected keys in insights:
      - spending_breakdown: dict with keys "small", "medium", "large", "very_large"
      - date_pattern: dict (optional) with breakdown, for example, {"day": {...}, "week": {...}}
    """
    charts = {}

    # Pie chart for amount range breakdown
    breakdown = insights.get("spending_breakdown", {})
    if breakdown:
        labels = ["Small", "Medium", "Large", "Very Large"]
        values = [
            breakdown.get("small", 0),
            breakdown.get("medium", 0),
            breakdown.get("large", 0),
            breakdown.get("very_large", 0),
        ]
        pie_fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.3)])
        pie_fig.update_layout(title_text="Spending Breakdown by Transaction Amount")
        charts["amount_range_pie"] = json.dumps(pie_fig, cls=PlotlyJSONEncoder)

    # Bar chart for date pattern breakdown (if provided)
    date_pattern = insights.get("spending_breakdown", {}).get("date_pattern", {})
    if date_pattern and "week" in date_pattern:
        weeks = list(date_pattern["week"].keys())
        week_values = list(date_pattern["week"].values())
        bar_fig = go.Figure(data=[go.Bar(x=weeks, y=week_values)])
        bar_fig.update_layout(title_text="Spending by Week (%)")
        charts["date_pattern_bar"] = json.dumps(bar_fig, cls=PlotlyJSONEncoder)

    return charts


# --- Endpoint ---
@app.post("/api/analyze-statement")
async def analyze_statement(
    statement_file: UploadFile = File(...),
    additional_files: List[UploadFile] = File(None),
):
    try:
        # Extract statement text (PDF/image)
        statement_content = await statement_file.read()
        if statement_file.filename.lower().endswith(".pdf"):
            statement_text = extract_text_from_pdf(statement_content)
        elif statement_file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
            statement_text = extract_text_from_image(statement_content)
        else:
            statement_text = statement_content.decode("utf-8", errors="ignore")

        if not statement_text or len(statement_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Insufficient text extracted from the bank statement.",
            )

        # (Optional) Extract transactions with regex
        transactions_df = parse_bank_statement(statement_text)
        transactions_list = (
            transactions_df.fillna("").to_dict("records")
            if not transactions_df.empty
            else []
        )
        for txn in transactions_list:
            if "date" in txn and isinstance(txn["date"], pd.Timestamp):
                txn["date"] = txn["date"].strftime("%Y-%m-%d")

        # Process additional files (if provided)
        additional_text = ""
        if additional_files:
            for file in additional_files:
                content = await file.read()
                if file.filename.lower().endswith(".pdf"):
                    additional_text += extract_text_from_pdf(content) + "\n"
                elif file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
                    additional_text += extract_text_from_image(content) + "\n"
                else:
                    additional_text += content.decode("utf-8", errors="ignore") + "\n"

        # ------- FAISS + RAG Section -------
        from langchain.text_splitter import RecursiveCharacterTextSplitter

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        docs = text_splitter.create_documents([statement_text])
        vector_store = FAISS.from_documents(docs, embeddings)
        retriever = vector_store.as_retriever(
            search_type="similarity", search_kwargs={"k": 5}
        )

        # Build a detailed prompt
        prompt = (
            "You are an expert financial analyst. You are given text extracted from a bank statement which "
            "contains only basic transaction details (date, transaction id, amount, balance). There is no merchant or "
            "category information. Analyze the expense patterns as follows:\n\n"
            "1. Compute the spending breakdown by transaction amount ranges:\n"
            "   - Small: Transactions below ₹500\n"
            "   - Medium: Transactions between ₹500 and ₹2000\n"
            "   - Large: Transactions between ₹2000 and ₹10000\n"
            "   - Very Large: Transactions above ₹10000\n"
            "   Report the percentage of the total expense in each range.\n\n"
            "2. Analyze the date patterns. For example, determine the percentage of expense done per week or per day.\n\n"
            "3. Identify any unusual transactions (spending spikes) based on the amount or timing.\n\n"
            "4. Provide a concise summary of the overall expense pattern and clear, actionable suggestions to manage expenses.\n\n"
            "Output your analysis as a JSON object with the following keys:\n"
            "{\n"
            '   "summary": string,\n'
            '   "spending_breakdown": {\n'
            '         "small": number,\n'
            '         "medium": number,\n'
            '         "large": number,\n'
            '         "very_large": number,\n'
            '         "date_pattern": { "week": {string: number}, "day": {string: number} }\n'
            "   },\n"
            '   "unusual_transactions": [string, ...],\n'
            '   "suggestions": [string, ...]\n'
            "}\n\n"
            "If possible, also incorporate insights from any additional documents provided below:\n"
            f"{additional_text[:1000]}\n"
            "If no additional documents are provided, only use the bank statement text.\n"
        )

        # Execute the RetrievalQA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm, chain_type="stuff", retriever=retriever
        )
        llm_response = qa_chain.run(prompt)

        # Robust JSON parsing
        if not llm_response.strip():
            raise HTTPException(status_code=500, detail="LLM returned an empty output.")

        print("LLM Response:", llm_response)  # Debug

        try:
            analysis_data = json.loads(llm_response)
        except json.JSONDecodeError as parse_exc:
            start_index = llm_response.find("{")
            end_index = llm_response.rfind("}")
            if start_index != -1 and end_index != -1 and start_index < end_index:
                extracted_json = llm_response[start_index : end_index + 1]
                try:
                    analysis_data = json.loads(extracted_json)
                except Exception as e:
                    print("Failed to parse JSON from extracted substring:", e)
                    raise HTTPException(
                        status_code=500, detail="LLM did not return valid JSON output."
                    ) from e
            else:
                print("No JSON structure detected in LLM response.")
                raise HTTPException(
                    status_code=500, detail="LLM did not return valid JSON output."
                ) from parse_exc

        charts = generate_charts(analysis_data)
        spending_breakdown = analysis_data.get("spending_breakdown", {})
        date_pattern = spending_breakdown.get("date_pattern", {})
        response_payload = {
            "message": "Analysis complete",
            "transactions": transactions_list,
            "spending_by_amount_range": {
                "small": spending_breakdown.get("small", 0),
                "medium": spending_breakdown.get("medium", 0),
                "large": spending_breakdown.get("large", 0),
                "very_large": spending_breakdown.get("very_large", 0),
            },
            "spending_by_day": date_pattern.get("day", {}),
            "spending_by_week": date_pattern.get("week", {}),
            "spending_by_month": {},
            "unusual_transactions": analysis_data.get("unusual_transactions", []),
            "suggestions": analysis_data.get("suggestions", []),
            "charts": charts,
            "summary": analysis_data.get("summary", ""),
        }
        return response_payload

    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error analyzing statement: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8002)
