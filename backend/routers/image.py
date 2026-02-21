from fastapi import APIRouter
from schemas.request_response_models import ImageExplanationRequest, ImageExplanationResponse
from services.gemini_service import generate_image_explanation

router = APIRouter()

@router.post("/explain-image", response_model=ImageExplanationResponse, summary="Explain an uploaded image", description="Analyzes a base64 image using Gemini Vision and returns a simple explanation.")
async def explain_image_endpoint(request: ImageExplanationRequest):
    explanation = generate_image_explanation(request.image_base64, request.language)
    return ImageExplanationResponse(explanation=explanation)
