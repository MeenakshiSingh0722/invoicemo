import { Types } from "mongoose";
import { ApiError } from "./ApiError";

export const toObjectId = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "NOT_FOUND", "Resource not found");
  }
  return new Types.ObjectId(id);
};
