/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../auth/auth.model';


const getMe = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
};


export const UserServices = {
  getMe,
};
