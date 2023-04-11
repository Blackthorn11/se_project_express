const User = require("../models/user");
const { handleOnFailError, handleError } = require("../utils/errors");

// return all users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      handleError(err, res);
    });
};

// return a user by _id

const getUser = (req, res) => {
  const { _id } = req.params;
  User.findById({ _id })
    .orFail(() => {
      handleOnFailError();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      handleError(err, res);
    });
};

// create new user

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
