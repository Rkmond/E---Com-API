export default class CartItemModel {
  constructor(productID, userID, quantity, id) {
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
    this._id = id;
  }

  static add(productID, userID, quantity) {
    const existCart = cartItems.findIndex(
      (c) => c.userID == userID && c.productID == productID
    );
    if (existCart >= 0) {
      cartItems[existCart].quantity = quantity;
      return cartItems[existCart];
    }
    const newCartItem = new CartItemModel(productID, userID, quantity);
    newCartItem.id = cartItems.length + 1;
    cartItems.push(newCartItem);
    return newCartItem;
  }

  static getAll(userID) {
    return cartItems.filter((i) => i.userID == userID);
  }

  static delete(cartItemID, userID) {
    const itemIndex = cartItems.findIndex(
      (i) => i.userID == userID && i.id == cartItemID
    );
    if (itemIndex == -1) {
      return "Item not found";
    } else {
      cartItems.splice(itemIndex, 1);
    }
  }
}

let cartItems = [new CartItemModel(1, 2, 1, 1)];
