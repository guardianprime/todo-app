
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Task = require('../models/task');

describe('Task', () => {
  let server;
  let agent;
  let userId;

  beforeAll(async () => {
    server = app.listen(4001);
    agent = request.agent(server);

    await User.deleteMany({});
    await Task.deleteMany({});
    const user = await User.create({ username: 'taskuser', password: 'pass123' });
    userId = user._id;

    await agent
      .post('/auth/login')
      .type('form')
      .send({ username: 'taskuser', password: 'pass123' });
  });

  afterAll(async () => {
    await server.close();
  });

  test('create task', async () => {
    const res = await agent
      .post('/tasks/new')
      .type('form')
      .send({ title: 'Jest Task', description: 'Task for Jest' });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/\/tasks$/);
  });

  test('list tasks', async () => {
    const res = await agent.get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Jest Task');
  });

  test('complete task', async () => {
    const task = await Task.findOne({ title: 'Jest Task' });
    const res = await agent.post(`/tasks/${task._id}/complete`);
    expect(res.statusCode).toBe(302);

    const updated = await Task.findById(task._id);
    expect(updated.status).toBe('completed');
  });

  test('delete task', async () => {
    const task = await Task.findOne({ title: 'Jest Task' });
    const res = await agent.post(`/tasks/${task._id}/delete`);
    expect(res.statusCode).toBe(302);

    const updated = await Task.findById(task._id);
    expect(updated.status).toBe('deleted');
  });

  test('filter tasks by status', async () => {
    await Task.create({ title: 'Pending Task', user: userId, status: 'pending' });
    const res = await agent.get('/tasks?status=pending');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Pending Task');
    expect(res.text).not.toContain('Jest Task');
  });
});
