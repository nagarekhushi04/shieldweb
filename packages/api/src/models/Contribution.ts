import mongoose, { Schema, Document } from 'mongoose';

export interface IContribution extends Document {
  contributorWallet: string;
  type: 'report' | 'vote' | 'verify' | 'comment' | 'extension_install';
  referenceId?: string; // threatId or reportId
  points: number;
  weekNumber: number; // ISO Week Number
  year: number;
  createdAt: Date;
}

const ContributionSchema: Schema = new Schema({
  contributorWallet: { type: String, required: true, index: true },
  type: { 
    type: String, 
    enum: ['report', 'vote', 'verify', 'comment', 'extension_install'],
    required: true 
  },
  referenceId: { type: String },
  points: { type: Number, required: true },
  weekNumber: { type: Number, required: true, index: true },
  year: { type: Number, required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for weekly leaderboard queries
ContributionSchema.index({ year: 1, weekNumber: 1, points: -1 });

export default mongoose.model<IContribution>('Contribution', ContributionSchema);
