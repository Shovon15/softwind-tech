import { describe, it, expect } from "vitest";
import { z } from "zod";
import { ImageSchema, arrayOfValid } from "@/lib/acl/schemas/base";

describe("ImageSchema", () => {
  it("requires a non-empty url", () => {
    expect(ImageSchema.safeParse({ url: "" }).success).toBe(false);
    expect(ImageSchema.safeParse({}).success).toBe(false);
  });

  it("defaults alt to empty string and accepts null alt", () => {
    const r = ImageSchema.parse({ url: "/a.jpg", alt: null });
    expect(r).toEqual({ url: "/a.jpg", alt: "", order: 0 });
  });
});

describe("arrayOfValid", () => {
  const Item = z.object({ slug: z.string().min(1) });
  const ItemArray = arrayOfValid(Item);

  it("drops invalid items and keeps valid ones", () => {
    const r = ItemArray.parse([{ slug: "a" }, { slug: "" }, { nope: 1 }, "x"]);
    expect(r).toEqual([{ slug: "a" }]);
  });

  it("defaults missing/non-array input to []", () => {
    expect(ItemArray.parse(undefined)).toEqual([]);
    expect(ItemArray.parse("not-array" as unknown)).toEqual([]);
  });
});
