from fastapi import APIRouter
from pydantic import BaseModel
from app.services.supabase import get_request



router = APIRouter()



@router.get("/get")
async def get_org_request(request_id:str):
    response = get_request(request_id=request_id)
    return response.data[0]