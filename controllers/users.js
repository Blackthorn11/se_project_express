const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const badRequestError = require("../utils/errors/badRequestError");
const unauthorizedError = require("../utils/errors/unauthorizedError");
const notFoundError = require("../utils/errors/notFoundError");
const conflictError = require("../utils/errors/conflictError");

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById({ _id })
    .then((user) => {
      if (!user) {
        next(new notFoundError("User not found"));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new badRequestError("Bad request, invalid ID"));
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    { _id },
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new badRequestError("Bad request, invalid data"));
      }
      next(err);
    });
};

// create new user (sign up)

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
        .then((item) =>
          res.setHeader("Content-Type", "application/json").status(201).send({
            name: item.name,
            avatar: item.avatar,
            email: item.email,
          })
        )
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new conflictError("A user with the current email aleady exists")
            );
          }
          if (err.name === "ValidationError") {
            next(new badRequestError("Bad request, invalid data input"));
          }
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// user log in

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch(() => {
      next(new unauthorizedError("Incorrect email or password"));
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
