from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.services.supabase import insert_financial_data

router = APIRouter()

class FinancialForm(BaseModel):
    retirement_planning: str
    insurance: str
    bank_accounts: str
    monthly_savings: str
    monthly_emis: str
    investment_channels: str
    existing_loans: str
    pan_card_number: str

@router.post("/faForm")
async def submit_data(data: FinancialForm):
        result = insert_financial_data(data.dict())
        return JSONResponse(status_code=200,content={"message":"OK"})

@router.post("/chat")
async def chat(data):
      return JSONResponse(status_code=200,content={"message":"ok"})
 