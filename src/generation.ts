// src/generation.ts

import { calculateChecksumRemainder, padZero } from "./utils";

export function* generateKennitalaIterator(
  date: Date,
  entityFn: (day: number) => number,
  startingIncrement: number = 0
) {
  let day = date.getUTCDate();
  day = entityFn(day);

  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const yearSuffix = year.toString().slice(-2);
  const centuryDigit = year.toString()[1];

  const ddmmyy = `${padZero(day)}${padZero(month)}${yearSuffix}`;

  for (let i = startingIncrement; i < 100; i++) {
    const digits = padZero(i);
    const remainder = calculateChecksumRemainder(ddmmyy + digits);

    // Skip if check digit is invalid
    if (remainder == null) {
      continue;
    }

    yield `${ddmmyy}${digits}${remainder}${centuryDigit}`;
  }

  return undefined;
}

const generatePerson = (
  date: Date,
  startingIncrement = 20
): string | undefined => {
  return generateKennitalaIterator(
    date,
    personDayDelta,
    startingIncrement
  ).next().value;
};

const generateCompany = (date: Date): string | undefined => {
  return generateKennitalaIterator(date, companyDayDelta).next().value;
};

const generateTemporary = (): string => {
  const digits = "0123456789";
  let kt = "89"[Math.floor(Math.random())];

  for (let i = 0; i < 9; i++) {
    kt += digits[Math.floor(Math.random() * digits.length)];
  }

  return kt;
};

const personDayDelta = (day: number): number => day;

const companyDayDelta = (day: number): number => day + 40;

export { generatePerson, generateCompany, generateTemporary };
