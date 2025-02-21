// src/index.ts

import { sanitizeInput, getCentury } from "./utils";
import {
  evaluate,
  getDefaultOptions,
  isCompany as isCompanyType,
  isPerson as isPersonType,
  isTemporary as isTemporaryType,
  isTestPerson as isTestPersonType,
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

  if (isTemporaryType(kt)) return true;

  const opts = getDefaultOptions(options);
  const person = evaluate(kt, isPersonType);
  const testPersonResult = evaluate(kt, isTestPersonType);
  const company = evaluate(kt, isCompanyType);
  const dateValid = isValidDate(kt);

  return (
    dateValid &&
    (person || company || (testPersonResult && opts.allowTestDataset === true))
  );
};

export const isPerson = (
  kennitala: string,
  options?: ValidationOptions
): boolean => {
  const kt = sanitizeInput(kennitala);
  if (!kt) return false;

  const dateValid = isValidDate(kt);

  if (isTestPersonType(kt) && options?.allowTestDataset) {
    return dateValid && evaluate(kt, isTestPersonType);
  } else {
    return dateValid && evaluate(kt, isPersonType);
  }
};

export const isCompany = (kennitala: string): boolean => {
  const kt = sanitizeInput(kennitala);
  if (!kt) return false;

  const dateValid = isValidDate(kt);

  return dateValid && evaluate(kt, isCompanyType);
};

export const isTemporary = (kennitala: string): boolean => {
  const kt = sanitizeInput(kennitala);
  return kt ? isTemporaryType(kt) : false;
};

export const sanitize = (kennitala: string): string =>
  sanitizeInput(kennitala) ?? kennitala;

export const format = (kennitala: string, spacer: boolean = true): string => {
  const kt = kennitala.replace(/\D+/g, "");

  return `${kt.slice(0, 6)}${spacer && kt.length > 6 ? "-" : ""}${kt.slice(6)}`;
};

export const info = (
  kennitala: string,
  options?: ValidationOptions
): KennitalaInfo => {
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

  if (isTemporary(kt)) {
    return {
      kt,
      valid: true,
      type: "temporary",
      birthday: new Date(NaN),
      birthdayReadable: "",
      age: NaN,
    };
  }

  if (isPerson(kt, options) || isCompany(kt)) {
    let day = parseInt(kt.substring(0, 2), 10);
    if (day > 40) {
      day -= 40;
    }
    const month = parseInt(kt.substring(2, 4), 10);
    const yearSuffix = kt.substring(4, 6);
    const centuryCode = parseInt(kt.substring(9), 10);
    const yearPrefix = getCentury(centuryCode);

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
      type: isPersonType(kt) ? "person" : "company",
      birthday,
      birthdayReadable: birthday.toUTCString(),
      age,
    };
  }

  return {
    kt,
    valid: false,
    type: "invalid",
    birthday: new Date(NaN),
    birthdayReadable: "",
    age: NaN,
  };
};

export { generatePerson, generateCompany, generateTemporary };
export type { KennitalaInfo, ValidationOptions };

export default {
  isValid,
  isPerson,
  isCompany,
  isTemporary,
  sanitize,
  format,
  info,
  generatePerson,
  generateCompany,
  generateTemporary,
}
