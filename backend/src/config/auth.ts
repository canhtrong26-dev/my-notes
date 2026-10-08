import dotenv from "dotenv";

dotenv.config();

const authConfig = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: "15m",
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  refreshExpiresIn: "7d",
};

export default authConfig;