const router = require("express").Router();
const clothingItem = require("./clothingItems");
const users = require("./users");

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
