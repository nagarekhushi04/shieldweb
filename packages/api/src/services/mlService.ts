import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const riskKeywords = ['login', 'verify', 'wallet', 'secure', 'account', 'update', 'auth'];
const badTlds = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.pw', '.top', '.click', '.online'];
const impersonations = ['metamask', 'opensea', 'uniswap', 'coinbase', 'ledger', 'phantom', 'trustwallet'];

export const scoreUrl = async (url: string): Promise<{score:number, prediction:string, features:any, riskFactors:string[]}> => {
  try {
      if (process.env.ML_SERVICE_URL) {
          const params = { url };
          const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, params);
          if (response.data && response.data.score !== undefined) {
             return response.data;
          }
      }
  } catch (err) {
      // Fallback
  }

  // Fallback heuristic
  let score = 0;
  const riskFactors: string[] = [];
  try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.toLowerCase();
      
      const tldMatch = badTlds.some(tld => host.endsWith(tld));
      if (tldMatch) { score += 0.3; riskFactors.push("Suspicious TLD"); }
      
      const brandMatch = impersonations.some(brand => host.includes(brand) && !host.endsWith(`${brand}.io`) && !host.endsWith(`${brand}.com`));
      if (brandMatch) { score += 0.4; riskFactors.push("Brand Impersonation"); }
      
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(host)) { score += 0.4; riskFactors.push("IP address in domain"); }
      
      if (url.length > 100) { score += 0.2; riskFactors.push("Excessive URL length"); }
      
      const parts = host.split('.');
      if (parts.length > 4) { score += 0.3; riskFactors.push("Excessive subdomains"); }
      
      if (/[0-9a-f]{10,}/.test(host)) { score += 0.3; riskFactors.push("Hex strings in domain"); }
      
  } catch (e) {
      score += 0.8; 
      riskFactors.push("Invalid URL structure");
  }

  score = Math.min(score, 1);
  const prediction = score > 0.7 ? "phishing" : (score > 0.4 ? "suspicious" : "safe");

  return { score, prediction, features: {}, riskFactors };
};
