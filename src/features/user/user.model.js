import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }
}

let users = [
  {
    name: "Seller User",
    email: "seller@ecom.com",
    password: "Password1",
    seller: "seller",
    id: 1,
  },
  {
    name: "customer User",
    email: "customer@ecom.com",
    password: "Password1",
    seller: "customer",
    id: 2,
  },
];
