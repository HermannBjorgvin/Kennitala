// src/generation.ts

import { calculateChecksumRemainder, padZero } from "./utils";

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

  const randomAndChecksum = (kt: string): string => {
    const digit7 = Math.floor(Math.random() * 10);
    const digit8 = Math.floor(Math.random() * 10);

    const tempKt = kt + digit7.toString() + digit8.toString();
    const remainder = calculateChecksumRemainder(tempKt);

    return remainder === null
      ? randomAndChecksum(kt)
      : `${digit7}${digit8}${remainder}`;
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
      const remainder = calculateChecksumRemainder(tempKt);

      if (remainder === null) {
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
  }
  if (!digits789) {
    digits789 = randomAndChecksum(kt);
  }

  kt += digits789;

  const centuryDigit = year.toString()[1];
  kt += centuryDigit;

  return kt;
};

const generatePerson = (
  date: Date,
): string => {
  return generateKennitala(date, personDayDelta, 20);
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
