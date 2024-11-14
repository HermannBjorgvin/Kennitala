// src/index.ts

import { sanitizeInput, getCentury } from "./utils";
import {
  evaluate,
  getDefaultOptions,
  isCompany,
  isPerson,
  isTemporary,
  isTestPerson,
  isValidDate,
} from "./validation";
import {
  generatePerson,
  generateCompany,
  generateTemporary,
} from "./generation";
import { KennitalaInfo, ValidationOptions } from "./types";

export const isValid = (
  kennitala: string,
  options?: ValidationOptions
): boolean => {
  const kt = sanitizeInput(kennitala);
  if (!kt) return false;

  if (isTemporary(kt)) return true;

  const opts = getDefaultOptions(options);
  const person = evaluate(kt, isPerson);
  const testPersonResult = evaluate(kt, isTestPerson);
  const company = evaluate(kt, isCompany);
  const dateValid = isValidDate(kt);

  return (
    dateValid &&
    (person || company || (testPersonResult && opts.allowTestDataset === true))
  );
};

export const isPersonKennitala = (
  kennitala: string,
  options?: ValidationOptions
): boolean => {
  const kt = sanitizeInput(kennitala);
  if (!kt) return false;

  const dateValid = isValidDate(kt);

  if (isTestPerson(kt) && options?.allowTestDataset) {
    return dateValid && evaluate(kt, isTestPerson);
  } else {
    return dateValid && evaluate(kt, isPerson);
  }
};

export const isCompanyKennitala = (kennitala: string): boolean => {
  const kt = sanitizeInput(kennitala);
  if (!kt) return false;

  const dateValid = isValidDate(kt);

  return dateValid && evaluate(kt, isCompany);
};

export const isTemporaryKennitala = (kennitala: string): boolean => {
  const kt = sanitizeInput(kennitala);
  return kt ? isTemporary(kt) : false;
};

export const sanitize = (kennitala: string): string | undefined =>
  sanitizeInput(kennitala);

export const formatKennitala = (
  kennitala: string,
  spacer: boolean = true
): string | undefined => {
  const kt = sanitizeInput(kennitala);
  if (!kt) return undefined;
  return `${kt.slice(0, 6)}${spacer ? "-" : ""}${kt.slice(6)}`;
};

export const info = (kennitala: string): KennitalaInfo | undefined => {
  const kt = sanitizeInput(kennitala);
  if (!kt) {
    return {
      kt: "",
      valid: false,
      type: "invalid",
      birthday: new Date(NaN),
      birthdayReadable: "",
      age: NaN,
    };
  }

  const isPersonType = evaluate(kt, isPerson);
  const isCompanyType = evaluate(kt, isCompany);
  const isTemporaryType = isTemporary(kt);

  if (isTemporaryType) {
    return {
      kt,
      valid: true,
      type: "temporary",
      birthday: new Date(NaN),
      birthdayReadable: "",
      age: NaN,
    };
  }

  if (!isPersonType && !isCompanyType) {
    return {
      kt,
      valid: false,
      type: "invalid",
      birthday: new Date(NaN),
      birthdayReadable: "",
      age: NaN,
    };
  }

  let day = parseInt(kt.substring(0, 2), 10);
  if (day > 40) {
    day -= 40;
  }
  const month = parseInt(kt.substring(2, 4), 10);
  const yearSuffix = kt.substring(4, 6);
  const centuryCode = parseInt(kt.substring(9), 10);
  const yearPrefix = getCentury(centuryCode);

  if (!yearPrefix) return undefined;

  const year = parseInt(`${yearPrefix}${yearSuffix}`, 10);
  const birthday = new Date(Date.UTC(year, month - 1, day));

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  let age = todayUTC.getUTCFullYear() - birthday.getUTCFullYear();
  const m = todayUTC.getUTCMonth() - birthday.getUTCMonth();
  const d = todayUTC.getUTCDate() - birthday.getUTCDate();

  if (m < 0 || (m === 0 && d < 0)) {
    age--;
  }

  if (age < 0) {
    age += 100;
  }

  return {
    kt,
    valid: true,
    type: isPersonType ? "person" : "company",
    birthday,
    birthdayReadable: birthday.toUTCString(),
    age,
  };
};

export { generatePerson, generateCompany, generateTemporary };
