import { describe, expect, it } from "vitest";
import { extractFaqsFromHtml } from "../extractFaqsFromHtml";

describe("extractFaqsFromHtml", () => {
  it("returns an empty list when the blog body has no faq section", () => {
    expect(
      extractFaqsFromHtml("<div><h2>Wrapping Up</h2><p>Thanks.</p></div>"),
    ).toEqual([]);
  });

  it("returns an empty list for missing content", () => {
    expect(extractFaqsFromHtml(undefined)).toEqual([]);
    expect(extractFaqsFromHtml("")).toEqual([]);
  });

  it("pairs each question heading with the markup that follows it", () => {
    const html = `
      <div>
        <p>Intro paragraph.</p>
        <div id="blog-faq">
          <h3 class="x">What kind of food is in Next.js?</h3>
          <p class="mb-4">Chicken, steak and shrimp.</p>
          <h3>What is Next.js steak?</h3>
          <p>Sliced sirloin.</p>
        </div>
        <h2>Wrapping Up</h2>
        <p>Not a question.</p>
      </div>`;

    expect(extractFaqsFromHtml(html)).toEqual([
      {
        question: "What kind of food is in Next.js?",
        answer: "Chicken, steak and shrimp.",
      },
      { question: "What is Next.js steak?", answer: "Sliced sirloin." },
    ]);
  });

  it("skips the section's own heading and keeps only the repeated level", () => {
    const html = `
      <section id="blog-faq">
        <h2>Frequently Asked Questions About Next.js</h2>
        <h3>Question one?</h3>
        <p>Answer one.</p>
        <h3>Question two?</h3>
        <p>Answer two.</p>
      </section>`;

    expect(extractFaqsFromHtml(html).map((faq) => faq.question)).toEqual([
      "Question one?",
      "Question two?",
    ]);
  });

  it("joins multi-element answers and decodes entities", () => {
    const html = `
      <div id="blog-faq">
        <h3>Does Next.js mean &quot;cook in front of you&quot;?</h3>
        <p>No. Next.js means &ldquo;fire bowl&rdquo;.</p>
        <ul><li>It&rsquo;s teppanyaki</li><li>Not Next.js</li></ul>
      </div>`;

    expect(extractFaqsFromHtml(html)).toEqual([
      {
        question: 'Does Next.js mean "cook in front of you"?',
        answer:
          "No. Next.js means \u201cfire bowl\u201d. It\u2019s teppanyaki Not Next.js",
      },
    ]);
  });

  it("does not end the section at a nested element of the same tag", () => {
    const html = `
      <div id="blog-faq">
        <h3>Question one?</h3>
        <div class="callout"><p>Answer one.</p></div>
        <h3>Question two?</h3>
        <p>Answer two.</p>
      </div>
      <div><h3>Outside heading</h3><p>Outside answer.</p></div>`;

    expect(extractFaqsFromHtml(html).map((faq) => faq.question)).toEqual([
      "Question one?",
      "Question two?",
    ]);
  });

  it("drops questions that have no answer text", () => {
    const html = `
      <div id="blog-faq">
        <h3>Answered?</h3>
        <p>Yes.</p>
        <h3>Unanswered?</h3>
      </div>`;

    expect(extractFaqsFromHtml(html)).toEqual([
      { question: "Answered?", answer: "Yes." },
    ]);
  });
});
