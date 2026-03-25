import os
import re
import math
import joblib
import pandas as pd
import numpy as np
import tldextract
from urllib.parse import urlparse
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

class PhishingDetector:
    def __init__(self):
        self.model = None
        self._is_loaded = False
        self.model_path = os.path.join(os.path.dirname(__file__), "phishing_model.joblib")
        
        self.suspicious_tlds = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.pw', '.top', '.click', '.online']
        self.brands = ['metamask', 'opensea', 'uniswap', 'coinbase', 'binance', 'ledger', 'trezor', 'phantom', 'trustwallet', 'rarible']
        self.suspicious_keywords = ['secure', 'login', 'verify', 'update', 'confirm', 'wallet', 'connect', 'claim', 'airdrop', 'free', 'win', 'urgent']
        
        self.feature_names = [
            'url_length', 'num_dots', 'num_hyphens', 'num_underscores', 'num_at_signs', 
            'num_question_marks', 'has_ip', 'url_entropy', 'domain_length', 'subdomain_count', 
            'tld_suspicious', 'has_https', 'brand_impersonation', 'suspicious_keywords', 
            'hex_in_domain', 'double_slash_count', 'path_depth'
        ]

    def _entropy(self, string):
        if not string:
            return 0.0
        prob = [float(string.count(c)) / len(string) for c in dict.fromkeys(list(string))]
        entropy = -sum([p * math.log(p) / math.log(2.0) for p in prob])
        return entropy

    def extract_features(self, url):
        parsed = urlparse(url)
        ext = tldextract.extract(url)
        
        domain_full = f"{ext.domain}.{ext.suffix}" if ext.suffix else ext.domain
        domain_only = ext.domain
        subdomain = ext.subdomain
        
        has_ip = 1 if re.match(r"^(\d{1,3}\.){3}\d{1,3}$", domain_full) else 0
        tld_suspicious = 1 if f".{ext.suffix}" in self.suspicious_tlds else 0
        has_https = 1 if parsed.scheme == "https" else 0
        
        brand_impersonation = 0
        for brand in self.brands:
            if brand in domain_only or brand in subdomain:
                if domain_full not in [f"{brand}.io", f"{brand}.com", f"{brand}.org", f"{brand}.app"]:
                    brand_impersonation = 1
                    break
                    
        keyword_count = sum(1 for kw in self.suspicious_keywords if kw in url.lower())
        hex_in_domain = 1 if re.search(r'[0-9a-f]{10,}', domain_only) else 0
        
        return {
            'url_length': len(url),
            'num_dots': url.count('.'),
            'num_hyphens': url.count('-'),
            'num_underscores': url.count('_'),
            'num_at_signs': url.count('@'),
            'num_question_marks': url.count('?'),
            'has_ip': has_ip,
            'url_entropy': self._entropy(url) if url else 0,
            'domain_length': len(domain_full),
            'subdomain_count': len([s for s in subdomain.split('.') if s]) if subdomain else 0,
            'tld_suspicious': tld_suspicious,
            'has_https': has_https,
            'brand_impersonation': brand_impersonation,
            'suspicious_keywords': keyword_count,
            'hex_in_domain': hex_in_domain,
            'double_slash_count': url.count('//'),
            'path_depth': len([p for p in parsed.path.split('/') if p])
        }

    def generate_training_data(self):
        data = []
        
        # 300 legitimate (label=0)
        safe_base = ['etherscan.io', 'opensea.io', 'uniswap.org', 'metamask.io', 'coinbase.com', 'binance.com', 'ledger.com', 'phantom.app', 'rarible.com', 'looksrare.org']
        for i in range(300):
            domain = safe_base[i % len(safe_base)]
            url = f"https://{domain}/path{i}?q=test"
            if i % 3 == 0: url = f"https://{domain}"
            data.append({"url": url, "label": 0})
            
        # 300 phishing (label=1)
        phish_base = [
            'metamask-airdrop-claim.xyz', 'opensea-mint-free.io', 'uniswap-token-claim.net', 
            'wallet-connect-verify.com', 'ethereum-bridge-secure.org', 'login-metamask.info',
            'verify-ledger-secure.tk', '192.168.1.1', 'phantom-wallet-update.pw'
        ]
        for i in range(300):
            domain = phish_base[i % len(phish_base)]
            url = f"http://{domain}/secure/login"
            if i % 2 == 0: url = f"https://{domain}/claim?id=0x{'a'*10}"
            data.append({"url": url, "label": 1})
            
        return pd.DataFrame(data)

    def load_or_train(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            self._is_loaded = True
        else:
            self.train()
            self._is_loaded = True

    def train(self):
        df = self.generate_training_data()
        
        X_list = [self.extract_features(url) for url in df['url']]
        X = pd.DataFrame(X_list)[self.feature_names]
        y = df['label']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
        self.model.fit(X_train, y_train)
        
        preds = self.model.predict(X_test)
        print(f"Accuracy: {accuracy_score(y_test, preds)}")
        
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)

    def is_loaded(self):
        return self._is_loaded

    def predict(self, url):
        if not self._is_loaded:
            self.load_or_train()
            
        features_dict = self.extract_features(url)
        df_features = pd.DataFrame([features_dict])[self.feature_names]
        
        proba = self.model.predict_proba(df_features)[0]
        score = float(proba[1])
        
        prediction = "phishing" if score > 0.7 else "suspicious" if score > 0.4 else "safe"
        
        risk_factors = []
        if features_dict['tld_suspicious'] == 1:
            risk_factors.append(f"Suspicious TLD")
        if features_dict['brand_impersonation'] == 1:
            risk_factors.append("Brand impersonation detected")
        if features_dict['url_entropy'] > 4.5:
            risk_factors.append("High URL entropy")
        if features_dict['has_ip'] == 1:
            risk_factors.append("IP address used as domain")
        if features_dict['suspicious_keywords'] > 0:
            risk_factors.append(f"Suspicious keywords")
        if features_dict['hex_in_domain'] == 1:
            risk_factors.append("Hex sequences in domain")
            
        return {
            "url": url,
            "score": score,
            "prediction": prediction,
            "confidence": float(max(proba)),
            "features": features_dict,
            "risk_factors": risk_factors
        }
