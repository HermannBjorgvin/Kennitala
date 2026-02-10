// src/generation.ts

import { padZero } from "./utils";

const generateKennitala = (
  date: Date,
  entityFn: (day: number) => number,
  startingIncrement?: number
): string => {
  let day = date.getUTCDate();
  day = entityFn(day);

  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const yearSuffix = year.toString().slice(-2);

  let kt = `${padZero(day)}${padZero(month)}${yearSuffix}`;

  const randomDigits789 = (): string => {
    const digit7 = Math.floor(Math.random() * 10);
    const digit8 = Math.floor(Math.random() * 10);
    const digit9 = Math.floor(Math.random() * 10);

    return `${digit7}${digit8}${digit9}`;
  };

  const incrementingDigits789 = (incrementFrom: number): string => {
    return incrementFrom.toString().padStart(3, "0");
  };

  let digits789: string | undefined;
  if (startingIncrement) {
    digits789 = incrementingDigits789(startingIncrement);
    if (!digits789) return "";
  } else {
    digits789 = randomDigits789();
  }

  kt += digits789;

  const centuryDigit = year.toString()[1];
  kt += centuryDigit;

  return kt;
};

const generatePerson = (date: Date, startingIncrement = 200): string => {
  return generateKennitala(date, personDayDelta, startingIncrement);
};

const generateCompany = (date: Date): string => {
  return generateKennitala(date, companyDayDelta);
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
