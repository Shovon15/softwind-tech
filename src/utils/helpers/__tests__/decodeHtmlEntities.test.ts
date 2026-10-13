import { describe, expect, it } from "vitest";
import decodeHtmlEntities from "../decodeHtmlEntities";

describe("decodeHtmlEntities", () => {
  it("returns an empty string for falsy input", () => {
    expect(decodeHtmlEntities("")).toBe("");
    expect(decodeHtmlEntities(undefined as unknown as string)).toBe("");
  });

  it("decodes the typographic entities the CMS emits", () => {
    // The block title that rendered as `What&rsquo;s Included ...`
    expect(decodeHtmlEntities("What&rsquo;s Included With Your Next.js Chef"))
      .toBe("What\u2019s Included With Your Next.js Chef");

    expect(decodeHtmlEntities("Next.js&mdash;at home")).toBe(
      "Next.js\u2014at home",
    );
    expect(decodeHtmlEntities("&laquo;a&raquo;")).toBe("\u00aba\u00bb");
    expect(decodeHtmlEntities("Caf&eacute;")).toBe("Caf\u00e9");
    expect(decodeHtmlEntities("a&nbsp;b")).toBe("a\u00a0b");
    expect(decodeHtmlEntities("Wait&hellip;")).toBe("Wait\u2026");
  });

  it("still decodes the original five entities", () => {
    expect(decodeHtmlEntities("&lt;p&gt;")).toBe("<p>");
    expect(decodeHtmlEntities("Fish &amp; Chips")).toBe("Fish & Chips");
    expect(decodeHtmlEntities("&quot;quoted&quot;")).toBe('"quoted"');
    expect(decodeHtmlEntities("it&#039;s")).toBe("it's");
  });

  it("decodes decimal and hex numeric references", () => {
    expect(decodeHtmlEntities("it&#39;s")).toBe("it's");
    expect(decodeHtmlEntities("it&#x27;s")).toBe("it's");
    expect(decodeHtmlEntities("&#8217;")).toBe("\u2019");
    expect(decodeHtmlEntities("&#x2019;")).toBe("\u2019");
    // outside the BMP
    expect(decodeHtmlEntities("&#x1F600;")).toBe("\u{1F600}");
  });

  it("decodes a single level only", () => {
    expect(decodeHtmlEntities("&amp;rsquo;")).toBe("&rsquo;");
    expect(decodeHtmlEntities("&amp;amp;")).toBe("&amp;");
  });

  it("leaves unknown or malformed entities untouched", () => {
    expect(decodeHtmlEntities("&notanentity;")).toBe("&notanentity;");
    expect(decodeHtmlEntities("A & B")).toBe("A & B");
    expect(decodeHtmlEntities("5 &lt 6")).toBe("5 &lt 6");
    expect(decodeHtmlEntities("&#0;")).toBe("&#0;");
    expect(decodeHtmlEntities("&#xD800;")).toBe("&#xD800;");
    expect(decodeHtmlEntities("&#x110000;")).toBe("&#x110000;");
  });

  it("is deterministic without a DOM (server and client agree)", () => {
    expect(typeof document).toBe("undefined");
    expect(decodeHtmlEntities("What&rsquo;s")).toBe("What\u2019s");
  });
});
