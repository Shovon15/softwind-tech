import { describe, it, expect } from "vitest";
import { CustomBlockSchema, FeaturesBlockSchema } from "@/lib/acl/schemas/blocks";

describe("CustomBlockSchema (shared)", () => {
  it("still validates a custom block with defaults", () => {
    const r = CustomBlockSchema.parse({ slug: "who-we-are", type: "custom" });
    expect(r.data.content).toBe("");
    expect(r.data.images).toEqual([]);
  });
});

describe("FeaturesBlockSchema", () => {
  it("fills items default when data is missing", () => {
    const r = FeaturesBlockSchema.parse({ slug: "why", type: "features" });
    expect(r.data.items).toEqual([]);
  });

  it("requires title per item; drops items without one, keeps valid", () => {
    const r = FeaturesBlockSchema.parse({
      slug: "why",
      type: "features",
      data: {
        items: [
          { icon: "/a.svg", title: "Great food", content: "<p>yum</p>" },
          { icon: "/b.svg", content: "no title" },
        ],
      },
    });
    expect(r.data.items).toHaveLength(1);
    expect(r.data.items[0]).toEqual({
      icon: "/a.svg",
      title: "Great food",
      content: "<p>yum</p>",
    });
  });

  it("accepts null icon/content (API sends null) and defaults them to '')", () => {
    const r = FeaturesBlockSchema.parse({
      slug: "why",
      type: "features",
      data: { items: [{ icon: null, title: "Only title", content: null }] },
    });
    expect(r.data.items[0]).toEqual({ icon: "", title: "Only title", content: "" });
  });
});
