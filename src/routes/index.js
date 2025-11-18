const express = require("express");
const router = express.Router();
const users = require("./users");
const products = require("./productRoutes");
const cart = require("./cartRoutes");
const orders = require("./orderRoutes");
const categories = require("./categoryRoutes");

router.use("/users", users);
router.use("/products", products);
router.use("/cart", cart);
router.use("/orders", orders);
router.use("/categories", categories);

router.get("/", (req, res) => {
  res.json({ mensaje: "¡Bienvenido a mi API con Express!" });
});

module.exports = router;
