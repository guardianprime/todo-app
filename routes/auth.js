
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', async (req, res) => {
  await User.create(req.body);
  res.redirect('/auth/login');
});

router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await user.comparePassword(req.body.password)) {
    req.session.userId = user._id;
    res.redirect('/tasks');
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
});

module.exports = router;
