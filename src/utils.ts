// src/utils.ts

export const MAGIC_NUMBERS = [3, 2, 7, 6, 5, 4, 3, 2, 0, 0];

export const padZero = (num: number): string =>
  num < 10 ? `0${num}` : `${num}`;

export const sanitizeInput = (kennitala: string): string | undefined => {
  return typeof kennitala === "string" && /^\d{6}-?\d{4}$/.test(kennitala)
    ? kennitala.replace(/\D+/g, "")
    : undefined;
};

export const getCentury = (centuryCode: number): string | null => {
  switch (centuryCode) {
    case 0:
      return "20";
    case 9:
      return "19";
    case 8:
      return "18";
    default:
      return null;
  }
};

export const calculateCheckDigit = (kt: string): number | null => {
  const sum = kt
    .slice(0, 8)
    .split("")
    .reduce(
      (acc, curr, idx) => acc + parseInt(curr, 10) * MAGIC_NUMBERS[idx],
      0
    );
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return 0;
  if (remainder === 10) return null;
  return remainder;
};
