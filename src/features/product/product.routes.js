import express from "express";
import { upload } from "../../middlewares/fileupload.middleware.js";
import ProductController from "./product.controller.js";

const ProductRouter = express.Router();

const productController = new ProductController();

ProductRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});
ProductRouter.get("/", (req, res) => {
  productController.getAllProduct(req, res);
});
ProductRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});
ProductRouter.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});
ProductRouter.get("/avaragePrice", (req, res) => {
  productController.avaragePrice(req, res);
});
ProductRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});
export default ProductRouter;
