import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId =
      (req.headers["x-request-id"] as string) || uuidv4();
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    next();
  }
}
