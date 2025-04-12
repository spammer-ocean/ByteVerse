from fastapi import APIRouter, HTTPException, UploadFile, Form, File
from fastapi.responses import JSONResponse
from app.config.settings import SETTINGS
from typing import Optional
from app.utils.pdf_reader import extract_pdf_text
from app.services.llm import get_ais_summary,get_bank_statement_summary,get_creditx_score
from app.services.supabase import insert_request,get_org_requests
import enum

router = APIRouter()

class LoanType(str, enum.Enum):
    HOME = "home"
    PERSONAL = "personal"
    CAR = "car"
    EDUCATION = "education"
    BUSINESS  = "business"


buerau_data = {
    "equifax": {
        "ABCDE1234F": {
        "USERNAME": "Vikas Rambilas Mundada",
        "CREDIT_SCORE": 770,
        "CURRENT_LOANS": [{ "AMOUNT": 500000, "BANK": "HDFC Bank", "TIME_PERIOD": "5 years" }],
        "NO_OF_TIMES_DEFAULTED": { "HDFC Bank": 2 },
        "SETTLED_LOANS": [{ "AMOUNT": 300000, "BANK": "SBI", "TIME_PERIOD": "4 years" }],
        "MISSED_PAYMENTS": { "HDFC Bank": 3 }
        }}
} 
import asyncio

@router.post("/submit")
async def submit_loan(
    first_name: str = Form(...),
    middle_name: Optional[str] = Form(None),
    last_name: str = Form(...),
    loan_type: LoanType = Form(...),
    pan_id: str = Form(...),
    ais: UploadFile =  File(...),
    loan_description: str = Form(...),
    org_id: str = Form(...),
    user_id: str = Form(...),
    bank_statement: UploadFile = File(...)
):
    bank_statement_text, ais_text = await asyncio.gather(
        extract_pdf_text(bank_statement), 
        extract_pdf_text(ais)
    )

    bank_summary, ais_summary = await asyncio.gather(
        get_bank_statement_summary(bank_statement_text),
        get_ais_summary(ais_text)
    )

    final_credit_summary = await get_creditx_score(
        bank_summary=bank_summary, 
        ais_summary=ais_summary, 
        bureau_data=buerau_data
    )

    insert_request(
        user_id=user_id, org_id=org_id, loan_type=loan_type, 
        loan_description=loan_description, bank_summary=bank_summary, 
        ais_summary=ais_summary, creditx_score=final_credit_summary
    )

    return JSONResponse(
        status_code=200, 
        content={"status": "success", "message": "File uploaded successfully"}
    )