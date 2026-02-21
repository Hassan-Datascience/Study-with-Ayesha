from fastapi import APIRouter
from schemas.request_response_models import ChatRequest, ChatResponse
from services.gemini_service import generate_chat_response

router = APIRouter()

@router.post("/chat", response_model=ChatResponse, summary="Send an AI chat message", description="Receives a user message and returns a child-friendly explanation via Gemini Text API.")
async def chat_endpoint(request: ChatRequest):
    reply = generate_chat_response(request.message, request.language)
    return ChatResponse(reply=reply)
