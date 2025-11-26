/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../auth/auth.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';


const getAllUsers = async (query: Record<string, any>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const keyword = (query.keyword as string) || "";
  const role = (query.role as string) || "";

  const searchConditions: any[] = [];

  // 🔍 Keyword search on name and email
  if (keyword) {
    searchConditions.push({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });
  }

  // 🎭 Role filter
  if (role) {
    searchConditions.push({ role });
  }

  const whereCondition =
    searchConditions.length > 0 ? { $and: searchConditions } : {};

  // Fetch users
  const result = await User.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // optional: newest first

  // Total count for pagination
  const total = await User.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMe = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
};

const updateProfile = async (
  userId: string,
  payload: Record<string, any>,
  file?: Express.Multer.File
) => {
  // ✅ Check user
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // ✅ Handle image upload
  if (file) {
    const imageName = `${userId}-${Date.now()}`;
    const { secure_url } = await sendImageToCloudinary(
      imageName,
      file.path
    );

    payload.imageUrl = secure_url;
  }

  // ✅ Update user with whatever comes
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Profile update failed");
  }

  return updatedUser;
};



export const UserServices = {
  getAllUsers,
  getMe,
  updateProfile
};
