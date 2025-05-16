// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/discount-api";
export const JWT_SECRET = process.env.JWT_SECRET || "secret123";
export const JWT_EXPIRE = process.env.JWT_EXPIRE || "1d"; // Mantenha como string
export const NODE_ENV = process.env.NODE_ENV || "development";
