const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const secretToken = process.env.SECRET_TOKEN;

function verifyAuthorization(req, res, next) {
  // let token = req.headers["x-auth-token"];
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === undefined) {
    return res
      .status(400)
      .send({ status: false, message: "No token Provided." });
  }
  try {
    const tokenData = jwt.verify(token, secretToken);
    req.user = tokenData;
    next();
  } catch (ex) {
    res.status(400).send({
      status: false,
      message: "Unauthorised , token is invalid.",
    });
  }
}

exports.verifyAuthorization = verifyAuthorization;
