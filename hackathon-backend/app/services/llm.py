import os
import httpx
import json
from groq import Groq
from app.config.settings import SETTINGS
from app.prompts.bank_statement import bank_statment_prompt_maker
from app.prompts.ais_prompt import ais_prompt_maker
from app.prompts.credit_score_prompt import credit_score_prompt_maker
from app.prompts.chat_prompt import chat_prompt_maker
from app.services.supabase import get_request

MEMORY_FILE = "conversation.json"

# Initialize Groq client
client = Groq(
    api_key=SETTINGS.groq_api_key,
)

async def fetch_llama(prompt: str):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            max_tokens=2048
        )
        return {
            "result": {
                "response": chat_completion.choices[0].message.content
            }
        }
    except Exception as e:
        return {"error": str(e)}

async def get_bank_statement_summary(statements: str):
    response = await fetch_llama(bank_statment_prompt_maker(statements=statements))
    return response["result"]["response"]

async def get_ais_summary(ais_text: str):
    response = await fetch_llama(ais_prompt_maker(ais_text=ais_text))
    return response["result"]["response"]

async def get_creditx_score(bank_summary: str, ais_summary: str, bureau_data: str):
    response = await fetch_llama(credit_score_prompt_maker(
        bank_summary=bank_summary, 
        ais_summary=ais_summary, 
        bureau_data=bureau_data
    ))

    # try:
    #     return json.loads(response["result"]["response"])
    # except json.JSONDecodeError:
    #     return {"error": "Invalid JSON", "raw_response": response["result"]["response"]}
    return response["result"]["response"]

def load_memory():
    try:
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def append_to_memory(request_id: str, user_query: str, ai_response: str):
    """Append only the new message pair to conversation memory."""
    try:
        with open(MEMORY_FILE, "r") as f:
            memory = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        memory = {}
    
    if request_id not in memory:
        memory[request_id] = {"conversation_memory": []}
        
    # Append only the new message pair
    memory[request_id]["conversation_memory"].append({"user": user_query, "ai": ai_response})
    
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=4)

async def chat(request_id: str, query: str):
    request_data = get_request(request_id=request_id)
    request_data = request_data.data[0]
    bank_summary = request_data["bank_summary"]
    ais_summary = request_data["ais_summary"]
    creditx_score = request_data["creditx_score"]

    # Load just the conversation history for the specific request
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

    # Only append the new message pair
    append_to_memory(request_id, query, ai_response)

    return ai_response