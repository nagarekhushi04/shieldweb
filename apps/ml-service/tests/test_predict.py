import pytest
from model.predict import PhishingDetector
from main import batch, BatchRequest

detector = PhishingDetector()
detector.load_or_train()

def test_safe_url(): 
    assert detector.predict("https://opensea.io")["prediction"] == "safe"

def test_phishing_url(): 
    assert detector.predict("https://metamask-airdrop-claim.xyz")["score"] > 0.5

def test_batch(): 
    results = batch(BatchRequest(urls=["https://opensea.io","https://scam.xyz"]))
    assert len(results) == 2
