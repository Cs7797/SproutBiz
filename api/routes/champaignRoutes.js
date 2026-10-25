import express from "express";
import {
  createChampaign,
  createBatches,
  getAllChampaigns,
  getSpecChampaign,
  investIn,
  searchHandler,
  deleteCampaign,
  payment,
  verifyPayment,
  updateChampaign,
} from "../controllers/champaignController.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyUser, createChampaign);
router.post("/createBatches/:id", verifyUser, createBatches);
router.get("/getAllChampaigns", getAllChampaigns);
router.get("/getSpecChampaign/:id", getSpecChampaign);
router.post("/updateChampaign/:id", verifyUser, updateChampaign);
router.post("/invested/:id", verifyUser, investIn);
router.delete("/delete/:id", verifyUser, deleteCampaign);
router.post("/payment/verify", verifyUser, verifyPayment);
router.post("/payment/:id", verifyUser, payment);
router.get("/search/", searchHandler);

export default router;
