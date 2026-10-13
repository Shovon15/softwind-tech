import { IFaqEntry } from "./faqPageLd";

/**
 * The blog body is a single HTML string from the CMS, so the FAQ block has no
 * dedicated API field. Editors wrap it in an element carrying this id and the
 * questions are parsed back out of that markup for the FAQPage schema.
 */
export const BLOG_FAQ_SECTION_ID = "blog-faq";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  deg: "°",
  eacute: "é",
};

function decodeEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const codePoint =
        entity[1] === "x" || entity[1] === "X"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);

      return Number.isFinite(codePoint)
        ? String.fromCodePoint(codePoint)
        : match;
    }

    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

/** Strips markup and normalises whitespace so an answer reads as plain text. */
function toPlainText(html: string) {
  return decodeEntities(
    html
      .replace(/<(script|style)[\s>][\s\S]*?<\/\1\s*>/gi, "")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns the inner HTML of the element carrying `id`, walking the tag stack so
 * a nested element of the same tag name doesn't close the section early.
 */
function getElementInnerHtml(html: string, id: string) {
  const openTag = new RegExp(
    `<([a-z][a-z0-9]*)[^>]*\\sid\\s*=\\s*["']${id}["'][^>]*>`,
    "i",
  ).exec(html);

  if (!openTag) return "";

  const tagName = openTag[1];
  const start = openTag.index + openTag[0].length;
  // The lookahead keeps `<div>` from matching the start of `<divider>`.
  const tags = new RegExp(`<(/?)${tagName}(?=[\\s/>])[^>]*>`, "gi");
  tags.lastIndex = start;

  let depth = 1;
  let match: RegExpExecArray | null;

  while ((match = tags.exec(html))) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, match.index);
  }

  // Unclosed section — take everything that follows rather than nothing.
  return html.slice(start);
}

/**
 * Pulls question/answer pairs out of the `#blog-faq` block of a blog body.
 * The questions are the deepest headings in the block — that skips the block's
 * own section heading ("Frequently Asked Questions") when editors wrap it too —
 * and each answer is everything up to the next heading. Returns `[]` when the
 * block is absent, so a post without an FAQ simply emits no FAQPage node.
 */
export function extractFaqsFromHtml(
  html?: string | null,
  sectionId: string = BLOG_FAQ_SECTION_ID,
): IFaqEntry[] {
  if (!html) return [];

  const section = getElementInnerHtml(html, sectionId);
  if (!section) return [];

  const headingPattern = /<h([1-6])[\s>][\s\S]*?<\/h\1\s*>/gi;
  const headings: {
    level: number;
    text: string;
    start: number;
    end: number;
  }[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(section))) {
    headings.push({
      level: Number(match[1]),
      text: toPlainText(match[0]),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  const questionLevel = Math.max(...headings.map(({ level }) => level));

  return headings
    .map((heading, index) =>
      heading.level === questionLevel
        ? {
            question: heading.text,
            answer: toPlainText(
              section.slice(heading.end, headings[index + 1]?.start),
            ),
          }
        : null,
    )
    .filter((faq): faq is IFaqEntry => Boolean(faq?.question && faq?.answer));
}
