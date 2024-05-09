// /load all environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swagger from "swagger-ui-express";
import bodyParser from "body-parser";
import ProductRouter from "./src/features/product/product.routes.js";
import UserRouter from "./src/features/user/user.routes.js";
import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import apiDocs from "./swagger.json" assert { type: "json" };
import cors from "cors";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import ApplicationError from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.router.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.routes.js";

const server = express();

// CORS policy configuration
var corsOptions = {
  origin: "http://localhost:5500",
};

server.use(cors());
// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5500");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   if (req.method == "OPTIONS") {
//     res.sendStatus(200);
//   }
//   next();
// });

server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use(bodyParser.json());
server.use(loggerMiddleware);
server.use("/api/users", UserRouter);
server.use("/api/likes", jwtAuth, likeRouter);
server.use("/api/products", jwtAuth, ProductRouter);
server.use("/api/cart", jwtAuth, cartRouter);

server.use("/api/order", jwtAuth, orderRouter);

server.get("/", (req, res) => {
  res.send("welcome to Ecomerce APIs");
});

// Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  res.status(500).send("something went wrong, please try after some time");
});

//Middleware to handle 404 request
server.use((req, res) => {
  res.status(404).send("API not found");
});

server.listen(3200, () => {
  console.log("Server is listening on port 3200");
  // connectToMongoDB();
  connectUsingMongoose();
});
