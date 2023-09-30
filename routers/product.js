const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Product } = require("../models/product");

router.get("/", async (req, res) => {
  const productList = await Product.find();
  if (!productList) return res.status(500).json({ message: "Internal Error!" });
  res.send(productList);
});

router.post("/", async (req, res) => {
  const product = await new Product({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
  }).save();

  if (!product) return res.status(500).json({ message: "Internal Error!" });
  res.send(product);
});

module.exports = router;
