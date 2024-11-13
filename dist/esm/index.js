// src/utils.ts
const MAGIC_NUMBERS = [3, 2, 7, 6, 5, 4, 3, 2, 0, 0];
const padZero = (num) => num < 10 ? `0${num}` : `${num}`;
const sanitizeInput = (kennitala) => {
    return typeof kennitala === "string" && /^\d{6}-?\d{4}$/.test(kennitala)
        ? kennitala.replace(/\D+/g, "")
        : undefined;
};
const isTemporary = (kt) => kt.startsWith("8") || kt.startsWith("9");
const getCentury = (centuryCode) => {
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

// src/validation.ts
const evaluate = (kt, entityEvaluationFn) => {
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
const isValidDate = (kt) => {
    let day = parseInt(kt.substring(0, 2), 10);
    const month = parseInt(kt.substring(2, 4), 10);
    const yearSuffix = kt.substring(4, 6);
    const centuryCode = parseInt(kt.substring(9), 10);
    const yearPrefix = getCentury(centuryCode);
    if (!yearPrefix)
        return false;
    if (isNaN(day) || isNaN(month)) {
        return false;
    }
    if (day > 40 && day <= 71) {
        day -= 40;
    }
    const year = parseInt(`${yearPrefix}${yearSuffix}`, 10);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day);
};
const isPerson = (kt) => {
    const day = parseInt(kt.substring(0, 2), 10);
    const digits78 = parseInt(kt.substring(6, 8), 10);
    return day > 0 && day <= 31 && digits78 >= 20;
};
const isTestPerson = (kt) => {
    const day = parseInt(kt.substring(0, 2), 10);
    const digits78 = kt.substring(6, 8);
    return day > 0 && day <= 31 && (digits78 === "14" || digits78 === "15");
};
const isCompany = (kt) => {
    const day = parseInt(kt.substring(0, 2), 10);
    return day > 40 && day <= 71;
};
const getDefaultOptions = (options) => {
    return {
        allowTestDataset: !!options && options.allowTestDataset === true,
    };
};

// src/generation.ts
const generateKennitala = (date, entityFn, startingIncrement) => {
    let day = date.getUTCDate();
    day = entityFn(day);
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const yearSuffix = year.toString().slice(-2);
    let kt = `${padZero(day)}${padZero(month)}${yearSuffix}`;
    const randomAndChecksum = (kt) => {
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
        }
        else {
            return `${digit7}${digit8}${remainder}`;
        }
    };
    const incrementingChecksum = (kt, incrementFrom) => {
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
            }
            else {
                return `${digit7}${digit8}${remainder}`;
            }
        }
        return undefined;
    };
    let digits789;
    if (startingIncrement) {
        digits789 = incrementingChecksum(kt, startingIncrement);
        if (!digits789)
            return undefined;
    }
    else {
        digits789 = randomAndChecksum(kt);
    }
    kt += digits789;
    const centuryDigit = year.toString()[1];
    kt += centuryDigit;
    return kt;
};
const generatePerson = (date, startingIncrement) => {
    return generateKennitala(date, personDayDelta, startingIncrement);
};
const generateCompany = (date) => {
    return generateKennitala(date, companyDayDelta);
};
const personDayDelta = (day) => day;
const companyDayDelta = (day) => day + 40;

// src/index.ts
const isValid = (kennitala, options) => {
    const kt = sanitizeInput(kennitala);
    if (!kt)
        return false;
    if (isTemporary(kt))
        return true;
    const opts = getDefaultOptions(options);
    const person = evaluate(kt, isPerson);
    const testPersonResult = evaluate(kt, isTestPerson);
    const company = evaluate(kt, isCompany);
    const dateValid = isValidDate(kt);
    return (dateValid &&
        (person || company || (testPersonResult && opts.allowTestDataset === true)));
};
const isPersonKennitala = (kennitala, options) => {
    const kt = sanitizeInput(kennitala);
    if (!kt)
        return false;
    const dateValid = isValidDate(kt);
    if (isTestPerson(kt) && (options === null || options === void 0 ? void 0 : options.allowTestDataset)) {
        return dateValid && evaluate(kt, isTestPerson);
    }
    else {
        return dateValid && evaluate(kt, isPerson);
    }
};
const isCompanyKennitala = (kennitala) => {
    const kt = sanitizeInput(kennitala);
    if (!kt)
        return false;
    const dateValid = isValidDate(kt);
    return dateValid && evaluate(kt, isCompany);
};
const isTemporaryKennitala = (kennitala) => {
    const kt = sanitizeInput(kennitala);
    return kt ? isTemporary(kt) : false;
};
const sanitize = (kennitala) => sanitizeInput(kennitala);
const formatKennitala = (kennitala, spacer = true) => {
    const kt = sanitizeInput(kennitala);
    if (!kt)
        return undefined;
    return `${kt.slice(0, 6)}${spacer ? "-" : ""}${kt.slice(6)}`;
};
const info = (kennitala) => {
    const kt = sanitizeInput(kennitala);
    if (!kt) {
        return {
            kt: "",
            valid: false,
            type: "unknown",
            birthday: new Date(NaN),
            birthdayReadable: "",
            age: NaN,
        };
    }
    const isPersonType = evaluate(kt, isPerson);
    const isCompanyType = evaluate(kt, isCompany);
    if (!isPersonType && !isCompanyType) {
        return {
            kt,
            valid: false,
            type: "unknown",
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
    if (!yearPrefix)
        return undefined;
    const year = parseInt(`${yearPrefix}${yearSuffix}`, 10);
    const birthday = new Date(Date.UTC(year, month - 1, day));
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
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

export { formatKennitala, generateCompany, generatePerson, info, isCompanyKennitala, isPersonKennitala, isTemporaryKennitala, isValid, sanitize };
//# sourceMappingURL=index.js.map
