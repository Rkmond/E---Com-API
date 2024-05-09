import ApplicationError from "../../error-handler/applicationError.js";
import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userID = req.userID;
      if (type != "product" && type != "category") {
        return res.status(400).send("Invalid");
      }
      if (type == "product") {
        this.likeRepository.likeProduct(userID, id);
      } else {
        this.likeRepository.likeCategory(userID, id);
      }
      res.status(200).send("like has been added");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Somthing went wrong", 500);
    }
  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const userID = req.userID;
      const likes = await this.likeRepository.getLikes(type, id);
      return res.status(200).send(likes);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Somthing went wrong", 500);
    }
  }
}
