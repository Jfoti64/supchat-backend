const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('User API', () => {
  let token;
  let user;

  beforeEach(async () => {
    user = await User.create({
      first_name: 'Initial',
      family_name: 'User',
      username: 'initialuser',
      password: 'initialpassword',
    });

    const loginRes = await request(app).post('/api/users/login').send({
      username: 'initialuser',
      password: 'initialpassword',
    });

    token = loginRes.body.token;
    console.log('Login Token:', token); // Log the token after login
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/users/register').send({
      first_name: 'John',
      family_name: 'Doe',
      username: 'johndoe',
      password: 'password123',
    });

    console.log('Register Response:', res.body);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', 'johndoe');
  });

  it('should get a single user by ID', async () => {
    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('Get User Response:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'initialuser');
  });

  it('should edit a single user by ID', async () => {
    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'John',
        family_name: 'Doe',
        bio: 'Hi I am John Doe',
        profile_picture: 'John Doe profile pic',
      });

    console.log('Edit User Response:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'initialuser');
    expect(res.body).toHaveProperty('first_name', 'John');
    expect(res.body).toHaveProperty('family_name', 'Doe');
    expect(res.body).toHaveProperty('bio', 'Hi I am John Doe');
    expect(res.body).toHaveProperty('profile_picture', 'John Doe profile pic');
  });

  it('should delete a single user by ID', async () => {
    const res = await request(app)
      .delete(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('Delete User Response:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });

  it('should log the existing user in', async () => {
    const res = await request(app).post('/api/users/login').send({
      username: user.username,
      password: 'initialpassword',
    });

    console.log('Login Response:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', user.username);
    expect(res.body).toHaveProperty('message', 'User login successful');
  });
});
