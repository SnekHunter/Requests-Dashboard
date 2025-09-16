"""
FastAPI backend for the Requests Dashboard.
- Uses Supabase as the database via the supabase-py client.
- Provides simple endpoints to list, create, and update (ack/complete) requests.

Notes:
- Ensure SUPABASE_URL and SUPABASE_KEY are set in backend/.env (or environment).
- Install dependencies from requirements.txt before running.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "backend", ".env"))

app = FastAPI()

# Allow the React dev server to talk to this API during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read Supabase settings from environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize the supabase client if credentials are present
supabase: Optional[Client]
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None

# Simple Pydantic models for request payloads and responses
class RequestIn(BaseModel):
    customer_name: str
    request_details: str

class RequestUpdate(BaseModel):
    status: str

class RequestOut(BaseModel):
    id: Optional[int]
    customer_name: str
    request_details: str
    status: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


def get_db() -> Client:
    """Return the initialized Supabase client or raise an error if not configured.
    This gives clearer errors during development if environment variables are missing.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY in backend/.env or environment.")
    return supabase


@app.get("/api/requests", response_model=List[RequestOut])
async def get_requests():
    """Get all customer requests from Supabase.
    Returns a list of request objects.
    """
    db = get_db()
    try:
        resp = db.table("requests").select("*").order("created_at", asc=True).execute()
        data = getattr(resp, "data", resp)
        return data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/requests", response_model=RequestOut)
async def create_request(req: RequestIn):
    """Create a new customer request. The frontend only needs to send
    customer_name and request_details. The backend sets default status and timestamps.
    """
    db = get_db()
    payload = {
        "customer_name": req.customer_name,
        "request_details": req.request_details,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
    }
    try:
        resp = db.table("requests").insert(payload).execute()
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=500, detail="Failed to create request")
        return data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/requests/{request_id}", response_model=RequestOut)
async def update_request(request_id: int, update: RequestUpdate):
    """Update the status of an existing request (e.g. acknowledge or complete).
    The frontend should send { status: "acknowledged" } as a JSON body.
    """
    db = get_db()
    try:
        resp = db.table("requests").update({
            "status": update.status,
            "updated_at": datetime.utcnow().isoformat(),
        }).eq("id", request_id).execute()
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=404, detail="Request not found")
        return data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    # Run with `python app.py` for quick local development. For production use
    # a proper ASGI server/process manager.
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
