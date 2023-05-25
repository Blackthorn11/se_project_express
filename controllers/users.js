const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

const User = require("../models/user");

const BadRequestError = require("../utils/errors/badRequestError");
const UnauthorizedError = require("../utils/errors/unauthorizedError");
const NotFoundError = require("../utils/errors/notFoundError");
const ConflictError = require("../utils/errors/conflictError");

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById({ _id })
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, invalid ID"));
      } else {
        next(err);
      }
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
        next(new BadRequestError("Bad request, invalid data"));
      } else {
        next(err);
      }
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
              new ConflictError("A user with the current email aleady exists")
            );
          }
          if (err.name === "ValidationError") {
            next(new BadRequestError("Bad request, invalid data input"));
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
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
