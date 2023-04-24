const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const clothingItem = require("./routes/clothingItems");
const users = require("./routes/users");
const { ERROR_CODES } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
//   req.user = {
//     _id: "64342f75e7dfc32ad50072c7",
//   };
//   next();
// });

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/items", clothingItem);
app.use("/users", users);

app.use((req, res) => {
  res
    .status(ERROR_CODES.NotFound)
    .send({ message: "Requested resource not found" });
});

app.listen(PORT);
