const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const {
  createUserValidation,
  loginValidation,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());

const routes = require("./routes");
app.use(requestLogger);

app.post("/signin", loginValidation, login);
app.post("/signup", createUserValidation, createUser);

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
