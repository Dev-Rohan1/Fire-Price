import express from "express";
import {
  addProduct,
  deleteProduct,
  productFindByID,
  productList,
  updateProduct,
} from "../controllers/ProductController.js";
import authProtected from "../middlewares/authProtected.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/add", upload.single("image"), authProtected, addProduct);
router.get("/find-product/:id", productFindByID);
router.get("/all-products", productList);
router.put(
  "/update-product/:id",
  upload.single("image"),
  authProtected,
  updateProduct
);
router.delete("/delete-product/:id", authProtected, deleteProduct);
export default router;
