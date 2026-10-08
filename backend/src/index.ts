import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import "./models"; 

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

const PORT = 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 