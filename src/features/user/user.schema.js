import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\../, "please enter a valid email"],
  },
  password: String,
  type: {
    type: String,
    validate: {
      validator: function (value) {
        return /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/.test(value);
      },
      message:
        "Password should be between 8-12 charecter and have a special charecter",
    },
    enum: ["customer", "seller"],
  },
});
