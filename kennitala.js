var kennitala = {};
var MAGIC_NUMBERS = [3, 2, 7, 6, 5, 4, 3, 2, 0, 0];

kennitala.isPerson = function (kennitala) {
	return evaluate(kennitala, isPerson);
};

kennitala.isCompany = function (kennitala) {
	return evaluate(kennitala, isCompany);
};

kennitala.clean = function (kennitala) {
	return formatKennitala(kennitala);
};
	
/**
 * Evaluates the input string as a possible kennitala, as well
 * as running the possible entityEvaluation function on the input,
 * before calculating the sum 
 */
function evaluate(input, entityEvaluationFn) {
	var kt = formatKennitala(input);
	if (kt.length !== 10) {
		return false;
	};

	if (entityEvaluationFn && !entityEvaluationFn(kt)) {
		return false;
	};
	var sum = kt.split('').reduce(function (prev, curr, i) {
		return prev + curr * MAGIC_NUMBERS[i]
	}, 0);

	var remainder = 11 - (sum % 11);
	var secretNr = parseInt(kt.substr(8, 1), 0);

	return (remainder == 11 && secretNr === 0) || remainder === secretNr;
}

// People have first two characters between 1-31
function isPerson(kt) {
	var d = parseInt(kt.substr(0, 2), 10);

	return d > 0 && d <= 31;
};

// Companies have first two characters between 41-71
function isCompany(kt) {
	var d = parseInt(kt.substr(0, 2), 10);

	return d > 40 && d <= 71;
};

// Ensures datatype is string, then removes all non-digit characters from kennitala
function formatKennitala(p_kennitala) {
	var kennitala = "" + p_kennitala;

	kennitala = kennitala.replace(/(\D)+/g, '');

	return kennitala;
};

// UMD wrapper
if (typeof module !== 'undefined' && module.exports) {
	module.exports = kennitala;
} else if (typeof define === 'function' && define.amd) {
	define(kennitala);
} else if (window) {
	window.kennitala = kennitala;
}