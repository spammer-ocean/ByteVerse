from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.services.supabase import get_financial_data_json, insert_financial_data
from groq import Groq
from app.config.settings import SETTINGS


router = APIRouter()

client = Groq(
      api_key=SETTINGS.groq_api_key
)

class FinancialForm(BaseModel):
    retirement_planning: str
    insurance: str
    bank_accounts: str
    monthly_savings: str
    monthly_emis: str
    investment_channels: str
    existing_loans: str
    pan_card_number: str

class ChatRequest(BaseModel):
    message: str
    pan_card_number: str

@router.post("/faForm")
async def submit_data(data: FinancialForm):
    result = insert_financial_data(data.dict())
    return JSONResponse(status_code=200, content={"message": "OK"})

@router.post("/chat")
async def chat(request: ChatRequest):
    message = request.message
    pan_card_number = request.pan_card_number
    financial_data = get_financial_data_json(pan_card_number)
    
    prompt = f"""  
    Context (User's Financial Information):
    {financial_data}
    
    User Question: {message}
    YOU ARE A FINANCIAL ASSISTANT TO THIS UNEDUCATED USER HENCE REPLY IN A FORM THAT IS UNDERSTOOD TO A TODDLER AS WELL AND MAKE THE ADVICE CLEAR AND OK
    Please provide a helpful response based on the financial information above."""
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful financial assistant."},
                {"role": "user", "content": prompt}
            ],
            model="llama3-70b-8192",  # Or your preferred Groq model
            temperature=0.2,
            max_tokens=1000
        )
        
        # Extract the response
        ai_response = chat_completion.choices[0].message.content
        
        return JSONResponse(
            status_code=200,
            content={"message": ai_response}
        )
    except Exception as e:
        raise HTTPException(status_code=500, content={"message": f"Error from Groq API: {str(e)}"})