import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema({
  name: String,
  Products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
});
