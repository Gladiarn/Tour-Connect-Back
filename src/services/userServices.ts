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