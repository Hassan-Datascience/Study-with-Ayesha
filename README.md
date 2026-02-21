# Study with Ayesha - AI Architectural Tutor

Study with Ayesha is a sophisticated AI-powered educational platform designed to assist students in mastering interior architecture and design principles. It features a modern, responsive web interface built with Next.js and a robust backend powered by Python and Google's Gemini AI.

## Key Features

*   **Bilingual AI Chatbot:** An intelligent chat interface that seamlessly communicates in both English and Urdu. The AI maintains conversational context and provides deep architectural insights.
*   **Image Analysis & Feedback:** Users can upload blueprints, sketches, or 3D renders. The AI analyzes the architectural properties, lighting, spatial flow, and material composition, returning detailed feedback.
*   **Robust Text-to-Speech (TTS):** The platform features a highly resilient, cross-browser Web Speech API implementation. It accurately reads out AI responses in both English and Urdu (leveraging Hindi TTS fallbacks for Nastaliq script compatibility on Chrome) with smart chunking to prevent browser timeouts.
*   **Voice Dictation Input:** Users can dictate their questions to the AI in either English or Urdu using the built-in microphone Web Speech recognition feature.
*   **Dynamic Language Context:** Deeply integrated state management allowing instant toggling between LTR English layouts and RTL Urdu (Nastaliq) UI layouts.

## Tech Stack

### Frontend
*   **Framework:** Next.js (React)
*   **Styling:** Tailwind CSS (Vanilla responsive utility classes)
*   **APIs:** Web Speech API (Synthesis for TTS, Recognition for STT)
*   **Icons:** Google Material Symbols

### Backend
*   **Language:** Python
*   **Core AI:** Google Gemini Pro & Gemini Vision APIs
*   **Framework:** FastAPI / Uvicorn (RESTful Architecture)
*   **Deployment config:** Gunicorn & Uvicorn workers

## Recent Updates
*   **TTS Engine Overhaul:** Fixed critical Chrome audio buffer drops (`interrupted` bugs) using recursive `requestAnimationFrame` delays and sentence-chunking algorithms.
*   **Input Refinements:** Replaced legacy attachment buttons with real-time browser-based voice dictation.
*   **UI Consolidation:** Streamlined the Image Upload interface for a cleaner user experience with unified TTS tracking.
