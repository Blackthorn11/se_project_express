const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  createItemValidation,
  idValidation,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", auth, createItemValidation, createItem);
router.delete("/:itemId", auth, idValidation, deleteItem);
router.put("/:itemId/likes", auth, idValidation, likeItem);
router.delete("/:itemId/likes", auth, idValidation, dislikeItem);

module.exports = router;
