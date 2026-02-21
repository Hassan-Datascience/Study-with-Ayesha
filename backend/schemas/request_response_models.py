from pydantic import BaseModel, Field
from typing import Literal

# --- Chat Models ---

class ChatRequest(BaseModel):
    message: str = Field(..., description="The student's message")
    language: Literal["en", "ur"] = Field("en", description="Target language: 'en' for English, 'ur' for Urdu")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Ayesha's response")

# --- Image Explanation Models ---

class ImageExplanationRequest(BaseModel):
    image_base64: str = Field(..., description="Base64 encoded string of the image")
    language: Literal["en", "ur"] = Field("en", description="Target language: 'en' for English, 'ur' for Urdu")

class ImageExplanationResponse(BaseModel):
    explanation: str = Field(..., description="Ayesha's explanation of the image")
