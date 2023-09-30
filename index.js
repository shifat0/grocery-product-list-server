const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");

const api = process.env.API_URL;
const productRouter = require("./routers/product");

app.use(express.json());

app.use(`${api}/${process.env.PRODUCT_API_URL}`, productRouter);

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err.message));

app.listen(process.env.PORT, () => console.log(api));
