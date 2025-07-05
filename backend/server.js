import cors from "cors";
import "dotenv/config";
import express from "express";

import connectDB from "./src/db/connectDB.js";
import complainRoutes from "./src/routes/complainRoutes.js";
import dashbaordRoutes from "./src/routes/dashbaordRoutes.js";
import GovermentRoutes from "./src/routes/GovermentRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import StoreRoutes from "./src/routes/StoreRoutes.js";
import Cloudinary from "./src/utils/Cloudinary.js";
import { storeResetPassword } from "./src/controllers/resetPassword.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/product", productRoutes);
app.use("/goverment", GovermentRoutes);
app.use("/store", StoreRoutes);
app.use("/complain", complainRoutes);
app.use("/dashboard", dashbaordRoutes);
app.post("/store-password-reset", storeResetPassword);

app.get("/", (req, res) => res.send("Api Working"));

connectDB();
Cloudinary();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`🌐 Server is running on http://localhost:${PORT}`)
);
