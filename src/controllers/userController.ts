import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { insertUserServices } from "../services/userServices";

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await insertUserServices({
      email: email,
      password: password,
    });

    if(!createdUser){
      res.status(400).json({message: "User not created"});
    }

    res.status(201).json({message: "created Successfully: ", createdUser})

  } catch (error) {
    console.error(error);
  }
}
