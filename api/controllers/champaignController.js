import "dotenv/config";
import Champaign from "../models/champaignModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

console.log("Stripe key available in controller:", Boolean(stripeKey));

if (!stripeKey) {
  throw new Error("STRIPE_SECRET_KEY is missing from the backend environment.");
}

const stripe = new Stripe(stripeKey);

export const createChampaign = async (req, res, next) => {
  const champaignData = req.body;

  try {
    const newChampaign = new Champaign({
      ...champaignData,
      userRef: req.user.id,
    });
    const createdChampaign = await newChampaign.save();

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { champaigns: createdChampaign._id } },
      { new: true },
    );

    res.status(200).json(createdChampaign);
  } catch (error) {
    next(error);
  }
};

export const createBatches = async (req, res, next) => {
  const champaignID = req.params.id;
  try {
    const getChampaign = await Champaign.findById(champaignID);
    if (!getChampaign) return next(errorHandler(404, "Champaign not found"));
    const batchSeq = getChampaign.batches.length;
    getChampaign.batches.push({ ...req.body, batchNumber: batchSeq + 1 });
    const updatedChampaign = await getChampaign.save();
    res.status(200).json(updatedChampaign);
  } catch (error) {
    next(error);
  }
};

export const updateChampaign = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedCampaign = await Champaign.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true },
    );
    if (!updatedCampaign)
      return next(errorHandler(404, "Some error occured at updating"));
    res.status(200).json(updatedCampaign);
  } catch (error) {
    next(error);
  }
};

export const getAllChampaigns = async (req, res, next) => {
  try {
    const AllChampaigns = await Champaign.find().sort({ createdAt: -1 });
    res.status(200).json(AllChampaigns);
  } catch (error) {
    next(error);
  }
};

export const getSpecChampaign = async (req, res, next) => {
  const id = req.params.id;
  try {
    const getChampaign = await Champaign.findById(id);
    if (!getChampaign) return next(errorHandler(404, "Champaign not found"));
    res.status(200).json(getChampaign);
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req, res, next) => {
  const campaignId = req.params.id;
  const owner = req.user.id;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const campaign = await Champaign.findById(campaignId).session(session);

    if (!campaign) {
      await session.abortTransaction();
      session.endSession();
      return next(errorHandler(404, "Campaign not found"));
    }

    if (owner !== campaign.userRef) {
      await session.abortTransaction();
      session.endSession();
      return next(errorHandler(502, "You are not authenticated to delete"));
    }

    await campaign.deleteOne({ session });

    const userUpdate = await User.findByIdAndUpdate(owner, {
      $pull: { champaigns: campaignId },
    }).session(session);

    if (!userUpdate) {
      await session.abortTransaction();
      session.endSession();
      return next(errorHandler(403, "failed to Update User"));
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json("Your Campaign deleted successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
export const investIn = async (req, res, next) => {
  const investorID = req.user.id;
  const champaignID = req.params.id;
  const { invested, equity } = req.body;

  try {
    // Find the investor and campaign by ID
    const investor = await User.findById(investorID);
    const champaign = await Champaign.findById(champaignID);

    if (!investor || !champaign) {
      return res
        .status(404)
        .json({ message: "Investor or Campaign not found" });
    }

    // Flag to check if the investor has previously invested
    let isPrevInvested = false;

    // If campaign is still gathering initial funds
    if (champaign.amountGained < champaign.amountRequired) {
      // Update existing investment or add new investment
      champaign.investors.forEach((item) => {
        if (item.investorID === investorID && !item.isBuffer) {
          item.invested += parseFloat(invested);
          item.equity += parseFloat(equity);
          isPrevInvested = true;
        }
      });
      if (!isPrevInvested) {
        champaign.investors.push({
          investorID,
          equity: parseFloat(equity),
          invested: parseFloat(invested),
        });
      }

      champaign.amountGained += parseFloat(invested);

      // Save the updated campaign
      const updatedChampaign = await champaign.save();

      // Update investor's record
      let isprevShareHolder = false;
      investor.invested.forEach((item) => {
        if (item.champaignID === champaignID && !item.isBuffer) {
          item.invested += parseFloat(invested);
          item.equity += parseFloat(equity);
          isprevShareHolder = true;
        }
      });

      if (!isprevShareHolder) {
        investor.invested.push({
          champaignID,
          invested: parseFloat(invested),
          equity: parseFloat(equity),
        });
      }

      const updatedUser = await investor.save();

      res.status(200).json({ updatedChampaign, updatedUser, isBuffer: false });
    } else {
      // Campaign has met the initial funding goal, handle buffer investments
      let isPrevBufferInvestor = false;

      champaign.investors.forEach((item) => {
        if (item.investorID === investorID && item.isBuffer) {
          item.invested += parseFloat(invested);
          item.equity += parseFloat(equity);
          isPrevBufferInvestor = true;
        }
      });

      if (!isPrevBufferInvestor) {
        champaign.investors.push({
          investorID,
          equity: parseFloat(equity),
          invested: parseFloat(invested),
          isBuffer: true,
        });
      }

      champaign.bufferAmountGained += parseFloat(invested);
      const updatedChampaign = await champaign.save();

      let isPrevBufferInvested = false;
      investor.invested.forEach((item) => {
        if (item.champaignID === champaignID && item.isBuffer) {
          item.invested += parseFloat(invested);
          item.equity += parseFloat(equity);
          isPrevBufferInvested = true;
        }
      });

      if (!isPrevBufferInvested) {
        investor.invested.push({
          champaignID,
          invested: parseFloat(invested),
          equity: parseFloat(equity),
          isBuffer: true,
        });
      }

      const updatedUser = await investor.save();

      res.status(200).json({ updatedChampaign, updatedUser, isBuffer: true });
    }
  } catch (error) {
    next(error);
  }
};

export const searchHandler = async (req, res, next) => {
  const searchTerm = req.query.searchTerm || "money";
  const sort = req.query.sort || "createdAt";
  try {
    const champaigns = await Champaign.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    }).sort({ [sort]: "desc" });

    res.status(200).json(champaigns);
  } catch (error) {
    next(error);
  }
};

export const payment = async (req, res, next) => {
  try {
    const products = req.body.products; // Define it here

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products provided for payment.",
      });
    }

    const items = products.map((pro) => {
      const invested = Number(pro.invested);
      const tip = Number(pro.tip ?? 0);

      if (
        !Number.isFinite(invested) ||
        !Number.isFinite(tip) ||
        invested < 0 ||
        tip < 0
      ) {
        throw new Error("Invalid investment or tip amount.");
      }

      const amountInCents = Math.round((invested + tip) * 100);

      if (amountInCents <= 0) {
        throw new Error("Payment amount must be greater than zero.");
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: pro.title,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      };
    });

    req.session.products = products;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/",
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe payment error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
