// tests/index.test.ts

import {
  isPersonKennitala,
  isCompanyKennitala,
  isValid,
  isTemporaryKennitala,
  sanitize,
  formatKennitala,
  generatePerson,
  info,
} from "../src/index";

describe("kennitala", () => {
  describe("isPersonKennitala", () => {
    it("should validate known valid personal kennitala of various formats", () => {
      expect(isPersonKennitala("3108962099")).toBe(true);
      expect(isPersonKennitala("310896-2099")).toBe(true);
      expect(isPersonKennitala("3108962099")).toBe(true);
      expect(isPersonKennitala("31089daa62099")).toBe(false);
    });

    it("should not validate company kennitala or invalid ones", () => {
      expect(isPersonKennitala("6010100890")).toBe(false);
      expect(isPersonKennitala("9908962099")).toBe(false);
    });

    it("should not validate kennitala with invalid month", () => {
      expect(isPersonKennitala("1337991337")).toBe(false);
    });
  });

  describe("isCompanyKennitala", () => {
    it("should validate known valid company ids", () => {
      expect(isCompanyKennitala("6010100890")).toBe(true);
      expect(isCompanyKennitala("601010-0890")).toBe(true);
    });

    it("should not validate personal kennitala", () => {
      expect(isCompanyKennitala("3108962099")).toBe(false);
    });
  });

  describe("isTemporaryKennitala", () => {
    it("should validate temporary ids", () => {
      expect(isTemporaryKennitala("8241251291")).toBe(true);
      expect(isTemporaryKennitala("902412-2041")).toBe(true);
      expect(isValid("8241251291")).toBe(true);
      expect(isValid("902412-2041")).toBe(true);
    });

    it("should not validate invalid ids", () => {
      expect(isTemporaryKennitala("0925120590")).toBe(false);
    });
  });

  describe("generatePerson", () => {
    it("should generate a known kennitala", () => {
      const generatedKt = generatePerson(new Date("1996-08-31"), 20);
      expect(generatedKt).toBe("3108962099");
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
      expect(isPersonKennitala("1908991529", { allowTestDataset: false })).toBe(
        false
      );
      expect(isPersonKennitala("1909021450", { allowTestDataset: true })).toBe(
        true
      );
      expect(isValid("1905641429", { allowTestDataset: true })).toBe(true);
    });
  });

  describe("info", () => {
    it("should return correct info for a valid kennitala", () => {
      const ktInfo = info("3108962099");
      expect(ktInfo).toBeDefined();
      expect(ktInfo?.valid).toBe(true);
      expect(ktInfo?.type).toBe("person");
      expect(ktInfo?.birthday.toISOString()).toBe(
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
      const kt = generatePerson(new Date(Date.UTC(2000, 1, 29)), 20); // Fixed increment
      expect(kt).toBeDefined();
      expect(isValid(kt!)).toBe(true);
      const ktInfo = info(kt!);
      expect(ktInfo?.birthday.toISOString().split("T")[0]).toBe("2000-02-29");
    });

    it("should adjust date and generate kennitala for March 1st when provided February 29th of a non-leap year", () => {
      const date = new Date(Date.UTC(2001, 1, 29)); // Adjusts to March 1st, 2001
      const kt = generatePerson(date, 20);
      expect(kt).toBeDefined();
      const ktInfo = info(kt!);
      expect(ktInfo?.birthday.toISOString().split("T")[0]).toBe("2001-03-01");
    });
  });

  describe("Age Calculation Edge Cases", () => {
    it("should calculate age correctly when birthday has occurred this year", () => {
      const today = new Date();
      const birthYear = today.getUTCFullYear() - 30;
      const birthDate = new Date(
        Date.UTC(birthYear, today.getUTCMonth(), today.getUTCDate() - 1)
      );
      const kt = generatePerson(birthDate, 20);
      const ktInfo = info(kt!);
      expect(Math.floor(ktInfo!.age)).toBe(30);
    });

    it("should calculate age correctly when birthday is today", () => {
      const today = new Date();
      const birthYear = today.getUTCFullYear() - 30;
      const birthDate = new Date(
        Date.UTC(birthYear, today.getUTCMonth(), today.getUTCDate())
      );
      const kt = generatePerson(birthDate, 20);
      const ktInfo = info(kt!);
      expect(Math.floor(ktInfo!.age)).toBe(30);
    });

    it("should calculate age correctly when birthday has not occurred yet this year", () => {
      const today = new Date();
      const birthYear = today.getUTCFullYear() - 30;
      const birthDate = new Date(
        Date.UTC(birthYear, today.getUTCMonth(), today.getUTCDate() + 1)
      );
      const kt = generatePerson(birthDate, 20);
      const ktInfo = info(kt!);
      expect(Math.floor(ktInfo!.age)).toBe(29);
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
