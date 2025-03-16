// src/validation.ts

import { calculateChecksumRemainder, getCentury } from "./utils";

const evaluate = (
  kt: string,
  entityEvaluationFn: ((kt: string) => boolean) | null
): boolean => {
  if (kt.length !== 10 || (entityEvaluationFn && !entityEvaluationFn(kt))) {
    return false;
  }

  const remainder = calculateChecksumRemainder(kt);
  const checkDigit = parseInt(kt.charAt(8), 10);

  return remainder !== null && remainder === checkDigit;
};

const isValidDate = (kt: string): boolean => {
  // Ensure every KT is from 19th, 20th or 21st century
  if (!["0", "9", "8"].includes(kt.substring(9, 10))) return false;

  // Edge case for valid company ID numbers that were created in error in 1969
  if (["710269", "700269", "690269"].includes(kt.substring(0, 6))) return true;

  let day = parseInt(kt.substring(0, 2), 10);
  const month = parseInt(kt.substring(2, 4), 10);
  const yearSuffix = kt.substring(4, 6);
  const centuryCode = parseInt(kt.substring(9), 10);
  const yearPrefix = getCentury(centuryCode);

  if (!yearPrefix) return false;

  if (isNaN(day) || isNaN(month)) {
    return false;
  }

  if (day > 40 && day <= 71) {
    day -= 40;
  }

  const year = parseInt(`${yearPrefix}${yearSuffix}`, 10);

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isPerson = (kt: string): boolean => {
  const day = parseInt(kt.substring(0, 2), 10);

  return day > 0 && day <= 31;
};

const isTestPerson = (kt: string): boolean => {
  const day = parseInt(kt.substring(0, 2), 10);
  const digits78 = kt.substring(6, 8);

  return day > 0 && day <= 31 && (digits78 === "14" || digits78 === "15");
};

const isCompany = (kt: string): boolean => {
  const day = parseInt(kt.substring(0, 2), 10);

  return day > 40 && day <= 71;
};

const isTemporary = (kt: string): boolean =>
  kt.startsWith("8") || kt.startsWith("9");

export {
  evaluate,
  isCompany,
  isPerson,
  isTemporary,
  isTestPerson,
  isValidDate,
};
