from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model.predict import PhishingDetector
from typing import Optional, List
import logging

app = FastAPI(title="ShieldWeb3 ML Service", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
detector = PhishingDetector()

class URLRequest(BaseModel):
    url: str
    context: Optional[str] = None

class BatchRequest(BaseModel):
    urls: List[str]

@app.on_event("startup")
async def startup(): 
    detector.load_or_train()

@app.get("/health")
def health(): 
    return {"status":"ok","model_loaded":detector.is_loaded(),"version":"1.0.0"}

@app.post("/predict")
def predict(req: URLRequest): 
    return detector.predict(req.url)

@app.post("/predict/batch")
def batch(req: BatchRequest): 
    return [detector.predict(u) for u in req.urls[:20]]
