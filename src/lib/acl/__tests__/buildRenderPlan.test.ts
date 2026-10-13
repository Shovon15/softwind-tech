import { describe, it, expect } from "vitest";
import { buildRenderPlan } from "@/lib/acl/buildRenderPlan";

const keys = new Set(["overview", "menu", "gallery"]);

describe("buildRenderPlan", () => {
  it("emits blocks in order, skipping unrenderable slugs", () => {
    const plan = buildRenderPlan(["overview", "missing", "menu"], keys);
    expect(plan).toEqual([
      { kind: "block", index: 0 },
      { kind: "block", index: 2 },
    ]);
  });

  it("injects at start and end", () => {
    const plan = buildRenderPlan(["overview"], keys, [
      { at: "start", key: "promo" },
      { at: "end", key: "footer-cta" },
    ]);
    expect(plan).toEqual([
      { kind: "injection", key: "promo" },
      { kind: "block", index: 0 },
      { kind: "injection", key: "footer-cta" },
    ]);
  });

  it("injects after a named slug", () => {
    const plan = buildRenderPlan(["overview", "menu"], keys, [
      { at: { after: "overview" }, key: "banner" },
    ]);
    expect(plan).toEqual([
      { kind: "block", index: 0 },
      { kind: "injection", key: "banner" },
      { kind: "block", index: 1 },
    ]);
  });

  it("injects before a numeric position", () => {
    const plan = buildRenderPlan(["overview", "menu"], keys, [
      { at: 1, key: "mid" },
    ]);
    expect(plan).toEqual([
      { kind: "block", index: 0 },
      { kind: "injection", key: "mid" },
      { kind: "block", index: 1 },
    ]);
  });
});
