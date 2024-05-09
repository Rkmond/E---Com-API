import CartItemModel from "./cart.model.js";
import CartItemRepository from "./cart.repository.js";

export class CartItemsController {
  constructor() {
    this.cartRepository = new CartItemRepository();
  }
  async add(req, res) {
    const { productID, quantity } = req.body;
    const userID = req.userID;
    try {
      await this.cartRepository.add(productID, userID, quantity);
      return res.status(201).send("Cart is updated");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong", 500);
    }
  }

  async get(req, res) {
    const userID = req.userID;
    try {
      const items = await this.cartRepository.getAll(userID);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong", 500);
    }
  }

  async delete(req, res) {
    const userID = req.userID;
    const cartID = req.params.id;
    try {
      const isDeleted = await this.cartRepository.delete(cartID, userID);
      if (!isDeleted) {
        return res.status(404).send("Item not found");
      } else {
        return res.status(200).send("CartItem deleted successfully");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong", 500);
    }
  }
}
