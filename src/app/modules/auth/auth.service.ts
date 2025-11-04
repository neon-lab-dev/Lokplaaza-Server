/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { TLoginAuth, TUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToekn } from "./auth.utils";
import { User } from "./auth.model";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import AppError from "./../../errors/AppError";

// Signup
const signup = async (payload: Partial<TUser>) => {
  // Checking if user already exists
  const isUserExists = await User.findOne({ email: payload.email });
  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, "User already exists.");
  }

  const payloadData = {
    ...payload,
  };

  const result = await User.create(payloadData);
  return result;
};

// Login
const loginUser = async (payload: TLoginAuth) => {
  // Check if the user exists or not
  const user = await User.isUserExists(payload.email);

  if (!(await user)) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists.");
  }
  // Check if the password is correct or not
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not correct.");
  }

  // Create token and send to client/user

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToekn(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToekn(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // Access the user into his account.

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const refreshToken = async (token: string) => {
  // Check if there is any token sent from the client or not.
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to proceed!"
    );
  }

  // Check if the token is valid or not.
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decoded;

  const user = await User.isUserExists(email);

  // Checking if the user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Checking if the user is deleted or not

  // Have to check if the user is suspended or not

  const jwtpayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = createToekn(
    jwtpayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await User.isUserExists(email);

  // Checking if the user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const jwtpayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = createToekn(
    jwtpayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetLink = `${config.reset_password_ui_url}/reset-password?email=${user?.email}&token=${resetToken}`;

  await sendEmail(user?.email, resetLink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const user = await User.isUserExists(payload?.email);

  // Checking if the user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if the token is valid or not.
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payload?.email !== decoded?.email) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
};

const changePassword = async (
userId: string,
payload: { currentPassword: string; newPassword: string }
) => {
const user = await User.findById(userId).select("+password");

// Checking if the user exists
if (!user) {
  throw new AppError(httpStatus.NOT_FOUND, "User not found!");
}

// Check if the current password is correct
const isPasswordMatched = await bcrypt.compare(
  payload.currentPassword,
  user.password
);
if (!isPasswordMatched) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "Current password is incorrect!"
  );
}

// Hash the new password
const newHashedPassword = await bcrypt.hash(
  payload.newPassword,
  Number(config.bcrypt_salt_round)
);
await User.findByIdAndUpdate(userId, {
  password: newHashedPassword,
});
};

export const AuthServices = {
  signup,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
};
