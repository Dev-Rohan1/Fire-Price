import express from "express";
import {
  getStoreById,
  sendResetOtp,
  storeEditProfile,
  storeGetData,
  storeLogin,
  storeRegister
} from "../controllers/storeController.js";
import authProtected from "../middlewares/authProtected.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/register", upload.single("image"), storeRegister);
router.post("/login", storeLogin);
router.get("/data", authProtected, storeGetData);
router.get("/:id", getStoreById);
router.put(
  "/update-store",
  upload.single("image"),
  authProtected,
  storeEditProfile
);

router.post("/store-reset-password-otp", sendResetOtp);

export default router;
