// src/utils.ts

const MAGIC_NUMBERS = [3, 2, 7, 6, 5, 4, 3, 2, 0, 0];

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

export const calculateChecksumRemainder = (kt: string): number | null => {
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(kt[i], 10) * MAGIC_NUMBERS[i];
  }

  const remainder = 11 - (sum % 11);
  return remainder === 10 ? null : remainder === 11 ? 0 : remainder;
};
