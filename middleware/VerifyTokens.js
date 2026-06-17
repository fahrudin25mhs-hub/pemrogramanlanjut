import jwt from "jsonwebtoken";

const SECRET_KEY = "perpustakaan2025";

export const authenticateToken = (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }


  try {
    const verified = jwt.verify(
      token,
      SECRET_KEY
    );

    req.user = verified;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid Token",
    });
  }
};