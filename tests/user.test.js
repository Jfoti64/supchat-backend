const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('User API', () => {
  let defaultUser;

  beforeEach(async () => {
    // Adding initial data setup
    defaultUser = await User.create({
      first_name: 'Initial',
      family_name: 'User',
      username: 'initialuser',
      password: 'initialpassword',
    });
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/users/register').send({
      first_name: 'John',
      family_name: 'Doe',
      username: 'johndoe',
      password: 'password123',
    });

    console.log('Register Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', 'johndoe');
  });

  it('should get a single user by ID', async () => {
    const user = await User.create({
      first_name: 'Jane',
      family_name: 'Doe',
      username: 'janedoe',
      password: 'password123',
    });

    const res = await request(app).get(`/api/users/${user._id}`);

    console.log('Get User Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'janedoe');
  });

  it('should edit a single user by ID', async () => {
    const res = await request(app).put(`/api/users/${defaultUser._id}`).send({
      first_name: 'John',
      family_name: 'Doe',
      bio: 'Hi I am John Doe',
      profile_picture: 'John Doe profile pic',
    });

    console.log('Edit User Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'initialuser');
    expect(res.body).toHaveProperty('first_name', 'John');
    expect(res.body).toHaveProperty('family_name', 'Doe');
    expect(res.body).toHaveProperty('bio', 'Hi I am John Doe');
    expect(res.body).toHaveProperty('profile_picture', 'John Doe profile pic');
  });

  it('should delete a single user by ID', async () => {
    const res = await request(app).delete(`/api/users/${defaultUser._id}`);

    console.log('Delete User Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });

  it('should log the existing user in', async () => {
    const res = await request(app).post('/api/users/login').send({
      username: defaultUser.username,
      password: 'initialpassword', // Use the plain password for login
    });

    console.log('Login Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', defaultUser.username);
    expect(res.body).toHaveProperty('message', 'User login successful');
  });
});
