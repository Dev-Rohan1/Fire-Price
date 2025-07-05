import jwt from "jsonwebtoken";

const authProtected = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Token missing." });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.id = decodeToken.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid or expired token.",
    });
  }
};

export default authProtected;
