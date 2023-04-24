const ClothingItem = require("../models/clothingItem");
const {
  handleOnFailError,
  handleError,
  ERROR_CODES,
} = require("../utils/errors");

// return all clothing items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((data) => res.send({ data }))
    .catch((err) => {
      handleError(err, res);
    });
};

// create a new item

const createItem = (req, res) => {
  const owner = req.user._id;
  const createdAt = Date.now();
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    imageUrl,
    weather,
    owner,
    createdAt,
  })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

// delete an item by _id

const deleteItem = (req, res) => {
  ClothingItem.findById(req.params._id)
    .orFail(() => {
      handleOnFailError();
    })
    .then((item) => {
      if (String(item.owner) !== req.params._id) {
        return res
          .status(ERROR_CODES.Forbidden)
          .send({ message: "You are not authorized to delete this item" });
      }
      return item.deleteOne().then(() => {
        res.send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

// Like an item (update)

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      handleOnFailError();
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      handleError(err, res);
    });
};

// Dislike an ittem (update)

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      handleOnFailError();
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
