import * as z from "zod"

/** Positive integer string */
export const integerStringSchema = z.string().regex(/^\d+$/)
/** Cast positive integer string to number */
export const castStringToIntegerSchema = integerStringSchema
  .transform(value => Number(value))
  .pipe(z.int().positive())
