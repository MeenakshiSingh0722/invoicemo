import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";

export type UserDoc = {
  email: string;
  passwordHash: string;
  isVerified: boolean;
  refreshTokenHash?: string;
  failedLoginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    refreshTokenHash: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function comparePassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const UserModel = model<UserDoc>("User", userSchema);
