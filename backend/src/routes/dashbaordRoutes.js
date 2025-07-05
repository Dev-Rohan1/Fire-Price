import express from "express";
import { countStoreRoles } from "../controllers/DashbaordController.js";

const router = express.Router();

router.get("/store-role-counts", countStoreRoles);

export default router;
