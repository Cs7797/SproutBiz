import express from "express";
import {
  getAllCampaigns,
  getAllUsers,
  getProfile,
  verify,
  deleteCampaign
} from "../controllers/adminController.js";
import { verifyAdmin } from "../utils/verifyUser.js";
const router = express.Router();
router.get("/allCampaigns",verifyAdmin, getAllCampaigns);
router.get("/allUsers",verifyAdmin, getAllUsers);

router.get("/getProfile/:id",verifyAdmin, getProfile);
router.get("/verify/:id",verifyAdmin, verify);
router.get("/deleteCampaign/:id",verifyAdmin, deleteCampaign);

export default router;
