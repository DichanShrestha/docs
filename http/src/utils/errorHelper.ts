// utils/errorHandler.ts

import { Request, Response, NextFunction } from "express";

// Define a custom error interface
interface AppError {
  statusCode: number;
  message: string;
  stack?: string;
}

// Global error handler
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default status code and message if not provided
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error details in the console for debugging purposes
  console.error(err.stack);

  // Send a consistent error response
  res.status(statusCode).json({
    status: "error",
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null, // Optional: Only show stack trace in development mode
  });
};
