
const request = require('supertest');
const app = require('../app');

describe('Auth protection', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4002);
  });

  afterAll(async () => {
    await server.close();
  });

  test('redirect unauthenticated users to login', async () => {
    const res = await request(server).get('/tasks');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/\/auth\/login$/);
  });
});
