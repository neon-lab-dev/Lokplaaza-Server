// users.controller.ts
import { UserServices } from "./users.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: { users: result.data, meta: result.meta },
  });
});

const getMe = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await UserServices.getMe(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
  getMe,
};
