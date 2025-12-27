import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Customization from "./customization.model";
import { TCustomization } from "./customization.interface";

// Create customization request
const postCustomizationRequest = async (
  payload: TCustomization
) => {
  const result = await Customization.create(payload);
  return result;
};

// Get all customization requests
const getAllCustomizationRequests = async () => {
  const result = await Customization.find().sort({ createdAt: -1 });
  return result;
};

// Get single customization request by ID
const getSingleRequestById = async (id: string) => {
  const result = await Customization.findById(id);

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Customization request not found"
    );
  }

  return result;
};

export const CustomizationServices = {
  postCustomizationRequest,
  getAllCustomizationRequests,
  getSingleRequestById,
};  