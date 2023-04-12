const router = require("express").Router();
const clothingItem = require("./clothingItems");
const users = require("./users");
const { handleError } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
  handleError(err, res);
});

module.exports = router;
