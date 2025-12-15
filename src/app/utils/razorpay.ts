import Razorpay from "razorpay";
import config from "../config";

export const razorpay = new Razorpay({
  key_id: config.razorpay_api_key,
  key_secret: config.razorpay_api_secret,
});
