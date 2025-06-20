const express = require("express");
require("dotenv").config();
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const logger = require("./utils/logger");

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => res.redirect("/tasks"));

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  res.status(err.status || 500);
  res.render("error", { message: err.message, error: err });
});

module.exports = app;

if (require.main === module) {
  app.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
  );
}
