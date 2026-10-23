import Champaign from "../models/champaignModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";


export const getAllCampaigns = async (req, res, next) => {
  try {
    const data = await Champaign.find();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, "User Not Found"));
    const champaignsID = user.champaigns;
   const invested=user.invested
   const investedIDarray=[]
   invested.map((item)=>
   investedIDarray.push(item.champaignID)
   )

    const investedChampaigns = await Champaign.find({ _id: { $in: investedIDarray } });
    const createdChampaigns = await Champaign.find({ _id: { $in: champaignsID } });
    res.status(200).json({user,investedChampaigns,createdChampaigns});
  } catch (error) {
    next(error);
  }
};
export const verify = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    user.isVarified = !user.isVarified;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
export const deleteCampaign = async (req, res, next) => {
    const campaignId = req.params.id;

    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      const campaign = await Champaign.findById(campaignId).session(session);
  
      if (!campaign) {
        await session.abortTransaction();
        session.endSession();
        return next(errorHandler(404,"Campaign not found"));
      }
  
   
      await campaign.deleteOne({ session });
  
      const userUpdate = await User.findByIdAndUpdate(campaign.userRef, {
        $pull: { champaigns: campaignId },
      }).session(session);
  
      if (!userUpdate) {
        await session.abortTransaction();
        session.endSession();
        return next(errorHandler(403,"failed to Update User"));
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
