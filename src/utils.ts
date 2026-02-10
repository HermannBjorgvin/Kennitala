// src/utils.ts

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
