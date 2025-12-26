import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ConsultationServices } from "./consultation.services";

// Add Category
const bookConsultation = catchAsync(async (req, res) => {
  const result = await ConsultationServices.bookConsultation(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "We have received your request. We will get back to you soon.",
    data: result,
  });
});

const getAllConsultations = catchAsync(async (req, res) => {
  const { page = "1", limit = "10", keyword } = req.query;

  const result = await ConsultationServices.getAllConsultations(
    keyword as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Consultations retrieved successfully",
    data: {
      consultations: result.data,
      pagination: result.meta,
    },
  });
});

const getSingleConsultation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ConsultationServices.getSingleConsultation(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Consultation fetched successfully",
    data: result,
  });
});

// Delete Category
const deleteConsultation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ConsultationServices.deleteConsultation(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const ConsultationControllers = {
  bookConsultation,
  getAllConsultations,
  getSingleConsultation,
  deleteConsultation,
};
