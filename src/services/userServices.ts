import userModel from "../models/userModel.ts";

export function insertUserServices(newUser: {
  email: string;
  name: string;
  userType: string;
  password: string;
}) {
  return userModel.create(newUser)
}

export function findUser(email: string) {
  return userModel.findOne({email: email})
}

export function findUserById(id:string){
  return userModel.findById(id)
}

export const logoutService = async (refreshToken: string): Promise<boolean> => {
  try {
    const user = await userModel.findOneAndUpdate(
      { refreshToken: refreshToken },
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    return !!user;
  } catch (error) {
    console.error("Logout service error:", error);
    throw new Error("Database error during logout");
  }
};

export function getAllUsers() {
  return userModel.find({}, { password: 0, refreshToken: 0 }).lean();
}