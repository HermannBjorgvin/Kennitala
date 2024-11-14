// src/validation.ts

import { MAGIC_NUMBERS, getCentury } from "./utils";
import { ValidationOptions } from "./types";

const evaluate = (
  kt: string,
  entityEvaluationFn: ((kt: string) => boolean) | null
): boolean => {
  if (kt.length !== 10 || (entityEvaluationFn && !entityEvaluationFn(kt))) {
    return false;
  }

  const sum = kt
    .split("")
    .reduce((prev, curr, i) => prev + parseInt(curr, 10) * MAGIC_NUMBERS[i], 0);

  const remainder = 11 - (sum % 11);
  const checkDigit = parseInt(kt.charAt(8), 10);

  return (remainder === 11 && checkDigit === 0) || remainder === checkDigit;
};

const isValidDate = (kt: string): boolean => {
  // Edge case for valid company ID numbers that were created in error in 1969
  if (["700269", "690269"].includes(kt.substring(0, 6))) return true;

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
  const digits78 = parseInt(kt.substring(6, 8), 10);

  return day > 0 && day <= 31 && digits78 >= 20;
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

const getDefaultOptions = (options?: ValidationOptions): ValidationOptions => {
  return {
    allowTestDataset: !!options && options.allowTestDataset === true,
  };
};

export {
  evaluate,
  getDefaultOptions,
  isCompany,
  isPerson,
  isTemporary,
  isTestPerson,
  isValidDate,
};
