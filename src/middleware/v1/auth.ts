import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/v1/config";

export interface JwtUser {
  id: number;
  email: string;
  base_role: "SUPER_ADMIN" | "COMPANY" | "WORKER" | "CONTRACTOR";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    // TODO: currently direct next() for testing, implement proper auth with auth service
  next();
//   const header = req.headers.authorization;
//   if (!header?.startsWith("Bearer "))
//     return res.status(401).json({ error: "No token" });
//   try {
//     const token = header.split(" ")[1];
//     const payload = jwt.verify(token, config.jwtSecret) as JwtUser;
//     req.user = payload;
//     next();
//   } catch {
//     res.status(401).json({ error: "Invalid token" });
//   }
}
