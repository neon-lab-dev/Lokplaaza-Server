/* eslint-disable @typescript-eslint/no-explicit-any */
import InspirationRequest from "./inspirationRequest.model";
import { TInspirationRequest } from "./inspirationRequest.interface";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const uploadInspirationImage = async (
  payload: Pick<TInspirationRequest, "name" | "phoneNumber">,
  file?: Express.Multer.File
) => {
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image is required");
  }

  // Upload image to Cloudinary
  const uploadedImage = await sendImageToCloudinary(
    file.originalname,
    file.path
  );

  console.log(uploadedImage);
  const inspirationData = {
    name: payload.name,
    phoneNumber: payload.phoneNumber,
    imageUrl: uploadedImage.secure_url,
  };

  const result = await InspirationRequest.create(inspirationData);
  return result;
};

const getAllInspirationRequests = async () => {
  const result = await InspirationRequest.find().sort({ createdAt: -1 });
  return result;
};

const deleteInspirationRequest = async (id: string) => {
  const exists = await InspirationRequest.findById(id);

  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, "Inspiration request not found");
  }

  await InspirationRequest.findByIdAndDelete(id);
  return null;
};

export const InspirationRequestServices = {
  uploadInspirationImage,
  getAllInspirationRequests,
  deleteInspirationRequest,
};
