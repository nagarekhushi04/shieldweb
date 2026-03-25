import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  email?: string;
  name?: string;
  totalReports: number;
  verifiedReports: number;
  totalRewardsEarned: number;
  shw3Balance: number;
  reputation: number;
  joinedAt: Date;
  lastActive: Date;
  isAdmin: boolean;
}

const UserSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true, index: true },
  email: { type: String },
  name: { type: String },
  totalReports: { type: Number, default: 0 },
  verifiedReports: { type: Number, default: 0 },
  totalRewardsEarned: { type: Number, default: 0 },
  shw3Balance: { type: Number, default: 0 },
  reputation: { type: Number, default: 100 },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date },
  isAdmin: { type: Boolean, default: false }
});

export default mongoose.model<IUser>('User', UserSchema);
