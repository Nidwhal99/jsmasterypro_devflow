import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { RequestError, ValidationError } from "@/lib/http-errors";

export type ResponseType = "api" | "server";

const formartResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined,
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    return formartResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors,
    );
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>,
    );
    return formartResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (error instanceof Error) {
    return formartResponse(responseType, 500, error.message);
  }

  return formartResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;
