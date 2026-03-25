if __name__ == "__main__":
    from predict import PhishingDetector
    d = PhishingDetector()
    d.train()
    print("Model trained and saved.")
