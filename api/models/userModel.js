import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVarified: {
    type: Boolean,
    default:false
  },
  isAdmin: {
    type: Boolean,
    default:false
  },
  varificationDocURL: {
    type: String,
    default:""
  },
  invested: {
    type: [
      {
        invested:Number,
        champaignID:String,
        equity:Number,
        isBuffer:{
          type:Boolean,
          default:false
        }
      }
    ],
  },
  champaigns: {
    type: [String],
  },
});

const User = mongoose.model("user", userSchema);
export default User;
