from openai import OpenAI
from core.config import settings

# Chat ke liye - OpenRouter client
chat_client = None
if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
    chat_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.GEMINI_API_KEY,
    )

# Image analysis ke liye - Groq client
groq_client = None
if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here":
    groq_client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=settings.GROQ_API_KEY,
    )

SYSTEM_PROMPT = """You are Ayesha, a kind, calm, respectful, and encouraging teacher.
Your target audience is students aged 8-14.
Explain everything in simple words, avoiding complex terminology.
Never assume prior knowledge.
Please keep your answers child-friendly and educational."""

def generate_chat_response(message: str, language: str) -> str:
    if not chat_client:
        return "Backend Error: API Key is not configured in .env file."

    lang_instruction = "Respond in simple, easy-to-understand English." if language == "en" else "Respond in simple, easy-to-understand Urdu."
    
    try:
        response = chat_client.chat.completions.create(
            model="arcee-ai/trinity-large-preview:free",
            messages=[
                {"role": "system", "content": f"{SYSTEM_PROMPT}\n{lang_instruction}"},
                {"role": "user", "content": message}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Sorry, I had trouble thinking about that. Please try again. (Error: {str(e)})"

def generate_image_explanation(image_base64: str, language: str) -> str:
    if not groq_client:
        return "Backend Error: Groq API Key is not configured in .env file."

    lang_instruction = "Explain this image in simple, easy-to-understand English." if language == "en" else "Explain this image in simple, easy-to-understand Urdu."
    text_prompt = f"Please look at the image and explain it simply to the student as if you are their teacher. {lang_instruction}"
    
    try:
        if "base64," in image_base64:
            base64_data = image_base64.split("base64,")[1]
        else:
            base64_data = image_base64
            
        image_url = f"data:image/jpeg;base64,{base64_data}"

        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": text_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url
                            }
                        }
                    ]
                }
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Sorry, I had trouble analyzing the image. Please try again. (Error: {str(e)})"