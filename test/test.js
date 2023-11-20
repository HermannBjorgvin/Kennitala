var kennitala = require("../kennitala.js");
var should = require("chai").should();

describe("kennitala", function () {
  describe("#isPerson", function () {
    it("should validate known valid personal kennitala-s of various formats", function () {
      kennitala.isPerson("3108962099").should.equal(true);
      kennitala.isPerson("310896-2099").should.equal(true);
      kennitala.isPerson(3108962099).should.equal(false);
      kennitala.isPerson("31089daa62099").should.equal(false);
    });

    it("should not validate company kennitala-s or plain invalid ones either", function () {
      kennitala.isPerson("6010100890").should.equal(false);
      kennitala.isPerson(9908962099).should.equal(false);
    });

    it("should not validate kennitala with 13th month", function () {
      kennitala.isPerson("1337991337").should.equal(false);
    });
  });

  describe("#isCompany", function () {
    it("should validate known valid company ids", function () {
      kennitala.isCompany("6010100890").should.equal(true);
      kennitala.isCompany("601010-0890").should.equal(true);
      kennitala.isCompany(6010100890).should.equal(false);
    });

    it("should not validate personal kennitala-s", function () {
      kennitala.isCompany("3108962099").should.equal(false);
    });
  });

  describe("#isTemporary", function () {
    it("should validate temporary ids", function () {
      kennitala.isTemporary("8241251291").should.equal(true);
      kennitala.isTemporary("902412-2041").should.equal(true);
      kennitala.isValid("8241251291").should.equal(true);
      kennitala.isValid("902412-2041").should.equal(true);
      kennitala.isValid(9591601299).should.equal(false);
      kennitala.isTemporary(9591601299).should.equal(false);
    });

    it("should not validate invalid ids", function () {
      kennitala.isTemporary("0925120590").should.equal(false);
    });
  });

  describe("#generateKennitala", function () {
    it("should generate my id", function () {
      kennitala
        .generatePerson(new Date("1996-08-31"), 20)
        .should.equal("3108962099");
    });
  });

  describe("#sanitize inputs", function () {
    it("should give undefined for invalid formats", function () {
      should.equal(kennitala.sanitize("310896DIRTYSSID2099"), undefined);
      should.equal(kennitala.sanitize("6010sfa100890"), undefined);
    });

    it("should give undefined for non string types", function () {
      should.equal(kennitala.sanitize(3108962099), undefined);
    });
  });

  describe("#format input", function () {
    it("should ensure string follows format xxxxxx-xxxx", function () {
      kennitala.format("31089620").should.equal("310896-20");
    });
  });

  describe("#test people", function () {
    it("should validate test people from the test dataset", function () {
      should.equal(
        kennitala.isPerson("1908991529", { allowTestDataset: false }),
        false
      );
      should.equal(
        kennitala.isPerson("1909021450", { allowTestDataset: true }),
        true
      );
      should.equal(
        kennitala.isValid("1905641429", { allowTestDataset: true }),
        true
      );
    });
  });
});
