const mongoose = require("mongoose");
const Product = require("../models/product_model");

/* ========================================================================================== */

exports.product_get_all = (req, res) => {
  Product.find()
    .select("-__v")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:8080/products/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

/* ========================================================================================== */

exports.product_get_one = (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("-__v")
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: `http://localhost:8080/products`,
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

/* ========================================================================================== */

exports.products_create_product = (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Created product succesfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          file: result.productImage,
          _id: result._id,
          request: {
            type: "GET",
            url: `http://localhost:8080/products/${result._id}`,
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};

/* ========================================================================================== */

exports.products_edit_product = async (req, res) => {
  const props = req.body;

  try {
    const result = await Product.update(
      {
        _id: req.params.productId,
      },
      props
    ).exec();
    res.status(200).json({
      message: "Product updated",
      request: {
        type: "GET",
        url: `http://localhost:8080/products/${req.params.productId}`,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

/* ========================================================================================== */

exports.products_delete_product = (req, res) => {
  const id = req.params.productId;

  Product.deleteOne({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: `http://localhost:8080/products`,
          data: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
