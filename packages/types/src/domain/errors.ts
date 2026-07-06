export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly occurredOn: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.occurredOn = new Date().toISOString();
  }
}

export class NotFoundError extends DomainError {
  readonly code = "NOT_FOUND";
  readonly statusCode = 404;

  constructor(message?: string) {
    super(message ?? "Resource not found");
  }
}

export class ValidationError extends DomainError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;
  readonly details?: Record<string, string[]>;

  constructor(message?: string, details?: Record<string, string[]>) {
    super(message ?? "Validation failed");
    this.details = details;
  }
}

export class ConflictError extends DomainError {
  readonly code = "CONFLICT";
  readonly statusCode = 409;

  constructor(message?: string) {
    super(message ?? "Resource conflict");
  }
}
