export function splitText(text: string, by: "words" | "characters" | "lines"): string[] {
  if (by === "lines") return text.split("\n");
  if (by === "words") return text.split(/(\s+)/u).filter(Boolean);
  if (typeof Intl.Segmenter === "undefined") return [text];
  return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)].map(
    (item) => item.segment,
  );
}
