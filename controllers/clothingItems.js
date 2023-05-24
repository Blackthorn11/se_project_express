const ClothingItem = require("../models/clothingItem");
const badRequestError = require("../utils/errors/badRequestError");
const forbiddenError = require("../utils/errors/forbiddenError");
const notFoundError = require("../utils/errors/notFoundError");

// return all clothing items

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((data) => res.send({ data }))
    .catch((err) => {
      next(err);
    });
};

// create a new item

const createItem = (req, res, next) => {
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
      if (err.name === "ValidationError") {
        next(new badRequestError("Bad request, invalid data"));
      }
      next(err);
    });
};

// delete an item by _id

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        next(new notFoundError("Item not found"));
      }
      if (item.owner.equals(req.user._id)) {
        item
          .deleteOne()
          .then(() => res.send({ ClothingItem: item }))
          .catch(() => {
            next(
              new forbiddenError("You are not authorized to delete this item")
            );
          });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new badRequestError("Invalid item ID"));
      }
      next(err);
    });
};

// Like an item (update)

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw next(new notFoundError("Item not found"));
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new badRequestError("Bad request, invalid data ID"));
      }
      next(err);
    });
};

// Dislike an item (update)

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw next(new notFoundError("Item not found"));
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new badRequestError("Bad request, invalid data ID"));
      }
      next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
