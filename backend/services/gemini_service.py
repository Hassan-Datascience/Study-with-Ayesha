import google.generativeai as genai
from core.config import settings
import base64
import io
from PIL import Image

# Configure API Key if available
if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=settings.GEMINI_API_KEY)

SYSTEM_PROMPT = """You are Ayesha, a kind, calm, respectful, and encouraging teacher.
Your target audience is students aged 8-14.
Explain everything in simple words, avoiding complex terminology.
Never assume prior knowledge.
Please keep your answers child-friendly and educational."""

def get_best_model(task_type="text"):
    """Dynamically fetches the best available model for the user's API key."""
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        if not models:
            return None
        
        # Try to find a flash model for speed, otherwise take the first available
        for m in models:
            if 'flash' in m.lower():
                return m
        return models[0]
    except Exception:
        # Fallback if list_models fails
        return 'gemini-1.5-flash' if task_type == 'text' else 'gemini-1.5-flash'

def generate_chat_response(message: str, language: str) -> str:
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        return "Backend Error: Gemini API Key is not configured in .env file."

    lang_instruction = "Respond in simple, easy-to-understand English." if language == "en" else "Respond in simple, easy-to-understand Urdu."
    prompt = f"{SYSTEM_PROMPT}\n{lang_instruction}\n\nStudent asks: {message}"
    
    try:
        model_name = get_best_model("text")
        if not model_name:
            return "Backend Error: Your API key does not have access to any generateContent models."
            
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Sorry, I had trouble thinking about that. Please try again. (Error: {str(e)})"

def generate_image_explanation(image_base64: str, language: str) -> str:
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        return "Backend Error: Gemini API Key is not configured in .env file."

    lang_instruction = "Explain this image in simple, easy-to-understand English." if language == "en" else "Explain this image in simple, easy-to-understand Urdu."
    prompt = f"{SYSTEM_PROMPT}\n{lang_instruction}\n\nPlease look at the image and explain it simply to the student as if you are their teacher."
    
    try:
        if "base64," in image_base64:
            base64_data = image_base64.split("base64,")[1]
        else:
            base64_data = image_base64
            
        image_bytes = base64.b64decode(base64_data)
        img = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        return "Sorry, there was an error processing the image data."

    try:
        model_name = get_best_model("vision")
        if not model_name:
            return "Backend Error: Your API key does not have access to any generateContent models."
            
        model = genai.GenerativeModel(model_name)
        response = model.generate_content([prompt, img])
        return response.text
    except Exception as e:
        return f"Sorry, I had trouble analyzing the image. Please try again. (Error: {str(e)})"

