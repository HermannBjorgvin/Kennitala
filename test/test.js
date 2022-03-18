var kennitala = require('../kennitala.js');
var should = require('chai').should();

describe('kennitala', function () {
	describe('#isPerson', function () {
		it("should validate known valid personal kennitala-s of various formats", function () {
			kennitala.isPerson('3108962099').should.equal(true);
			kennitala.isPerson('310896-2099').should.equal(true);
			kennitala.isPerson(3108962099).should.equal(true);
			kennitala.isPerson('31089daa62099').should.equal(true);
		});

		it("should not validate company kennitala-s or plain invalid ones either", function () {
			kennitala.isPerson('6010100890').should.equal(false);
			kennitala.isPerson(9908962099).should.equal(false);
		});

		it("should not validate kennitala with 13th month", function () {
			kennitala.isPerson('1337991337').should.equal(false);
		});
	});

	describe("#isCompany", function () {
		it("should validate known valid company ids", function () {
			kennitala.isCompany('6010100890').should.equal(true);
			kennitala.isCompany('601010-0890').should.equal(true);
			kennitala.isCompany(6010100890).should.equal(true);
		})

		it("should not validate personal kennitala-s", function () {
			kennitala.isCompany('3108962099').should.equal(false);
		});
	});

	describe("#isTemporary", function () {
		it("should validate temporary ids", function () {
			kennitala.isTemporary('8241251291').should.equal(true);
			kennitala.isTemporary('902412-2041').should.equal(true);
			kennitala.isValid('8241251291').should.equal(true);
			kennitala.isValid('902412-2041').should.equal(true);
			kennitala.isValid(9591601299).should.equal(true);
			kennitala.isTemporary(9591601299).should.equal(true);
		})

		it("should not validate invalid ids", function () {
			kennitala.isTemporary('0925120590').should.equal(false);
		});
	});

	describe("#sanitize inputs", function () {
		it("should remove invalid characters in kennitölur", function () { // ég bara gat ekki skrifað kennitala-s einu sinni í viðbót >_<
			kennitala.sanitize('310896DIRTYSSID2099').should.equal('3108962099');

			kennitala.sanitize('6010sfa100890').should.equal('6010100890');
		});

		it("should convert kennitölur of type int to string", function () {
			kennitala.sanitize(3108962099).should.be.a('string').and.equal('3108962099');
		});
	});
});
