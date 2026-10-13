import { z } from "zod";
import { devWarn } from "./devWarn";

export function normalizeBlocks<S extends z.ZodTypeAny>(
  rawBlocks: unknown,
  schema: S,
): z.infer<S>[] {
  if (!Array.isArray(rawBlocks)) return [];
  const out: z.infer<S>[] = [];
  rawBlocks.forEach((block, index) => {
    const parsed = schema.safeParse(block);
    if (parsed.success) {
      out.push(parsed.data);
    } else {
      devWarn(
        `Dropped block at index ${index} (slug="${(block as any)?.slug ?? "?"}", type="${(block as any)?.type ?? "?"}")`,
        parsed.error.flatten(),
      );
    }
  });
  return out;
}

/**
 * Normalize a CMS page payload: keeps every top-level field and replaces
 * `blocks` with only the blocks that pass `schema`.
 */
export function normalizePageData<S extends z.ZodTypeAny>(
  rawData: unknown,
  schema: S,
): { blocks: z.infer<S>[] } & Record<string, any> {
  const data = (rawData ?? {}) as Record<string, any>;
  return {
    ...data,
    blocks: normalizeBlocks(data.blocks, schema),
  };
}
