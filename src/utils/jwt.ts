import jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  _id: string;
  email: string;
  name: string;
  userType: string;
}

// Generate token
export function generateAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: String(
      process.env.ACCESS_TOKEN_EXPIRES
    ) as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, options);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: String(
      process.env.REFRESH_TOKEN_EXPIRES
    ) as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, options);
}

// Verify token
export function verifyAccessToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET as string
        ) as TokenPayload
    } catch (error) {
        return null
    }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as TokenPayload
        
    } catch (error) {
        return null
    }
}