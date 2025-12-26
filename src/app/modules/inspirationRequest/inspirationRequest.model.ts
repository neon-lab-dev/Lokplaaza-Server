import { Schema, model } from "mongoose";
import { TInspirationRequest } from "./inspirationRequest.interface";

const InspirationRequestSchema = new Schema<TInspirationRequest>(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const InspirationRequest = model<TInspirationRequest>(
  "InspirationRequest",
  InspirationRequestSchema
);
export default InspirationRequest;
