const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Product } = require("../models/product");
const multer = require("multer");

// For image upload
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "imag/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image Type");
    if (isValid) uploadError = null;
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});
const upload = multer({ storage: storage });

// get all products
router.get("/", async (req, res) => {
  const productList = await Product.find();
  if (!productList) return res.status(500).json({ message: "Internal Error!" });
  res.send(productList);
});

// get products by id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(500).json({ message: "Internal Error" });
  res.send(product);
});

// post products
router.post("/", upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "Invalid file" });
  const filename = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const product = await new Product({
    name: req.body.name,
    description: req.body.description,
    image: `${basePath}${filename}`,
    brand: req.body.brand,
    price: req.body.price,
  }).save();

  if (!product) return res.status(500).json({ message: "Internal Error!" });
  res.send(product);
});

module.exports = router;
