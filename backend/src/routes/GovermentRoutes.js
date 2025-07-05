import express from "express";
import {
  getGovermentData,
  govermentEditProfile,
  govermentLogin,
  govermentRegister,
  sendResetOtp,
  verifyResetAndChangePassword,
} from "../controllers/govermentController.js";
import {
  changeStoreStatus,
  getAllStoreList,
  getAllStoreReqList,
} from "../controllers/storeController.js";
import authProtected from "../middlewares/authProtected.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/register", upload.single("image"), govermentRegister);
router.post("/login", govermentLogin);
router.get("/data", authProtected, getGovermentData);
router.put(
  "/update",
  authProtected,
  upload.single("image"),
  govermentEditProfile
);
router.post("/reset-password-otp", sendResetOtp);
router.post("/change-password", verifyResetAndChangePassword);
router.get("/get-all-shop-list", getAllStoreList);
router.get("/get-all-request-shop-list", authProtected, getAllStoreReqList);
router.post("/change-store-status", authProtected, changeStoreStatus);

export default router;
