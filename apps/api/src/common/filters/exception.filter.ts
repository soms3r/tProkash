import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown[];
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = "INTERNAL_SERVER_ERROR";
    let message = "Internal server error";
    let details: unknown[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();
      code = HttpStatus[status] || "INTERNAL_SERVER_ERROR";

      if (typeof exResponse === "string") {
        message = exResponse;
      } else if (typeof exResponse === "object" && exResponse !== null) {
        const resp = exResponse as Record<string, unknown>;
        const respMessage = resp.message;

        if (Array.isArray(respMessage)) {
          details = respMessage;
          message = (resp.error as string) || exception.message;
        } else if (typeof respMessage === "string") {
          message = respMessage;
        } else {
          message = exception.message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const body: ErrorResponse = {
      success: false,
      error: { code, message, details },
      meta: {
        requestId: request.requestId ?? "",
        timestamp: new Date().toISOString(),
      },
    };

    response.status(status).json(body);
  }
}
