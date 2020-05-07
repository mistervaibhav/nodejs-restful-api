const express = require("express");

const router = express.Router();

const Product = require("../models/product_model");
const checkAuth = require("../middleware/check-auth");

const OrdersController = require("../controllers/orders_controller");

router.get("/", checkAuth, OrdersController.orders_get_all);

router.post("/", checkAuth, OrdersController.orders_create_order);

router.get("/:orderId", checkAuth, OrdersController.orders_get_one);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;
