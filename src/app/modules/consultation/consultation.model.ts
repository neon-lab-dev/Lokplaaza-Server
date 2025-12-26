import { Schema, model } from "mongoose";
import { TConsultation } from "./consultation.interface";

const ConsultationSchema = new Schema<TConsultation>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: false, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Consultation = model<TConsultation>("Consultation", ConsultationSchema);
export default Consultation;