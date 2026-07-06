import { z } from "zod";

export const emailSchema = z.string().email().max(255);

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number");

export const urlSchema = z.string().url().max(2048);

export const uuidSchema = z.string().uuid();

export const slugSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const isbnSchema = z.string().regex(
  /^(?:\d{9}[\dX]|\d{13})$/,
  "Invalid ISBN (must be ISBN-10 or ISBN-13)",
);

export type Email = z.infer<typeof emailSchema>;
export type Phone = z.infer<typeof phoneSchema>;
export type Url = z.infer<typeof urlSchema>;
export type Uuid = z.infer<typeof uuidSchema>;
export type Slug = z.infer<typeof slugSchema>;
export type Isbn = z.infer<typeof isbnSchema>;
