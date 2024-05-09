import ApplicationError from "../../error-handler/applicationError.js";
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcript from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    const { name, email, password, type } = req.body;
    try {
      const hassedPassword = await bcript.hash(password, 12);
      const user = new UserModel(name, email, hassedPassword, type);
      await this.userRepository.signUp(user);
      return res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return res.status(400).send("User Not found, please signup");
      } else {
        const result = await bcript.compare(password, user.password);
        if (result) {
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          return res.send(token);
        } else {
          return res.status(400).send("Incorrect Credential");
        }
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong", 500);
    }
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const userID = req.userID;
    const hassedPassword = await bcript.hash(newPassword, 12);
    try {
      await this.userRepository.resetPasssword(userID, hassedPassword);
      res.status(200).send("pasword is reset");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Somthing went wrong", 500);
    }
  }
}
