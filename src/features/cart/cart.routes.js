import express from "express";
import { CartItemsController } from "./cart.controller.js";

const cartRouter = express.Router();
const cartItemsController = new CartItemsController();

cartRouter.post("/", (req, res) => {
  cartItemsController.add(req, res);
});
cartRouter.get("/", (req, res) => {
  cartItemsController.get(req, res);
});
cartRouter.delete("/:id", (req, res) => {
  cartItemsController.delete(req, res);
});

export default cartRouter;
