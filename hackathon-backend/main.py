from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import logging
import os

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

app = FastAPI()

# ---------- Logging ----------
logging.basicConfig(level=logging.INFO)


# ---------- Input Schema ----------
class URLInput(BaseModel):
    url: str


# ---------- Helper: Web Scraper ----------
def fetch_website_text(url: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove script and style elements
        for script_or_style in soup(["script", "style", "noscript"]):
            script_or_style.decompose()

        # Get text and clean it
        text = soup.get_text(separator=" ")
        clean_text = " ".join(text.split())
        return clean_text

    except Exception as e:
        logging.error(f"Error scraping website: {e}")
        raise HTTPException(status_code=500, detail="Error scraping the website")


# ---------- LangChain & Groq LLaMA Setup ----------
def extract_eligibility(text: str) -> str:
    try:
        # Ensure the API key is set
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable not set.")

        llm = ChatGroq(
            model="llama-3.1-8b-instant",  # Replace with your desired model
            temperature=0.2,
            groq_api_key=groq_api_key,
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful assistant that reads welfare scheme details.",
                ),
                (
                    "human",
                    """
Based on the following document:
-----------------------
{raw_text}
-----------------------

Extract only the **eligibility criteria** from this welfare scheme. Write concisely.
""",
                ),
            ]
        )

        chain = prompt | llm
        result = chain.invoke(
            {"raw_text": text[:7000]}
        )  # Limit input to fit token size

        return result.content.strip()

    except Exception as e:
        logging.error(f"Error during LLM processing: {e}")
        raise HTTPException(status_code=500, detail="Error processing data with LLM")


# ---------- FastAPI Route ----------
@app.post("/extract-eligibility/")
async def extract_eligibility_from_url(input_data: URLInput):
    url = input_data.url
    logging.info(f"Received URL: {url}")

    # Step 1: Fetch Text
    page_text = fetch_website_text(url)

    # Step 2: Extract Eligibility using LLM
    eligibility_criteria = extract_eligibility(page_text)

    return {"url": url, "eligibility_criteria": eligibility_criteria}
