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
router.post("/payment/:id", verifyUser, payment);
router.get("/search/", searchHandler);

router.get("/session", (req, res) => {
  // Retrieve product data from session
  const products = req.session.products;

  // Respond with product data
  res.json({ products });
});

export default router;
