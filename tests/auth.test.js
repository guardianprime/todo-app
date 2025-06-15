
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Auth', () => {
  let server;

  beforeAll(async () => {
    server = app.listen(4000);
    await User.deleteMany({});
  });

  afterAll(async () => {
    await server.close();
  });

  test('signup a new user', async () => {
    const res = await request(server)
      .post('/auth/signup')
      .type('form')
      .send({ username: 'jestuser', password: 'password123' });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/\/auth\/login$/);
  });

  test('login user', async () => {
    const res = await request(server)
      .post('/auth/login')
      .type('form')
      .send({ username: 'jestuser', password: 'password123' });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/\/tasks$/);
  });
});
