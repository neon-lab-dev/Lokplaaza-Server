/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../auth/auth.model';


const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

const getMe = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
};


export const UserServices = {
  getAllUsers,
  getMe,
};
