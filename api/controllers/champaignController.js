import "dotenv/config";
import Stripe from "stripe";

import Champaign from "../models/champaignModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing. Check the root .env file and environment loading.",
  );
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

const toCents = (value, { allowZero = false } = {}) => {
  const amount = Number(value);
  const cents = Math.round(amount * 100);

  if (
    !Number.isFinite(amount) ||
    !Number.isSafeInteger(cents) ||
    Math.abs(amount * 100 - cents) > 1e-7 ||
    (allowZero ? cents < 0 : cents <= 0)
  ) {
    return null;
  }

  return cents;
};

const investmentEntry = (payment, campaignEntry) => ({
  paymentId: String(payment._id),
  investorID: payment.investorId,
  champaignID: String(payment.campaignId),
  invested: payment.investedCents / 100,
  equity: campaignEntry.equity,
  isBuffer: campaignEntry.isBuffer,
});

const recordPaymentWithoutTransaction = async (payment) => {
  const paymentId = String(payment._id);
  const amount = payment.investedCents / 100;
  const initialEquity = Number(
    ((amount / payment.campaignAmountRequired) * payment.campaignEquity).toFixed(4),
  );
  const bufferEquity = Number(
    ((amount / payment.campaignAmountRequired) * payment.campaignEquity * 2).toFixed(4),
  );
  let campaign = await Champaign.findOneAndUpdate(
    {
      _id: payment.campaignId,
      $expr: { $lt: [{ $ifNull: ["$amountGained", 0] }, "$amountRequired"] },
      "investors.paymentId": { $ne: paymentId },
    },
    {
      $inc: { amountGained: amount },
      $push: {
        investors: {
          paymentId,
          investorID: payment.investorId,
          invested: amount,
          equity: initialEquity,
          isBuffer: false,
        },
      },
    },
    { new: true },
  );

  if (!campaign) {
    campaign = await Champaign.findOneAndUpdate(
      {
        _id: payment.campaignId,
        $expr: { $gte: [{ $ifNull: ["$amountGained", 0] }, "$amountRequired"] },
        "investors.paymentId": { $ne: paymentId },
      },
      {
        $inc: { bufferAmountGained: amount },
        $push: {
          investors: {
            paymentId,
            investorID: payment.investorId,
            invested: amount,
            equity: bufferEquity,
            isBuffer: true,
          },
        },
      },
      { new: true },
    );
  }

  if (!campaign) campaign = await Champaign.findById(payment.campaignId);
  if (!campaign) throw errorHandler(404, "Campaign no longer exists");
  const campaignEntry = campaign.investors.find((entry) => entry.paymentId === paymentId);
  if (!campaignEntry) throw new Error("Campaign investment could not be recorded");

  const userUpdate = await User.updateOne(
    {
      _id: payment.investorId,
      "invested.paymentId": { $ne: paymentId },
    },
    { $push: { invested: investmentEntry(payment, campaignEntry) } },
  );

  if (userUpdate.matchedCount === 0) {
    const investor = await User.findById(payment.investorId);
    if (!investor) throw errorHandler(404, "Investor no longer exists");
    if (!investor.invested.some((entry) => entry.paymentId === paymentId)) {
      throw new Error("Investor record could not be updated");
    }
  }

  await Payment.updateOne(
    { _id: payment._id, status: { $ne: "finalized" } },
    {
      $set: {
        status: "finalized",
        equity: campaignEntry.equity,
        isBuffer: campaignEntry.isBuffer,
      },
    },
  );
};

const recordPayment = async (payment) => {
  const topology = mongoose.connection.client?.topology?.description?.type;
  if (topology === "Single") {
    return recordPaymentWithoutTransaction(payment);
  }

  const dbSession = await mongoose.startSession();
  try {
    await dbSession.withTransaction(async () => {
      const currentPayment = await Payment.findById(payment._id).session(dbSession);
      if (!currentPayment) throw errorHandler(404, "Payment record not found");
      if (currentPayment.status === "finalized") return;

      const campaign = await Champaign.findById(currentPayment.campaignId).session(dbSession);
      const investor = await User.findById(currentPayment.investorId).session(dbSession);
      if (!campaign) throw errorHandler(404, "Campaign no longer exists");
      if (!investor) throw errorHandler(404, "Investor no longer exists");

      const paymentId = String(currentPayment._id);
      const amount = currentPayment.investedCents / 100;
      const isBuffer = campaign.amountGained >= campaign.amountRequired;
      const equity = Number(
        (
          (amount / currentPayment.campaignAmountRequired) *
          currentPayment.campaignEquity *
          (isBuffer ? 2 : 1)
        ).toFixed(4),
      );
      if (!campaign.investors.some((entry) => entry.paymentId === paymentId)) {
        campaign.investors.push({
          paymentId,
          investorID: currentPayment.investorId,
          invested: amount,
          equity,
          isBuffer,
        });
        if (isBuffer) campaign.bufferAmountGained += amount;
        else campaign.amountGained += amount;
      }

      const campaignEntry = campaign.investors.find((entry) => entry.paymentId === paymentId);
      if (!investor.invested.some((entry) => entry.paymentId === paymentId)) {
        investor.invested.push(investmentEntry(currentPayment, campaignEntry));
      }

      currentPayment.equity = campaignEntry.equity;
      currentPayment.isBuffer = campaignEntry.isBuffer;
      currentPayment.status = "finalized";
      await campaign.save({ session: dbSession });
      await investor.save({ session: dbSession });
      await currentPayment.save({ session: dbSession });
    });
  } catch (error) {
    const transactionUnsupported =
      error.code === 20 ||
      error.codeName === "IllegalOperation" ||
      /transaction numbers are only allowed|transactions are not supported/i.test(
        error.message || "",
      );
    if (!transactionUnsupported) throw error;
    await recordPaymentWithoutTransaction(payment);
  } finally {
    await dbSession.endSession();
  }
};

export const payment = async (req, res, next) => {
  let pendingPayment;
  let checkoutSession;
  try {
    const { id: routeCampaignId } = req.params;
    const products = req.body.products;
    if (!mongoose.Types.ObjectId.isValid(routeCampaignId)) {
      return res.status(400).json({ success: false, message: "Invalid campaign ID." });
    }
    if (!Array.isArray(products) || products.length !== 1) {
      return res.status(400).json({
        success: false,
        message: "Provide exactly one campaign investment.",
      });
    }

    const product = products[0];
    if (!product || typeof product !== "object") {
      return res.status(400).json({ success: false, message: "Invalid campaign investment." });
    }
    if (String(product.champaignID) !== routeCampaignId) {
      return res.status(400).json({
        success: false,
        message: "The selected campaign does not match the payment request.",
      });
    }
    const investedCents = toCents(product.invested);
    const tipCents = toCents(product.tip ?? 0, { allowZero: true });
    if (investedCents === null || tipCents === null) {
      return res.status(400).json({
        success: false,
        message: "Investment and tip must be valid USD amounts with at most two decimal places.",
      });
    }

    const [campaign, investor] = await Promise.all([
      Champaign.findById(routeCampaignId),
      User.findById(req.user.id),
    ]);
    if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found." });
    if (!investor) return res.status(404).json({ success: false, message: "Investor not found." });
    if (!Number.isFinite(campaign.amountRequired) || campaign.amountRequired <= 0) {
      return res.status(400).json({ success: false, message: "Campaign funding target is invalid." });
    }
    if (!Number.isFinite(campaign.equity) || campaign.equity < 0) {
      return res.status(400).json({ success: false, message: "Campaign equity is invalid." });
    }

    const equity = Number(
      ((investedCents / 100 / campaign.amountRequired) * campaign.equity).toFixed(4),
    );
    pendingPayment = await Payment.create({
      investorId: String(investor._id),
      campaignId: campaign._id,
      investedCents,
      tipCents,
      campaignAmountRequired: campaign.amountRequired,
      campaignEquity: campaign.equity,
      equity,
      currency: "usd",
      isBuffer: false,
      status: "creating",
    });

    const frontendUrl = process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173");
    if (!frontendUrl) throw new Error("FRONTEND_URL is not configured");
    const parsedFrontendUrl = new URL(frontendUrl);
    if (!["http:", "https:"].includes(parsedFrontendUrl.protocol)) {
      throw new Error("FRONTEND_URL must use HTTP or HTTPS");
    }
    const frontendOrigin = parsedFrontendUrl.origin;
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Investment: ${campaign.title}` },
          unit_amount: investedCents,
        },
        quantity: 1,
      },
    ];
    if (tipCents > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Optional tip" },
          unit_amount: tipCents,
        },
        quantity: 1,
      });
    }

    checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      client_reference_id: String(investor._id),
      metadata: {
        paymentId: String(pendingPayment._id),
        campaignId: String(campaign._id),
        investorId: String(investor._id),
      },
      success_url: `${frontendOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendOrigin}/detailedChamapaign/${campaign._id}`,
    });

    pendingPayment.stripeSessionId = checkoutSession.id;
    pendingPayment.status = "pending";
    await pendingPayment.save();
    return res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    if (checkoutSession?.id) {
      try {
        await stripe.checkout.sessions.expire(checkoutSession.id);
      } catch (expireError) {
        // Expiration is best effort; the session has not been sent to the client.
      }
    }
    if (pendingPayment) {
      try {
        await Payment.updateOne({ _id: pendingPayment._id }, { $set: { status: "failed" } });
      } catch (recordError) {
        // Preserve the original checkout error; failed payment records can be reconciled later.
      }
    }
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const sessionId = req.body.sessionId;
    if (typeof sessionId !== "string" || sessionId.length < 10 || sessionId.length > 255) {
      return res.status(400).json({ status: "failed", message: "A valid Checkout Session ID is required." });
    }

    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      if (error.type === "StripeInvalidRequestError" || error.code === "resource_missing") {
        return res.status(404).json({ status: "failed", message: "Checkout Session was not found." });
      }
      throw error;
    }

    const paymentId = stripeSession.metadata?.paymentId;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(404).json({ status: "failed", message: "No pending payment matches this session." });
    }
    const pendingPayment = await Payment.findById(paymentId);
    if (!pendingPayment) {
      return res.status(404).json({ status: "failed", message: "No pending payment matches this session." });
    }
    if (pendingPayment.investorId !== String(req.user.id)) {
      return res.status(403).json({ status: "failed", message: "This Checkout Session belongs to another investor." });
    }
    if (pendingPayment.status === "failed" || pendingPayment.status === "creating") {
      return res.status(409).json({ status: "failed", message: "This payment is not available for confirmation." });
    }
    if (
      pendingPayment.stripeSessionId !== sessionId ||
      stripeSession.client_reference_id !== pendingPayment.investorId ||
      stripeSession.metadata?.investorId !== pendingPayment.investorId ||
      stripeSession.metadata?.campaignId !== String(pendingPayment.campaignId) ||
      stripeSession.mode !== "payment"
    ) {
      return res.status(400).json({ status: "failed", message: "Checkout Session details do not match the pending payment." });
    }

    if (stripeSession.status === "expired") {
      await Payment.updateOne(
        { _id: pendingPayment._id, status: { $ne: "finalized" } },
        { $set: { status: "failed" } },
      );
      return res.status(409).json({ status: "failed", message: "This Checkout Session expired before payment." });
    }
    if (stripeSession.status !== "complete" || stripeSession.payment_status !== "paid") {
      return res.status(202).json({
        status: "pending",
        message: "Payment is still processing. Refresh this page in a moment.",
      });
    }

    const expectedTotal = pendingPayment.investedCents + pendingPayment.tipCents;
    if (
      stripeSession.amount_total !== expectedTotal ||
      stripeSession.currency !== pendingPayment.currency
    ) {
      await Payment.updateOne({ _id: pendingPayment._id }, { $set: { status: "failed" } });
      return res.status(400).json({ status: "failed", message: "The paid amount or currency does not match the pending investment." });
    }

    if (pendingPayment.status === "finalized") {
      const campaign = await Champaign.findById(pendingPayment.campaignId).select("title coverImage");
      return res.status(200).json({
        status: "already_finalized",
        recorded: true,
        investment: {
          campaignId: String(pendingPayment.campaignId),
          title: campaign?.title || "Campaign",
          coverImage: campaign?.coverImage || "",
          invested: pendingPayment.investedCents / 100,
          tip: pendingPayment.tipCents / 100,
          equity: pendingPayment.equity,
          isBuffer: pendingPayment.isBuffer,
        },
      });
    }

    await Payment.updateOne(
      { _id: pendingPayment._id, status: { $ne: "finalized" } },
      { $set: { status: "pending" } },
    );
    await recordPayment(pendingPayment);

    const finalizedPayment = await Payment.findById(pendingPayment._id);
    if (!finalizedPayment || finalizedPayment.status !== "finalized") {
      throw new Error("Payment was confirmed but its investment is still being recorded. Please retry.");
    }
    const campaign = await Champaign.findById(finalizedPayment.campaignId).select("title coverImage");
    return res.status(200).json({
      status: "paid",
      recorded: true,
      investment: {
        campaignId: String(finalizedPayment.campaignId),
        title: campaign?.title || "Campaign",
        coverImage: campaign?.coverImage || "",
        invested: finalizedPayment.investedCents / 100,
        tip: finalizedPayment.tipCents / 100,
        equity: finalizedPayment.equity,
        isBuffer: finalizedPayment.isBuffer,
      },
    });
  } catch (error) {
    next(error);
  }
};
