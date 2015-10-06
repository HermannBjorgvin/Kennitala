(function () {

	var kennitala = {};

	kennitala.isPerson = function(kennitala){
		var kt = formatKennitala(kennitala);

		if (kt.length !== 10) {
			return false;
		};

		if (!isPerson(kt)) {
			return false;
		};

		var sum =	kt.charAt(0) * 3 + kt.charAt(1) * 2 +
					kt.charAt(2) * 7 + kt.charAt(3) * 6 +
					kt.charAt(4) * 5 + kt.charAt(5) * 4 +
					kt.charAt(6) * 3 + kt.charAt(7) * 2;

		var remainder = 11 - (sum % 11);
		var secretNr = kt.substr(8, 1);

		return (remainder == 11 && secretNr == 0) || remainder == secretNr;
	};

	kennitala.isCompany = function(kennitala){
		var kt = formatKennitala(kennitala);

		if (kt.length !== 10) {
			return false;
		};

		if (!isCompany(kt)) {
			return false;
		};

		var sum =	kt.charAt(0) * 3 + kt.charAt(1) * 2 +
					kt.charAt(2) * 7 + kt.charAt(3) * 6 +
					kt.charAt(4) * 5 + kt.charAt(5) * 4 +
					kt.charAt(6) * 3 + kt.charAt(7) * 2;

		var remainder = 11 - (sum % 11);
		var secretNr = kt.substr(8, 1);

		return (remainder == 11 && secretNr == 0) || remainder == secretNr;
	};

	kennitala.clean = function(kennitala){
		return formatKennitala(kennitala);
	};

	// People have first two characters between 1-31
	function isPerson(kt){
		var d = kt.substr(0, 2);

		return d > 0 && d <= 31; 
	};

	// Companies have first two characters between 41-71
	function isCompany(kt){
		var d = kt.substr(0, 2);

		return d > 40 && d <= 71;
	};

	// Ensures datatype is string, then removes all non-digit characters from kennitala
	function formatKennitala(p_kennitala){
		var kennitala = ""+p_kennitala;

		kennitala = kennitala.replace(/(\D)+/g, '');

		return kennitala;
	};

	// UMD wrapper
	if(typeof module !== 'undefined' && module.exports) {
		module.exports = kennitala;
	} else if (typeof define === 'function' && define.amd){
		define(kennitala);
	} else if (window) {
		window.kennitala = kennitala;
	}

}());
