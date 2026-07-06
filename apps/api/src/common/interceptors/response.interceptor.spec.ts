/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { of } from "rxjs";
import { ResponseInterceptor } from "./response.interceptor";

describe("ResponseInterceptor", () => {
  let interceptor: ResponseInterceptor<unknown>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();
    interceptor = module.get<ResponseInterceptor<unknown>>(ResponseInterceptor);
  });

  function createMockContext(requestId: string) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ requestId }),
        getResponse: () => ({}),
      }),
      getArgByIndex: vi.fn(),
      getArgs: vi.fn(),
      getClass: vi.fn(),
      getHandler: vi.fn(),
      getType: vi.fn(),
      switchToRpc: vi.fn(),
      switchToWs: vi.fn(),
    };
  }

  it("should wrap response data in success format", async () => {
    const mockContext = createMockContext("req-1");
    const mockCallHandler = {
      handle: () => of({ status: "ok" }),
    };

    const result = await interceptor
      .intercept(mockContext as any, mockCallHandler as any)
      .toPromise();

    expect(result).toEqual({
      success: true,
      data: { status: "ok" },
      meta: {
        requestId: "req-1",
        timestamp: expect.any(String),
      },
    });
  });

  it("should wrap array data correctly", async () => {
    const mockContext = createMockContext("req-2");
    const mockCallHandler = {
      handle: () => of([1, 2, 3]),
    };

    const result = await interceptor
      .intercept(mockContext as any, mockCallHandler as any)
      .toPromise();

    expect(result).toEqual({
      success: true,
      data: [1, 2, 3],
      meta: {
        requestId: "req-2",
        timestamp: expect.any(String),
      },
    });
  });

  it("should wrap primitive data correctly", async () => {
    const mockContext = createMockContext("req-3");
    const mockCallHandler = {
      handle: () => of("hello"),
    };

    const result = await interceptor
      .intercept(mockContext as any, mockCallHandler as any)
      .toPromise();

    expect(result).toEqual({
      success: true,
      data: "hello",
      meta: {
        requestId: "req-3",
        timestamp: expect.any(String),
      },
    });
  });

  it("should include requestId from the request", async () => {
    const mockContext = createMockContext("custom-req-id");
    const mockCallHandler = {
      handle: () => of(null),
    };

    const result = await interceptor
      .intercept(mockContext as any, mockCallHandler as any)
      .toPromise();

    expect(result?.meta.requestId).toBe("custom-req-id");
  });
});
