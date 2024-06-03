// db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(process.env.MONGO_URI);

    mongoose.connection.on('error', (e) => {
      console.error('MongoDB connection error:', e);
    });

    mongoose.connection.once('open', () => {
      console.log('MongoDB successfully connected...');
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
