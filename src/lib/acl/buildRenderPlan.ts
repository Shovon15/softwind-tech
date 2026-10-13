export type InjectionPosition = "start" | "end" | number | { after: string };
export type Injection = { at: InjectionPosition; key: string };
export type RenderEntry =
  | { kind: "block"; index: number }
  | { kind: "injection"; key: string };

export function buildRenderPlan(
  blockSlugs: string[],
  renderableKeys: Set<string>,
  injections: Injection[] = [],
): RenderEntry[] {
  // Renderable block positions, in API order.
  const blockEntries: { slug: string; index: number }[] = [];
  blockSlugs.forEach((slug, index) => {
    if (renderableKeys.has(slug)) blockEntries.push({ slug, index });
  });

  const plan: RenderEntry[] = [];

  const injectAt = (predicate: (i: Injection) => boolean) => {
    injections.filter(predicate).forEach((inj) => {
      plan.push({ kind: "injection", key: inj.key });
    });
  };

  injectAt((i) => i.at === "start");

  blockEntries.forEach((entry, position) => {
    injectAt((i) => typeof i.at === "number" && i.at === position);
    plan.push({ kind: "block", index: entry.index });
    injectAt(
      (i) =>
        typeof i.at === "object" &&
        i.at !== null &&
        "after" in i.at &&
        i.at.after === entry.slug,
    );
  });

  injectAt((i) => i.at === "end");

  return plan;
}
