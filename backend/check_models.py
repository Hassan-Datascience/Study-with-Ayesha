import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

try:
    print("Fetching models...")
    models = list(genai.list_models())
    print(f"Found {len(models)} models.")
    for m in models:
        print(f"{m.name} - methods: {m.supported_generation_methods}")
except Exception as e:
    import traceback
    traceback.print_exc()
