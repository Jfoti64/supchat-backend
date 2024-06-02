const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('./config/mongoConfigTesting');
const dotenv = require('dotenv');

dotenv.config({ path: './.env.test' });

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await disconnectDB();
});
