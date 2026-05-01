import bcrypt from "bcryptjs";
import { ApiError } from "../../utils/ApiError";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { UserModel, type UserDoc } from "./auth.model";

const SALT_ROUNDS = 10;
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const ensureNotLocked = (user: UserDoc): void => {
  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new ApiError(403, "FORBIDDEN", "Account is temporarily locked");
  }
};

export const registerUser = async (email: string, password: string) => {
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new ApiError(409, "CONFLICT", "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({ email, passwordHash, isVerified: true });
  const payload = { sub: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid credentials");
  }
  ensureNotLocked(user);

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    throw new ApiError(401, "UNAUTHORIZED", "Invalid credentials");
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  const payload = { sub: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refreshSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await UserModel.findById(payload.sub);
  if (!user || !user.refreshTokenHash) {
    throw new ApiError(401, "REFRESH_TOKEN_INVALID", "Invalid refresh token");
  }

  const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!valid) {
    user.refreshTokenHash = undefined;
    await user.save();
    throw new ApiError(401, "REFRESH_TOKEN_INVALID", "Refresh token reuse detected");
  }

  const nextPayload = { sub: user.id, email: user.email };
  const accessToken = signAccessToken(nextPayload);
  const newRefreshToken = signRefreshToken(nextPayload);
  user.refreshTokenHash = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (userId: string) => {
  await UserModel.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: "" } });
};

export const logoutByRefreshToken = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(payload.sub);
    if (!user?.refreshTokenHash) return;
    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (valid) {
      user.refreshTokenHash = undefined;
      await user.save();
    }
  } catch {
    // If token is already invalid/expired, cookie clear is enough.
  }
};
