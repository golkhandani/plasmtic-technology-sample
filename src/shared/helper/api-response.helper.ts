import { ValidationError } from "class-validator";
import { wLogger } from "../winston";
import { HttpError } from "./http-error.helper";

export const response = (handler: (e, c) => Promise<{ statusCode: number, headers?: any, body?: any }>) => {
  return async (event, context) => {
    try {
      const result = await handler(event, context);
      return {
        statusCode: result.statusCode,
        headers: result.headers,
        body: JSON.stringify({
          data: result.body
        }),
      };
    } catch (error) {
      wLogger.error(error, new Date());
      if (Array.isArray(error) && error[0] instanceof ValidationError) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Validation Error",
            error: error
          }),
        };
      } else if (error instanceof HttpError) {
        return {
          statusCode: error.status,
          body: JSON.stringify({
            message: error.message,
            error: error.stack
          }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Internal Server Error",
            error: error.stack
          }),
        };
      }

    }
  }
}