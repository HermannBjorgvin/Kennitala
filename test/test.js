
var kennitala = require('../kennitala.js');
var ktmin = require('../kennitala-min.js');

function failedTestError(){
	throw new Error('General error, test failed or gave unexpected response');	
}

// -----------------------------
// | Valdiate human kennitölur |
// -----------------------------
try {

	if (
		kennitala.isPerson('3108962099') !== true
	) {
		failedTestError();
	};

	if (
		kennitala.isPerson('6010100890') !== false
	) {
		failedTestError();
	};

	if (
		kennitala.isPerson('310896-2099') !== true
	) {
		failedTestError();
	};

	if (
		kennitala.isPerson(3108962099) !== true
	) {
		failedTestError();
	};

	if (
		kennitala.isPerson('31089daa62099') !== true
	) {
		failedTestError();
	};

	if (
		kennitala.isPerson(9908962099) !== false
	) {
		failedTestError();
	};

}
catch (e) {
	throw e;
}

// -------------------------------
// | Valdiate company kennitölur |
// -------------------------------
try {
	if (!(
		kennitala.isCompany('6010100890') === true &&
		kennitala.isCompany('601010-0890') === true &&
		kennitala.isCompany(6010100890) === true &&
		kennitala.isCompany('3108962099') === false
	)) {
		failedTestError();
	};
}
catch (e) {
	throw e;
}

// ----------------------------
// | Validate .clean() method |
// ----------------------------
try {
	if (!(
		kennitala.clean('310896DIRTYSSID2099') === '3108962099' &&
		kennitala.clean(3108962099) === '3108962099' &&
		kennitala.clean('6010sfa100890') === '6010100890'
	)) {
		failedTestError();
	};
}
catch (e) {
	throw e;
}
