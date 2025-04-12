from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import loan,users,chat,request,assistant


app = FastAPI(title="hackathon-backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(loan.router, tags=["Loan"],prefix="/loan")
app.include_router(users.router, tags=["User"],prefix="/user")
app.include_router(chat.router, tags=["Chat"],prefix="/chat")
app.include_router(request.router, tags=["Request"],prefix="/request")
app.include_router(assistant.router, tags=["Assistant"],prefix="/assistant")


@app.get("/")
async def root():
    return {"message": "Hello dashboard"}
