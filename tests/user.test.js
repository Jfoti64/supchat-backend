const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('User API', () => {
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
});
