/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { AllExceptionsFilter } from "./exception.filter";

describe("AllExceptionsFilter", () => {
  let filter: AllExceptionsFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();
    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  function createMockHost(requestId: string) {
    const mockJson = vi.fn();
    const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    const mockResponse = { status: mockStatus };
    const mockRequest = { requestId };

    return {
      host: {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
        getArgByIndex: vi.fn(),
        getArgs: vi.fn(),
        getType: vi.fn(),
        switchToRpc: vi.fn(),
        switchToWs: vi.fn(),
      },
      mockJson,
      mockStatus,
    };
  }

  it("should format HttpException correctly", () => {
    const { host, mockJson, mockStatus } = createMockHost("test-id-1");
    const exception = new HttpException("Not Found", HttpStatus.NOT_FOUND);

    filter.catch(exception, host as any);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Not Found",
        details: [],
      },
      meta: {
        requestId: "test-id-1",
        timestamp: expect.any(String),
      },
    });
  });

  it("should format BadRequestException with validation details", () => {
    const { host, mockJson, mockStatus } = createMockHost("test-id-2");
    const exception = new HttpException(
      {
        statusCode: 400,
        message: ["name must be a string", "email is not valid"],
        error: "Bad Request",
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host as any);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: "Bad Request",
        details: ["name must be a string", "email is not valid"],
      },
      meta: {
        requestId: "test-id-2",
        timestamp: expect.any(String),
      },
    });
  });

  it("should format generic Error correctly", () => {
    const { host, mockJson, mockStatus } = createMockHost("test-id-3");
    const exception = new Error("Something went wrong");

    filter.catch(exception, host as any);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
        details: [],
      },
      meta: {
        requestId: "test-id-3",
        timestamp: expect.any(String),
      },
    });
  });

  it("should handle unknown exceptions gracefully", () => {
    const { host, mockJson, mockStatus } = createMockHost("test-id-4");
    const exception = "string error";

    filter.catch(exception, host as any);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        details: [],
      },
      meta: {
        requestId: "test-id-4",
        timestamp: expect.any(String),
      },
    });
  });
});
