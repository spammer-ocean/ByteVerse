from supabase import create_client, Client
import json
from app.config.settings import SETTINGS

url: str = SETTINGS.supabase_url
key: str = SETTINGS.supabase_key

supabase: Client = create_client(url, key)

def insert_financial_data(data: dict):
    response = supabase.table("financial_profiles").insert(data).execute()
    return response

def insert_request(user_id,org_id,loan_type,loan_description,ais_summary,bank_summary,creditx_score):
    data = {
        "user_id": user_id,
        "org_id":org_id,
        "loan_description":loan_description,
        "loan_type":loan_type,
        "ais_summary":ais_summary,
        "bank_summary":bank_summary,
        "creditx_score":json.loads(creditx_score),
        "status":"pending"
    }
    response = supabase.table("Request").insert(data).execute()
    return response

def get_org_requests(org_id: str):
    response = (
        supabase
        .table("Request")
        .select("id, status, loan_type, creditx_score, user_id!inner(pan, first_name, last_name)")
        .eq("org_id", org_id)
        .execute()
    )
    return response

def get_request(request_id:str):
    response = supabase.table("Request").select("*").eq("id",request_id).execute()
    return response

