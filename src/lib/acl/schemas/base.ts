import { z } from "zod";

export const slugField = z.string().min(1);

/** Accepts string | null | undefined; always yields a string ("" when empty). */
export const optionalString = z
  .string()
  .nullish()
  .transform((v) => v ?? "");

export const titleField = optionalString;
export const orderField = z
  .number()
  .nullish()
  .transform((v) => v ?? 0);

export const ImageSchema = z.object({
  id: z.number().optional(),
  url: z.string().min(1),
  alt: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  order: z.number().optional().default(0),
});

/**
 * Parses an unknown value as an array, keeping ONLY items that pass `schema`.
 * Invalid items are filtered out (not fatal); non-array input becomes [].
 */
export const arrayOfValid = <T extends z.ZodTypeAny>(schema: T) =>
  z.unknown().transform((value): z.infer<T>[] => {
    if (!Array.isArray(value)) return [];
    const out: z.infer<T>[] = [];
    for (const item of value) {
      const parsed = schema.safeParse(item);
      if (parsed.success) out.push(parsed.data);
    }
    return out;
  });
