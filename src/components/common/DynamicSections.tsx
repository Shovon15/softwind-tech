"use client";
import React from "react";
import { buildRenderPlan, type Injection } from "@/lib/acl/buildRenderPlan";
import { devWarn } from "@/lib/acl/devWarn";

export type SectionRegistry = Record<
  string,
  React.ComponentType<{ data: any }>
>;

export type SectionInjection = { at: Injection["at"]; node: React.ReactNode };

type DynamicBlock = { slug: string; type: string } & Record<string, any>;

type Props = {
  blocks: DynamicBlock[];
  registry: SectionRegistry;
  injections?: SectionInjection[];
};

const resolve = (registry: SectionRegistry, block: DynamicBlock) =>
  registry[block.slug] ?? registry[block.type];

const DynamicSections = ({ blocks, registry, injections = [] }: Props) => {
  // A block is renderable if its slug OR type resolves to a component.
  const renderableKeys = new Set<string>();
  blocks.forEach((block) => {
    if (resolve(registry, block)) renderableKeys.add(block.slug);
    else devWarn(`No component for block slug="${block.slug}" type="${block.type}"`);
  });

  const plan = buildRenderPlan(
    blocks.map((b) => b.slug),
    renderableKeys,
    injections.map((inj, i) => ({ at: inj.at, key: `inj-${i}` })),
  );

  return (
    <>
      {plan.map((entry, i) => {
        if (entry.kind === "injection") {
          const found = injections[Number(entry.key.replace("inj-", ""))];
          return (
            <React.Fragment key={`inj-${i}`}>{found?.node}</React.Fragment>
          );
        }
        const block = blocks[entry.index];
        const Comp = resolve(registry, block);
        if (!Comp) return null;
        return <Comp key={block.slug || `block-${entry.index}`} data={block} />;
      })}
    </>
  );
};

export default DynamicSections;
