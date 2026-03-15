import { Response } from "express";
import { ApiResponse, PaginationMeta, ValidationError } from "@/types";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: PaginationMeta,
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  message: string,
  data?: T,
): Response => sendSuccess(res, message, data, 201);

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: ValidationError[],
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};

export const sendNotFound = (res: Response, resource = "Resource"): Response =>
  sendError(res, `${resource} not found`, 404);

export const sendUnauthorized = (
  res: Response,
  message = "Unauthorized",
): Response => sendError(res, message, 401);

export const sendForbidden = (res: Response, message = "Forbidden"): Response =>
  sendError(res, message, 403);

export const sendBadRequest = (
  res: Response,
  message: string,
  errors?: ValidationError[],
): Response => sendError(res, message, 400, errors);

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
