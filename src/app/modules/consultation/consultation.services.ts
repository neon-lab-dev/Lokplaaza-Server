/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TConsultation } from "./consultation.interface";
import Consultation from "./consultation.model";

const bookConsultation = async (payload: TConsultation) => {
  const result =  await Consultation.create(payload);
  return result;
};

const getAllConsultations = async (keyword?: string, page = 1, limit = 10) => {
  const query: any = {};

  if (keyword) {
    query.$or = [{ name: { $regex: keyword, $options: "i" } }];
    query.$or = [{ email: { $regex: keyword, $options: "i" } }];
    query.$or = [{ phoneNumber: { $regex: keyword, $options: "i" } }];

  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Consultation.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Consultation.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleConsultation= async (id: string) => {
  const result = await Consultation.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Consultation not found");
  }
  return result;
};

const deleteConsultation = async (id: string) => {
  const result = await Consultation.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Consultation not found");
  }
  return result;
};

export const ConsultationServices = {
  bookConsultation,
  getAllConsultations,
  getSingleConsultation,
  deleteConsultation,
};
