const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  handleOnFailError,
  handleError,
  alreadyExistsErr,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById({ _id })
    .orFail(() => {
      handleOnFailError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      handleError(err, res);
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    { _id },
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      handleOnFailError();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      handleError(err, res);
    });
};

// create new user (sign up)

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        alreadyExistsErr();
      }
      return bcrypt.hash(password, 10).then((hash) => {
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
          .catch(() => {
            handleError(err, res);
          });
      });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

// user log in

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
