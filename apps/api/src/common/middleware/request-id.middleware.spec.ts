/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestIdMiddleware } from "./request-id.middleware";
import type { NextFunction } from "express";

describe("RequestIdMiddleware", () => {
  let middleware: RequestIdMiddleware;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
  });

  it("should use existing X-Request-ID header", () => {
    const req = {
      headers: { "x-request-id": "existing-id" },
    } as any;
    const res = {
      setHeader: vi.fn(),
    } as any;
    const next: NextFunction = vi.fn();

    middleware.use(req, res, next);

    expect(req.requestId).toBe("existing-id");
    expect(res.setHeader).toHaveBeenCalledWith("X-Request-ID", "existing-id");
    expect(next).toHaveBeenCalled();
  });

  it("should generate a UUID when X-Request-ID is not present", () => {
    const req = { headers: {} } as any;
    const res = {
      setHeader: vi.fn(),
    } as any;
    const next: NextFunction = vi.fn();

    middleware.use(req, res, next);

    expect(req.requestId).toBeDefined();
    expect(typeof req.requestId).toBe("string");
    expect(res.setHeader).toHaveBeenCalledWith("X-Request-ID", req.requestId);
    expect(next).toHaveBeenCalled();
  });

  it("should set the same requestId on request and response header", () => {
    const req = { headers: {} } as any;
    const res = {
      setHeader: vi.fn(),
    } as any;
    const next: NextFunction = vi.fn();

    middleware.use(req, res, next);

    const requestId = req.requestId;
    expect(res.setHeader).toHaveBeenCalledWith("X-Request-ID", requestId);
  });

  it("should call next to continue the chain", () => {
    const req = { headers: {} } as any;
    const res = {
      setHeader: vi.fn(),
    } as any;
    const next: NextFunction = vi.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
