import { ObjectId, ReturnDocument } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();

    try {
      session.startTransaction();
      const db = getDB();
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log(finalTotalAmount);
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      await db.collection("cart items").deleteMany(
        {
          userID: new ObjectId(userId),
        },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationError("something went wrong with placeorder", 500);
    }
  }

  async getTotalAmount(userId, session) {
    try {
      const db = getDB();
      const items = await db
        .collection("cart items")
        .aggregate(
          [
            {
              $match: { userID: new ObjectId(userId) },
            },
            {
              $lookup: {
                from: "products",
                localField: "productID",
                foreignField: "_id",
                as: "productInfo",
              },
            },
            {
              $unwind: "$productInfo",
            },
            {
              $addFields: {
                totalAmount: {
                  $multiply: ["$productInfo.price", "$quantity"],
                },
              },
            },
          ],
          { session }
        )
        .toArray();
      return items;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong", 500);
    }
  }
}
