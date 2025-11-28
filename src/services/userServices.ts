import userModel from "../models/userModel";

export function insertUserServices(newUser: {
  email: string;
  password: string;
}) {
  return userModel.create(newUser)
}
