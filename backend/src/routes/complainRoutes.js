import express from "express";
import {
  getAllComplains,
  getComplainById,
  sendComplainController,
} from "../controllers/ComplainController.js";
import authProtected from "../middlewares/authProtected.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post(
  "/send-complain",
  upload.single("complainProve"),
  sendComplainController
);
router.get("/all-complain", authProtected, getAllComplains);
router.get("/:id", getComplainById);

export default router;
