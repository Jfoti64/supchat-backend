const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');

describe('Message API', () => {
  let user1;
  let user2;
  let conversation;

  beforeAll(async () => {
    // Create users
    user1 = await User.create({
      first_name: 'User',
      family_name: 'One',
      username: 'userone',
      password: await bcrypt.hash('password1', 10),
    });

    user2 = await User.create({
      first_name: 'User',
      family_name: 'Two',
      username: 'usertwo',
      password: await bcrypt.hash('password2', 10),
    });
  });

  afterEach(async () => {
    await Conversation.deleteMany({});
    await Message.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create a conversation and send a message', async () => {
    const res = await request(app).post('/api/messages/send').send({
      senderId: user1._id,
      receiverId: user2._id,
      content: 'Hello, User Two!',
    });

    console.log('Send Message Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('senderId', user1._id.toString());
    expect(res.body).toHaveProperty('receiverId', user2._id.toString());
    expect(res.body).toHaveProperty('content', 'Hello, User Two!');

    // Check if the conversation was created
    conversation = await Conversation.findOne({
      participants: { $all: [user1._id, user2._id] },
    });

    expect(conversation).not.toBeNull();
    expect(conversation.participants).toContainEqual(user1._id);
    expect(conversation.participants).toContainEqual(user2._id);
  });

  it('should retrieve messages in a conversation', async () => {
    conversation = await Conversation.create({
      participants: [user1._id, user2._id],
    });

    const message1 = await Message.create({
      conversationId: conversation._id,
      senderId: user1._id,
      receiverId: user2._id,
      content: 'Hello, User Two!',
    });

    const message2 = await Message.create({
      conversationId: conversation._id,
      senderId: user2._id,
      receiverId: user1._id,
      content: 'Hello, User One!',
    });

    const res = await request(app).get(`/api/messages/${conversation._id}`);

    console.log('Get Messages Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('_id', message1._id.toString());
    expect(res.body[0]).toHaveProperty('content', 'Hello, User Two!');
    expect(res.body[1]).toHaveProperty('_id', message2._id.toString());
    expect(res.body[1]).toHaveProperty('content', 'Hello, User One!');
  });
});
