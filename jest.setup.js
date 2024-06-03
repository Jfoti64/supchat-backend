const { connectTestDB, disconnectTestDB } = require('./config/mongoConfigTesting');
const mongoose = require('mongoose');

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await disconnectTestDB();
});
