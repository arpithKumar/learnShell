// Masonry (CSS columns) flows each column independently, so there's no
// row-stretch problem to solve — variety comes from content richness, not
// a forced width/height span.
export function isFeatured(index: number): boolean {
  return index % 5 === 0;
}
