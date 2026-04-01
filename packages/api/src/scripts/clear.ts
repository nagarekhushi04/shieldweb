import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function clearDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shieldweb3';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
        console.error('❌ Mongoose connection DB is undefined.');
        process.exit(1);
    }
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      console.log(`🗑️ Dropped collection: ${collection.name}`);
    }

    console.log('✨ Database cleared successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing database:', err);
    process.exit(1);
  }
}

clearDB();
