import { Response } from "express";
import { ApiStatus } from "../enums/status";

interface ApiResponse {
  res: Response;
  status: ApiStatus;
  message: string;
  data?: any;
  error?: any;
}

export const sendResponse = (data: ApiResponse) => {
  return data.res.status(data.res.statusCode).json({
    status: data.status,
    message: data.message,
    data: data.data || null,
    error: data.error || null,
  });
};

export const sendErrorResponse = (statusCode: number, data: ApiResponse) => {
  return data.res.status(statusCode).json({
    status: data.status,
    message: data.message,
    data: null,
    error: data.error || null,
  });
};
