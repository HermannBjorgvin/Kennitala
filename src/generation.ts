// src/generation.ts

import { MAGIC_NUMBERS, padZero } from "./utils";
import { isPerson } from "./validation";

const generateKennitala = (
  date: Date,
  entityFn: (day: number) => number,
  startingIncrement?: number
): string | undefined => {
  let day = date.getUTCDate();
  day = entityFn(day);

  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const yearSuffix = year.toString().slice(-2);

  let kt = `${padZero(day)}${padZero(month)}${yearSuffix}`;

  const randomAndChecksum = (kt: string): string => {
    let digit7 = Math.floor(Math.random() * 10);
    const digit8 = Math.floor(Math.random() * 10);

    if (isPerson(kt)) {
      digit7 = Math.floor(Math.random() * 8 + 2);
    }

    const tempKt = kt + digit7.toString() + digit8.toString();

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(tempKt[i], 10) * MAGIC_NUMBERS[i];
    }

    let remainder = 11 - (sum % 11);
    remainder = remainder === 11 ? 0 : remainder;

    if (remainder === 10) {
      return randomAndChecksum(kt);
    } else {
      return `${digit7}${digit8}${remainder}`;
    }
  };

  const incrementingChecksum = (
    kt: string,
    incrementFrom: number
  ): string | undefined => {
    let inc = incrementFrom;

    while (inc < 100) {
      const digits = padZero(inc).split("");
      const digit7 = digits[0];
      const digit8 = digits[1];

      const tempKt = kt + digit7 + digit8;

      let sum = 0;
      for (let i = 0; i < 8; i++) {
        sum += parseInt(tempKt[i], 10) * MAGIC_NUMBERS[i];
      }

      let remainder = 11 - (sum % 11);
      remainder = remainder === 11 ? 0 : remainder;

      if (remainder === 10) {
        inc++;
        continue;
      } else {
        return `${digit7}${digit8}${remainder}`;
      }
    }

    return undefined;
  };

  let digits789: string | undefined;
  if (startingIncrement) {
    digits789 = incrementingChecksum(kt, startingIncrement);
    if (!digits789) return undefined;
  } else {
    digits789 = randomAndChecksum(kt);
  }

  kt += digits789;

  const centuryDigit = year.toString()[1];
  kt += centuryDigit;

  return kt;
};

const generatePerson = (
  date: Date,
  startingIncrement = 20
): string | undefined => {
  return generateKennitala(date, personDayDelta, startingIncrement);
};

const generateCompany = (date: Date): string | undefined => {
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
