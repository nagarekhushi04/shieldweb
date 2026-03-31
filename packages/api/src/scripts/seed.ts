import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Threat from '../models/Threat';
import Contribution from '../models/Contribution';
import Feedback from '../models/Feedback';
// @ts-ignore
import usersData from '../data/users.json';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shieldweb3';

const FEEDBACK_SAMPLES = [
    { name: "Shantanu Udhane", email: "udhaneshantanu@gmail.com", rating: 5, improvement: "perfect integration and ui layout", wouldRecommend: "yes" },
    { name: "Vaibhavi Agale", email: "vaibhaviagale7799@gmail.com", rating: 5, improvement: "I loved the smooth interface and overall features. App is easy to use.", wouldRecommend: "yes" },
    { name: "Neel pote", email: "neelpote44@gmail.com", rating: 4, improvement: "the ux was good the colors were also nicely implemented", wouldRecommend: "yes" },
    { name: "Tanmay tadd", email: "tanmaytad23@gmail.com", rating: 5, improvement: "very good problem solving application", wouldRecommend: "yes" },
    { name: "Omkar nanavare", email: "omkarnanavare1969@gmail.com", rating: 5, improvement: "Excellent UI and Functionality", wouldRecommend: "yes" },
    { name: "yash annadate", email: "yashannadate2005@gmail.com", rating: 5, improvement: "its overall good but expand the users..", wouldRecommend: "maybe" },
    { name: "Thanchan Bhumij", email: "thanchanb@gmail.com", rating: 5, improvement: "The application is good just focused on the features", wouldRecommend: "yes" },
    { name: "Aravind Deshmukh", email: "aravind.deshmukh@gmail.com", rating: 5, improvement: "Stellar escrow saves merchants from scams. UI is very intuitive.", wouldRecommend: "yes" }
];

const THREAT_SAMPLES = [
    { domain: "stellar-gives.com", threatType: "phishing", severity: 4, description: "Fake XLM giveaway site targeting newcomers." },
    { domain: "freighter-verify.net", threatType: "fake_wallet", severity: 3, description: "Malicious pop-up mimicking the Freighter extension UI." },
    { domain: "lobstr-support.io", threatType: "scam", severity: 4, description: "Phishing site asking for secret keys to 'fix' account issues." },
    { domain: "airdrop-stellar.org", threatType: "phishing", severity: 3, description: "Promising huge rewards for connecting wallet." },
    { domain: "stellar-explorer.co", threatType: "scam", severity: 2, description: "Typosquatted domain redirecting to malicious ads." }
];

async function seed() {
    try {
        console.log('🚀 Starting Seeding Process...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Clear existing data to ensure "Final" state
        await Promise.all([
            User.deleteMany({}),
            Threat.deleteMany({}),
            Contribution.deleteMany({}),
            Feedback.deleteMany({})
        ]);
        console.log('🗑️  Cleared existing collections');

        // 2. Create Users from users.json
        const createdUsers = await Promise.all(usersData.slice(0, 32).map(async (u: any, index: number) => {
            return User.create({
                walletAddress: u.wallet,
                joinedAt: new Date(Date.now() - (index * 3600000 * 12)), 
                totalReports: Math.floor(Math.random() * 5) + 1,
                verifiedReports: Math.floor(Math.random() * 3),
                shw3Balance: Math.floor(Math.random() * 50) + 10,
                onboardingComplete: true
            });
        }));
        console.log(`👤 Created ${createdUsers.length} active project users`);

        // 3. Create initial Threats
        await Promise.all(THREAT_SAMPLES.map(async (sample, i) => {
            const reporter = createdUsers[i % createdUsers.length];
            return Threat.create({
                domain: sample.domain,
                originalUrl: `https://${sample.domain}/claim-reward`,
                urlHash: Buffer.from(sample.domain).toString('base64'),
                threatType: sample.threatType,
                severity: sample.severity,
                description: sample.description,
                verified: i < 3,
                verifiedBy: i < 3 ? createdUsers[0].walletAddress : undefined,
                reportedBy: [{ 
                    walletAddress: reporter.walletAddress, 
                    timestamp: new Date(Date.now() - 3600000 * (i + 1)) 
                }],
                upvotes: Math.floor(Math.random() * 10)
            });
        }));
        console.log(`⚠️  Created ${THREAT_SAMPLES.length} initial verified threats`);

        // Seed Feedback from real user reviews
        await Promise.all(FEEDBACK_SAMPLES.map(async (fb, i) => {
            return Feedback.create({
                walletAddress: createdUsers[i].walletAddress,
                name: fb.name,
                email: fb.email,
                rating: fb.rating,
                improvement: fb.improvement,
                wouldRecommend: fb.wouldRecommend,
                checkerWorked: 'yes',
                source: 'demo_submission'
            });
        }));
        console.log(`💬 Successfully seeded community feedback entries`);

        console.log('✨ Seeding Completed Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding Failed:', err);
        process.exit(1);
    }
}

seed();
