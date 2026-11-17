import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devflow';

  try {
    // Attempt standard connection to provided MONGO_URI
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to local MongoDB at ${mongoUri}.`);
    console.log('🔄 Initializing in-memory MongoDB server (mongodb-memory-server) for zero-config demo...');

    try {
      process.env.MONGOMS_STARTUP_TIMEOUT = '60000';
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { launchTimeout: 60000 },
      });
      const inMemoryUri = mongod.getUri();

      const conn = await mongoose.connect(inMemoryUri);
      console.log(`✅ In-Memory MongoDB Connected at: ${inMemoryUri}`);
    } catch (memErr) {
      console.error(`❌ MongoDB connection failed:`, memErr.message);
      console.log('ℹ️ Tip: To use your own MongoDB Atlas database, set MONGO_URI in server/.env');
      process.exit(1);
    }
  }
};
