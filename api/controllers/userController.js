import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

import Champaign from "../models/champaignModel.js";
export const createUser = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ userName, email, password: hashedPassword });
  try {
    const user = await newUser.save();
    const { password: pass, ...rest } = user._doc;
    res.json(rest);
  } catch (error) {
    next(error);
  }
};

export const signInUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const isValidUser = await User.findOne({ email });

    if (!isValidUser) return next(errorHandler(404, "user not found"));
    const isValidPassword = bcrypt.compareSync(password, isValidUser.password);
    if (!isValidPassword) return next(errorHandler(401, "wrong credentials"));
    const { password: pass, ...rest } = isValidUser._doc;
    const token = jwt.sign({ id: isValidUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 99999999999),
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const getData = async (req, res, next) => {
  const id = req.user.id;
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

export const logOutUser = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("user has been logout");
  } catch (error) {
    next(error);
  }
};


export const verifyProfile=async(req,res,next)=>{
  const {varificationDocURL}=req.body
  try {
   const verifyReq=await User.findByIdAndUpdate(req.user.id,{varificationDocURL},{new:true})
    res.status(200).json(verifyReq)
  } catch (error) {
    next(error)
  }
}