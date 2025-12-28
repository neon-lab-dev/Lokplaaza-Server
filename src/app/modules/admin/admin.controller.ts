import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.services";

const getAdminStats = catchAsync(async (req, res) => {
  const result = await AdminServices.getAdminStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin stats retrieved successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAdminStats,
};
