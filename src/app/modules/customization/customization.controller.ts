import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CustomizationServices } from "./customization.services";

// Create customization request
const postCustomizationRequest = catchAsync(async (req, res) => {
  const result = await CustomizationServices.postCustomizationRequest(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Customization request submitted successfully",
    data: result,
  });
});

// Get all customization requests
const getAllCustomizationRequests = catchAsync(async (_req, res) => {
  const result =
    await CustomizationServices.getAllCustomizationRequests();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customization requests fetched successfully",
    data: {
      customizations: result,
    },
  });
});

// Get single customization request
const getSingleRequestById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result =
    await CustomizationServices.getSingleRequestById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customization request fetched successfully",
    data: result,
  });
});

export const CustomizationControllers = {
  postCustomizationRequest,
  getAllCustomizationRequests,
  getSingleRequestById,
};