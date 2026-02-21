from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, image

app = FastAPI(
    title="Study with Ayesha API",
    description="Backend API for AI-powered education platform - No Auth, No Profile, Stateless API.",
    version="1.0.0"
)

# ---------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for local dev and open source deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Include Routers
# ---------------------------------------------------------
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(image.router, prefix="/api", tags=["Image"])

# ---------------------------------------------------------
# Health Check Endpoint
# ---------------------------------------------------------
@app.get("/health", tags=["System"], summary="Health Check")
async def health_check():
    """Returns a simple status ok to verify the backend is running."""
    return {"status": "ok"}
