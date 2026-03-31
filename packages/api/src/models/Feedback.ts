import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  walletAddress: string;
  name: string;
  email: string;
  source: string;
  checkerWorked: string;
  rating: number;
  improvement: string;
  wouldRecommend: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  source: { type: String },
  checkerWorked: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  improvement: { type: String, maxlength: 500 },
  wouldRecommend: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
