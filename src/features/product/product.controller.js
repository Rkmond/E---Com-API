import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import ApplicationError from "../../error-handler/applicationError.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProduct(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      throw new ApplicationError("Somthing went wrong", 500);
    }
  }

  async addProduct(req, res) {
    const { name, price, sizes, category, desc } = req.body;
    try {
      const newProduct = new ProductModel(
        name,
        desc,
        parseFloat(price),
        req?.file?.filename,
        category,
        sizes?.split(",")
      );
      const createdRecord = await this.productRepository.add(newProduct);
      res.status(201).send(createdRecord);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Somthing went wrong", 500);
    }
  }

  async getOneProduct(req, res) {
    const id = req.params.id;
    try {
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send("Product not found");
      } else {
        return res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Somthing went wrong", 500);
    }
  }

  async rateProduct(req, res) {
    const userID = req.userID;
    const productID = req.body.productID;
    const rating = req.body.rating;
    try {
      const ratingStatus = await this.productRepository.rateProduct(
        userID,
        productID,
        rating
      );
      return res.status(200).send("rating has been added");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Somthing went wrong", 500);
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const product = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      return res.status(200).send(product);
    } catch (err) {
      throw new ApplicationError("Somthing went wrong", 500);
    }
  }

  async avaragePrice(req, res) {
    try {
      const result =
        await this.productRepository.avarageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
