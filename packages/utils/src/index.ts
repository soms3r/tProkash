/* ── Logger ── */

export interface Logger {
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
  debug(...args: unknown[]): void;
}

export const createLogger = (namespace: string): Logger => ({
  info: (...args) => {
    console.warn(`[${namespace}]`, ...args);
  },
  warn: (...args) => {
    console.warn(`[${namespace}]`, ...args);
  },
  error: (...args) => {
    console.error(`[${namespace}]`, ...args);
  },
  debug: () => {},
});

/* ── Date utilities ── */

export const toISO = (date: Date = new Date()): string => date.toISOString();

export const formatDate = (date: Date | string, locale = "en-BD"): string =>
  new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

/* ── String utilities ── */

export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const truncate = (s: string, max: number, ellipsis = "..."): string =>
  s.length <= max ? s : s.slice(0, max - ellipsis.length) + ellipsis;

/* ── ID utilities ── */

const hexChars = "0123456789abcdef";

const generateId = (prefix: string, length: number): string => {
  let id = prefix;
  for (let i = 0; i < length; i++) {
    id += hexChars[Math.floor(Math.random() * 16)];
  }
  return id;
};

export const generateEntityId = (): string => generateId("ent_", 24);

export const generateUserId = (): string => generateId("usr_", 24);

export const generateBookId = (): string => generateId("bok_", 24);

export const generatePublisherId = (): string => generateId("pub_", 24);

/* ── Error helpers ── */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "INTERNAL_ERROR",
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}
