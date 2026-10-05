const mongoose = require('mongoose');
const path = require('path');

let isConnected = false;
let mongodInstance = null;

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vexivo';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[VEXIVO DB] ✅ Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`[VEXIVO DB] Standard MongoDB server unavailable (${error.message}).`);
    console.log(`[VEXIVO DB] Initializing embedded MongoDB engine...`);

    try {
      const os = require('os');
      const fs = require('fs');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const uniqueDbPath = path.join(os.tmpdir(), `mongo-mem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`);
      fs.mkdirSync(uniqueDbPath, { recursive: true });

      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbPath: uniqueDbPath,
        },
      });
      const uri = mongodInstance.getUri();
      const conn = await mongoose.connect(uri);
      isConnected = true;
      console.log(`[VEXIVO DB] ✅ In-Memory MongoDB Initialized & Connected at: ${uri}`);
      return conn;
    } catch (memErr) {
      console.error(`[VEXIVO DB] Embedded DB error:`, memErr.message);
      throw memErr;
    }
  }
};

module.exports = connectDB;
