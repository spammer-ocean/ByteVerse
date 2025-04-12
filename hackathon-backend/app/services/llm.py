import httpx
import asyncio
import json
from app.config.settings import SETTINGS
from app.prompts.bank_statement import bank_statment_prompt_maker
from app.prompts.ais_prompt import ais_prompt_maker
from app.prompts.credit_score_prompt import credit_score_prompt_maker
from app.prompts.chat_prompt import chat_prompt_maker
from app.services.supabase import get_request

MEMORY_FILE = "conversation.json"

url = f"https://api.cloudflare.com/client/v4/accounts/{SETTINGS.workerai_account_id}/ai/run/@cf/meta/llama-3.1-8b-instruct"
headers = {
    "Authorization": f"Bearer {SETTINGS.workerai_api_key}",
    "Content-Type": "application/json"
}

async def fetch_llama(prompt: str):
    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 2048
    }
    async with httpx.AsyncClient(timeout=3600) as client:
        response = await client.post(url, headers=headers, json=payload)
        return response.json()

async def get_bank_statement_summary(statements: str):
    response = await fetch_llama(bank_statment_prompt_maker(statements=statements))
    return response["result"]["response"]

async def get_ais_summary(ais_text: str):
    response = await fetch_llama(ais_prompt_maker(ais_text=ais_text))
    return response["result"]["response"]

async def get_creditx_score(bank_summary: str, ais_summary: str, bureau_data: str):
    response = await fetch_llama(credit_score_prompt_maker(bank_summary=bank_summary, ais_summary=ais_summary, bureau_data=bureau_data))
    return response["result"]["response"]

def load_memory():
    try:
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_memory(memory):
    """Append chat conversation into JSON memory instead of overwriting."""
    try:
        with open(MEMORY_FILE, "r") as f:
            existing_memory = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_memory = {}

    # Update only the request_id conversation history
    for request_id, data in memory.items():
        if request_id in existing_memory:
            existing_memory[request_id]["conversation_memory"].extend(data["conversation_memory"])
        else:
            existing_memory[request_id] = data

    with open(MEMORY_FILE, "w") as f:
        json.dump(existing_memory, f, indent=4)

async def chat(request_id: str, query: str):
    request_data = get_request(request_id=request_id)
    request_data = request_data.data[0]
    bank_summary = request_data["bank_summary"]
    ais_summary = request_data["ais_summary"]
    creditx_score = request_data["creditx_score"]

    memory = load_memory()
    conversation_memory = memory.get(request_id, {"conversation_memory": []})["conversation_memory"]

    response = await fetch_llama(chat_prompt_maker(
        user_query=query,
        bank_summary=bank_summary,
        ais_summary=ais_summary,
        credix_score=creditx_score,
        conversation_memory=conversation_memory
    ))
    ai_response = response["result"]["response"]

    conversation_memory.append({"user": query, "ai": ai_response})
    memory[request_id] = {"conversation_memory": conversation_memory}
    save_memory(memory)

    return ai_response
