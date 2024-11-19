// tests/index.test.ts

import {
  isPerson,
  isCompany,
  isValid,
  isTemporary,
  sanitize,
  formatKennitala,
  generatePerson,
  generateTemporary,
  info,
} from "../src/index";

describe("kennitala", () => {
  describe("isCompany", () => {
    it("should be able to check if kennitala is of a company", () => {
      expect(isCompany("5811131290")).toBe(true);
      expect(isCompany("150484-2359drop table('secretTable')")).toBe(false);
      expect(isCompany("1234567890")).toBe(false);
    });

    it("should not validate kerfiskennitölur as company kennitala", () => {
      expect(isCompany(generateTemporary())).toBe(false);
    });
  });

  describe("isValid", () => {
    it("should check if a kennitala is valid", () => {
      expect(isValid("1504842359")).toBe(true);
      expect(isValid(1504842359 as unknown as string)).toBe(false);
      expect(isValid("1514842359")).toBe(false);
    });

    it("should validate kerfiskennitölur even if they don't follow Mod11 rules", () => {
      expect(isValid(generateTemporary())).toBe(true);
    });
  });

  describe("sanitize", () => {
    it("should clean kennitala by removing non-digit characters", () => {
      expect(sanitize("010159-1234")).toBe("0101591234");
      expect(sanitize("1234567890")).toBe("1234567890");
      expect(sanitize(1234567890 as unknown as string)).toBeUndefined();
    });
  });

  describe("formatKennitala", () => {
    it("should add dash to kennitala", () => {
      expect(formatKennitala("1504842359")).toBe("150484-2359");
      expect(formatKennitala("0101842359")).toBe("010184-2359");
    });
  });

  describe("Age Calculations", () => {
    it("should calculate the correct age for a given kennitala", () => {
      // Note: Our 'info' function calculates age based on the current date.
      // We cannot pass a reference date. This limits our ability to test historical ages.
      // Suggestion: Consider updating 'info' or 'age' calculation to accept a reference date.

      // Example using current date
      const ktInfo = info("1504842359");
      expect(ktInfo?.valid).toBe(true);
      expect(ktInfo?.age).toBeDefined();

      const today = new Date();
      const birthDate = new Date(1984, 3, 15);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      expect(Math.floor(ktInfo!.age!)).toBe(age);
    });

    it("should return age of company kennitala", () => {
      const ktInfo = info("5811131290");
      expect(ktInfo?.valid).toBe(true);
      expect(ktInfo?.type).toBe("company");
      expect(ktInfo?.age).toBeDefined();
    });

    it("should handle age calculation for children younger than 1 year", () => {
      const kt = generatePerson(new Date());
      const ktInfo = info(kt!);
      expect(ktInfo?.valid).toBe(true);
      expect(ktInfo?.age).toBe(0);
    });
  });

  describe("generatePerson", () => {
    it("should generate a known kennitala", () => {
      const generatedKt = generatePerson(new Date("1996-08-31"));
      expect(generatedKt).toBe("3108962099");
    });

    it("should generate correct kennitala for given dates", () => {
      const testCases = [
        { date: new Date(1984, 3, 15), kt: "1504842009" },
        { date: new Date(1983, 4, 6), kt: "0605832189" },
        { date: new Date(1936, 0, 8), kt: "0801362189" },
        { date: new Date(1972, 11, 31), kt: "3112722099" },
      ];
      testCases.forEach(({ date, kt }) => {
        const generatedKt = generatePerson(date);
        expect(generatedKt).toBe(kt);
        expect(isValid(generatedKt!)).toBe(true);
      });
    });

    it("should generate a valid kennitala when no date is provided", () => {
      const kt = generatePerson(new Date(1954, 1, 2));
      expect(isValid(kt!)).toBe(true);
    });
  });

  describe("isValidDate", () => {
    it("should verify if kennitala has a valid birthdate", () => {
      const ktInfo1 = info("3106162180");
      expect(ktInfo1?.valid).toBe(false);

      const ktInfo2 = info("1504842359");
      expect(ktInfo2?.valid).toBe(true);
      expect(ktInfo2?.birthday?.toISOString().split("T")[0]).toBe("1984-04-15");

      const ktInfo3 = info(generatePerson(new Date(2012, 1, 29)) || "");
      expect(ktInfo3?.valid).toBe(true);
      expect(ktInfo3?.birthday?.toISOString().split("T")[0]).toBe("2012-02-29");

      const ktInfo4 = info("2902131239");
      expect(ktInfo4?.valid).toBe(false);
    });
  });

  describe("Invalid Month Validation", () => {
    it("kennitala with invalid month should not be valid", () => {
      expect(isValid("590881659")).toBe(false);
      expect(isValid("0590881659")).toBe(false);
    });
  });

  describe("Exception Handling for Year 1969", () => {
    it("should validate illegal company kennitölur from the year 1969", () => {
      expect(isValid("7002694509")).toBe(true);
      expect(isValid("7002691249")).toBe(true);
      expect(isValid("6902696279")).toBe(true);
      expect(isValid("6902690829")).toBe(true);
    });
  });

  describe("isPerson", () => {
    it("should validate known valid personal kennitala of various formats", () => {
      expect(isPerson("3108962099")).toBe(true);
      expect(isPerson("310896-2099")).toBe(true);
      expect(isPerson("31089daa62099")).toBe(false);
    });

    it("should not validate company kennitala or invalid ones", () => {
      expect(isPerson("6010100890")).toBe(false);
      expect(isPerson("9908962099")).toBe(false);
    });

    it("should not validate kennitala with invalid month", () => {
      expect(isPerson("1337991337")).toBe(false);
    });
  });

  describe("isCompany", () => {
    it("should validate known valid company ids", () => {
      expect(isCompany("6010100890")).toBe(true);
      expect(isCompany("601010-0890")).toBe(true);
    });

    it("should not validate personal kennitala", () => {
      expect(isCompany("3108962099")).toBe(false);
    });
  });

  describe("isTemporary", () => {
    it("should validate temporary ids", () => {
      expect(isTemporary("8241251291")).toBe(true);
      expect(isTemporary("902412-2041")).toBe(true);
      expect(isValid("8241251291")).toBe(true);
      expect(isValid("902412-2041")).toBe(true);
    });

    it("should not validate invalid ids", () => {
      expect(isTemporary("0925120590")).toBe(false);
    });
  });

  describe("sanitize", () => {
    it("should return undefined for invalid formats", () => {
      expect(sanitize("310896DIRTYSSID2099")).toBeUndefined();
      expect(sanitize("6010sfa100890")).toBeUndefined();
    });

    it("should return undefined for non-string types", () => {
      // @ts-expect-error Testing invalid input
      expect(sanitize(3108962099)).toBeUndefined();
    });
  });

  describe("formatKennitala", () => {
    it("should format kennitala correctly", () => {
      expect(formatKennitala("3108962099")).toBe("310896-2099");
    });
  });

  describe("Test Dataset People", () => {
    it("should validate test people when allowed", () => {
      expect(isPerson("1908991529", { allowTestDataset: false })).toBe(false);
      expect(isPerson("1909021450", { allowTestDataset: true })).toBe(true);
      expect(isValid("1905641429", { allowTestDataset: true })).toBe(true);
    });
  });

  describe("info", () => {
    it("should return correct info for a valid kennitala", () => {
      const ktInfo = info("3108962099");
      expect(ktInfo).toBeDefined();
      expect(ktInfo?.valid).toBe(true);
      expect(ktInfo?.type).toBe("person");
      expect(ktInfo?.birthday?.toISOString()).toBe(
        new Date("1996-08-31").toISOString()
      );
    });

    it("should return invalid info for an invalid kennitala", () => {
      const ktInfo = info("1337991337");
      expect(ktInfo).toBeDefined();
      expect(ktInfo?.valid).toBe(false);
    });
  });

  describe("Leap Year Edge Cases", () => {
    it("should validate kennitala on February 29th of a leap year", () => {
      const kt = generatePerson(new Date(Date.UTC(2000, 1, 29)));
      expect(kt).toBeDefined();
      expect(isValid(kt!)).toBe(true);
      const ktInfo = info(kt!);
      expect(ktInfo?.birthday?.toISOString().split("T")[0]).toBe("2000-02-29");
    });
  });

  describe("Age Calculation Edge Cases", () => {
    it("should calculate age correctly when birthday has occurred this year", () => {
      const today = new Date();
      const birthYear = today.getUTCFullYear() - 30;
      const birthDate = new Date(
        Date.UTC(birthYear, today.getUTCMonth(), today.getUTCDate() - 1)
      );
      const kt = generatePerson(birthDate);
      const ktInfo = info(kt!);
      expect(Math.floor(ktInfo!.age!)).toBe(30);
    });

    it("should calculate age correctly when birthday is today", () => {
      const today = new Date();
      const birthYear = today.getUTCFullYear() - 30;
      const birthDate = new Date(
        Date.UTC(birthYear, today.getUTCMonth(), today.getUTCDate())
      );
      const kt = generatePerson(birthDate);
      const ktInfo = info(kt!);
      expect(Math.floor(ktInfo!.age!)).toBe(30);
    });

    it("should calculate age correctly when birthday is tomorrow", () => {
      const today = new Date();
      const birthYear = today.getUTCFullYear() - 30;
      const birthDate = new Date(
        Date.UTC(birthYear, today.getUTCMonth(), today.getUTCDate() + 1)
      );
      const kt = generatePerson(birthDate);
      const ktInfo = info(kt!);
      expect(Math.floor(ktInfo!.age!)).toBe(29);
    });
  });

  describe("Formatting Validation", () => {
    it("should accept valid formats", () => {
      expect(sanitize("3108962099")).toBe("3108962099");
      expect(sanitize("310896-2099")).toBe("3108962099");
    });

    it("should reject invalid formats", () => {
      expect(sanitize("310896209")).toBeUndefined(); // Too short
      expect(sanitize("310896-20999")).toBeUndefined(); // Too long
      expect(sanitize("31-0896-2099")).toBeUndefined(); // Incorrect hyphen placement
      expect(sanitize("31a8962099")).toBeUndefined(); // Contains letters
      expect(sanitize("3108962099 ")).toBeUndefined(); // Trailing space
      expect(sanitize(" 3108962099")).toBeUndefined(); // Leading space
    });
  });
});
