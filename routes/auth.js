const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => res.render("signup"));
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();
    req.session.userId = user._id;
    res.redirect("/tasks");
  } catch (err) {
    next(err);
  }
});

router.get("/login", (req, res) => res.render("login"));
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && (await user.comparePassword(req.body.password))) {
    req.session.userId = user._id;
    res.redirect("/tasks");
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/auth/login"));
});

module.exports = router;
