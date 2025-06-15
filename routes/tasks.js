
const express = require('express');
const router = express.Router();
const Task = require('../models/task');

function isLoggedIn(req, res, next) {
  if (!req.session.userId) return res.redirect('/auth/login');
  next();
}

router.use(isLoggedIn);

router.get('/', async (req, res) => {
  const filter = { user: req.session.userId };
  if (req.query.status) filter.status = req.query.status;
  const tasks = await Task.find(filter);
  res.render('tasks', { tasks });
});

router.post('/new', async (req, res) => {
  await Task.create({ ...req.body, user: req.session.userId });
  res.redirect('/tasks');
});

router.post('/:id/complete', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { status: 'completed' });
  res.redirect('/tasks');
});

router.post('/:id/delete', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { status: 'deleted' });
  res.redirect('/tasks');
});

module.exports = router;
