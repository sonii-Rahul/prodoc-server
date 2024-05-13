import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.Model.js";
import { apiError } from "../utils/apiError.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser) {
      console.log("Session user not found:", sessionUser);
      throw new apiError(401, "Unauthorized request");
    }
    next();
  } catch (error) {
    console.log(error);
    console.error("Error in verifyUser middleware:", error);

     // Pass the error to the error handling middleware
  }
});
