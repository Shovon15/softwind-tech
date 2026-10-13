// Intentionally empty. Replaces next/dist/build/polyfills/polyfill-module via
// `turbopack.resolveAlias` in next.config.ts: every feature it polyfills
// (Array#at/flat, Object.hasOwn/fromEntries, String#trimStart/End, ...) is
// native in the browsers Next 16 supports, so shipping it only triggers the
// Lighthouse "legacy JavaScript" audit. URL.canParse is also polyfilled there
// but nothing in this app calls it.
export {};
