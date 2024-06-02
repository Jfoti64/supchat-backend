const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);

    mongoose.connection.on('error', (e) => {
      console.log('MongoDB connection error:', e);
    });

    mongoose.connection.once('open', () => {
      console.log(`MongoDB successfully connected to ${mongoUri}`);
    });
  } catch (error) {
    console.error('Error connecting to in-memory MongoDB:', error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    await mongoServer.stop();
  } catch (error) {
    console.error('Error disconnecting from in-memory MongoDB:', error.message);
    throw error;
  }
};

module.exports = { connectDB, disconnectDB };
