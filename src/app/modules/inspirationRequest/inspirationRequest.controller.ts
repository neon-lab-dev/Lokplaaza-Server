import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { InspirationRequestServices } from "./inspirationRequest.services";

// Upload inspiration image
const uploadInspirationImage = catchAsync(async (req, res) => {
  const file = req.file;

  const result = await InspirationRequestServices.uploadInspirationImage(
    req.body,
    file
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Inspiration request submitted successfully",
    data: result,
  });
});

// Get all inspiration requests (admin)
const getAllInspirationRequests = catchAsync(async (_req, res) => {
  const result =
    await InspirationRequestServices.getAllInspirationRequests();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Inspiration requests fetched successfully",
    data: {
      consultations: result, // matches frontend usage
    },
  });
});

// Delete inspiration request (admin)
const deleteInspirationRequest = catchAsync(async (req, res) => {
  const { id } = req.params;

  await InspirationRequestServices.deleteInspirationRequest(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Inspiration request deleted successfully",
    data: null,
  });
});

export const InspirationRequestControllers = {
  uploadInspirationImage,
  getAllInspirationRequests,
  deleteInspirationRequest,
};