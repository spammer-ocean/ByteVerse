from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm import chat
from fastapi.responses import JSONResponse


router = APIRouter()

class ChatRequest(BaseModel):
    request_id:str
    query:str


@router.post("/")
async def chat_user(request:ChatRequest):
    response = await chat(query=request.query,request_id=request.request_id)
    return JSONResponse(status_code=200,content={"message":response})
    