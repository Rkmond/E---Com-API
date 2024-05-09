import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).send("No authorization details found.");
  }
  const base64Creds = authHeader.replace("Basic ", "");
  const decodedCreds = Buffer.from(base64Creds, "base64").toString("utf-8");
  const creds = decodedCreds.split(":");

  const user = UserModel.getAllUsers().find(
    (user) => user.email == creds[0] && user.password == creds[1]
  );

  if (user) {
    next();
  } else {
    return res.status(401).send("Incorrect Credentials");
  }
};

export default basicAuthorizer;
