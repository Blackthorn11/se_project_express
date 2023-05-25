const router = require("express").Router();
const clothingItem = require("./clothingItems");
const users = require("./users");
const NotFoundError = require("../utils/errors/notFoundError");

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
