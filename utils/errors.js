const ERROR_CODES = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  DefaultError: 500,
};

const handleOnFailError = () => {
  const error = new Error("Item not found");
  error.statusCode = 404;
  throw error;
};

const alreadyExistsErr = () => {
  const error = new Error("User with this email already exists");
  error.statusCode = 409;
  throw error;
};

const handleError = (err, res) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res
      .status(ERROR_CODES.BadRequest)
      .send({ message: "Bad Request, Invalid input" });

    return;
  }
  if (err.statusCode === 404) {
    res.status(ERROR_CODES.NotFound).send({ message: "Item not found" });
  } else if (err.statusCode === 409) {
    res
      .status(ERROR_CODES.Conflict)
      .send({ message: "A user with this email already exists" });
  } else if (err.message === "Incorrect email or password") {
    res
      .status(ERROR_CODES.Unauthorized)
      .send({ message: "Incorrect email or password" });
  } else {
    res
      .status(ERROR_CODES.DefaultError)
      .send({ message: "Something went wrong" });
  }
};

module.exports = {
  ERROR_CODES,
  handleOnFailError,
  handleError,
  alreadyExistsErr,
};
