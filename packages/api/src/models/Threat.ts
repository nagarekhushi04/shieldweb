import mongoose, { Schema, Document } from 'mongoose';

export interface IThreat extends Document {
  urlHash: string;
  originalUrl: string;
  domain: string;
  threatType: string;
  severity: number;
  reportedBy: Array<{ walletAddress: string; timestamp: Date }>;
  mlScore: number;
  onChain: boolean;
  onChainTxHash: string;
  verified: boolean;
  verifiedBy: string;
  active: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ThreatSchema: Schema = new Schema({
  urlHash: { type: String, required: true, unique: true, index: true },
  originalUrl: { type: String, required: true },
  domain: { type: String, required: true, index: true },
  threatType: { type: String, enum: ['phishing', 'scam', 'malware', 'rug_pull', 'fake_wallet', 'other'], required: true },
  severity: { type: Number, min: 1, max: 4, required: true },
  reportedBy: [{
    walletAddress: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  mlScore: { type: Number, default: 0 },
  onChain: { type: Boolean, default: false },
  onChainTxHash: { type: String },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: String },
  active: { type: Boolean, default: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IThreat>('Threat', ThreatSchema);
