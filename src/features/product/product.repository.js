import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("product", productSchema);
const ReviewModel = mongoose.model("review", reviewSchema);
const CategoryModel = mongoose.model("category", categorySchema);

export default class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(product) {
    try {
      product.categories = product.category.split(",").map((e) => e.trim());
      const newProduct = new ProductModel(product);
      const savedProduct = await newProduct.save();
      // const collection = getDB().collection(this.collection);
      // await collection.insertOne(product);

      await CategoryModel.updateMany(
        { _id: { $in: product.categories } },
        {
          $push: { Products: new ObjectId(savedProduct._id) },
        }
      );
      return product;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async get(id) {
    try {
      const collection = getDB().collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async getAll() {
    try {
      const collection = getDB().collection(this.collection);
      return await collection.find().project({ name: 1, price: 1 }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      const collection = getDB().collection(this.collection);
      const filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }
      return await collection.find(filterExpression).toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async rateProduct(userID, productID, rating) {
    try {
      const product = await ProductModel.findById(productID);
      if (!product) {
        throw new Error("Product not found");
      }
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        await newReview.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async avarageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            $group: {
              _id: "$category",
              avaragePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  // async rateProduct(userID, productID, rating) {
  //   try {
  //     const collection = getDB().collection(this.collection);
  //     const product = await collection.findOne({
  //       _id: new ObjectId(productID),
  //     });
  //     const existingRating = product?.ratings?.find((r) => r.userID == userID);
  //     if (existingRating) {
  //       const ress = await collection.updateOne(
  //         {
  //           _id: new ObjectId(productID),
  //           "ratings.userID": userID,
  //         },
  //         {
  //           $set: { "ratings.$.rating": rating },
  //         }
  //       );
  //       console.log(ress);
  //       return "Rating has been updated";
  //     } else {
  //       await collection.updateOne(
  //         { _id: new ObjectId(productID) },
  //         { $push: { ratings: { userID, rating } } }
  //       );
  //       return "Rating has been added";
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong", 500);
  //   }
  // }
}
