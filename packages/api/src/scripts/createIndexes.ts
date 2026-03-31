import Threat from '../models/Threat';
import User from '../models/User';

export const createIndexes = async () => {
    try {
        console.log('🚀 Creating MongoDB Indexes...');

        // Threat model indexes
        await Threat.collection.createIndex({ urlHash: 1 }, { unique: true });
        await Threat.collection.createIndex({ domain: 1 });
        await Threat.collection.createIndex({ threatType: 1 });
        await Threat.collection.createIndex({ verified: 1 });
        await Threat.collection.createIndex({ severity: -1 });
        await Threat.collection.createIndex({ createdAt: -1 });
        await Threat.collection.createIndex({ domain: 1, threatType: 1 });
        await Threat.collection.createIndex({ verified: 1, createdAt: -1 });

        // User model indexes  
        await User.collection.createIndex({ walletAddress: 1 }, { unique: true });
        await User.collection.createIndex({ verifiedReports: -1 });
        await User.collection.createIndex({ reputation: -1 });
        await User.collection.createIndex({ joinedAt: -1 });

        // Compound index for leaderboard query
        await User.collection.createIndex({ verifiedReports: -1, reputation: -1 });

        console.log('✅ MongoDB Indexes created successfully.');
    } catch (err) {
        console.error('❌ Error creating indexes:', err);
    }
};
