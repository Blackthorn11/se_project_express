const ClothingItem = require("../models/clothingItem");
const { handleOnFailError, handleError } = require("../utils/errors");

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
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

// delete an item by _id

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      handleOnFailError();
    })
    .then((card) => res.status(200).send({ card }))
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
    .then((item) => res.status(200).send({ data: item }))
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
    .then((item) => res.status(200).send({ data: item }))
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
