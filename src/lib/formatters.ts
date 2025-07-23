const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export function formatToCompactNumber(number: number) {
  return compactNumberFormatter.format(number);
}
