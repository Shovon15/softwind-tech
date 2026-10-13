/**
 * Named entities the CMS/WYSIWYG actually emits. Typographic punctuation
 * (&rsquo;, &mdash;, &hellip;) and &nbsp; are by far the most common - a
 * smart-quote apostrophe arrives as `What&rsquo;s`, not as a literal ’.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",

  // quotes & dashes
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201a",
  ldquo: "\u201c",
  rdquo: "\u201d",
  bdquo: "\u201e",
  ndash: "\u2013",
  mdash: "\u2014",
  hellip: "\u2026",
  laquo: "\u00ab",
  raquo: "\u00bb",
  prime: "\u2032",
  Prime: "\u2033",

  // symbols
  bull: "\u2022",
  middot: "\u00b7",
  deg: "\u00b0",
  times: "\u00d7",
  divide: "\u00f7",
  copy: "\u00a9",
  reg: "\u00ae",
  trade: "\u2122",
  dagger: "\u2020",
  Dagger: "\u2021",
  permil: "\u2030",
  frac12: "\u00bd",
  frac14: "\u00bc",
  frac34: "\u00be",
  euro: "\u20ac",
  pound: "\u00a3",
  yen: "\u00a5",
  cent: "\u00a2",
  larr: "\u2190",
  rarr: "\u2192",
  harr: "\u2194",

  // accented latin
  aacute: "\u00e1",
  agrave: "\u00e0",
  acirc: "\u00e2",
  atilde: "\u00e3",
  auml: "\u00e4",
  aring: "\u00e5",
  ccedil: "\u00e7",
  eacute: "\u00e9",
  egrave: "\u00e8",
  ecirc: "\u00ea",
  euml: "\u00eb",
  iacute: "\u00ed",
  icirc: "\u00ee",
  iuml: "\u00ef",
  ntilde: "\u00f1",
  oacute: "\u00f3",
  ograve: "\u00f2",
  ocirc: "\u00f4",
  otilde: "\u00f5",
  ouml: "\u00f6",
  uacute: "\u00fa",
  ugrave: "\u00f9",
  ucirc: "\u00fb",
  uuml: "\u00fc",
  Aacute: "\u00c1",
  Agrave: "\u00c0",
  Acirc: "\u00c2",
  Auml: "\u00c4",
  Aring: "\u00c5",
  Ccedil: "\u00c7",
  Eacute: "\u00c9",
  Egrave: "\u00c8",
  Ecirc: "\u00ca",
  Iacute: "\u00cd",
  Ntilde: "\u00d1",
  Oacute: "\u00d3",
  Ocirc: "\u00d4",
  Ouml: "\u00d6",
  Uacute: "\u00da",
  Uuml: "\u00dc",
};

/** `&name;`, `&#1234;` or `&#x1F600;` */
const ENTITY_PATTERN = /&(#[Xx][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]{1,31});/g;

const MAX_CODE_POINT = 0x10ffff;

/**
 * Decodes HTML entities without touching the DOM, so the server and the client
 * always produce the same string (a `document.createElement` based decoder
 * silently no-ops during SSR and causes a hydration mismatch).
 *
 * Decoding is a single pass: `&amp;rsquo;` becomes `&rsquo;`, not `’`.
 */
export default function decodeHtmlEntities(str: string): string {
  if (!str) return "";

  return str.replace(ENTITY_PATTERN, (match, entity: string) => {
    if (entity[0] === "#") {
      const isHex = entity[1] === "x" || entity[1] === "X";
      const codePoint = parseInt(
        isHex ? entity.slice(2) : entity.slice(1),
        isHex ? 16 : 10,
      );

      if (!Number.isInteger(codePoint) || codePoint <= 0) return match;
      if (codePoint > MAX_CODE_POINT) return match;
      // Lone surrogates would throw and can't render anyway.
      if (codePoint >= 0xd800 && codePoint <= 0xdfff) return match;

      return String.fromCodePoint(codePoint);
    }

    return NAMED_ENTITIES[entity] ?? match;
  });
}
