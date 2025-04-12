from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.services.supabase import get_org_requests


router = APIRouter()

@router.get("/get")
async def get_users(org_id:str):
    response = get_org_requests(org_id=org_id)
    return JSONResponse(status_code=200,content=response.data)

    
    