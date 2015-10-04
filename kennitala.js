(function () {

	var kennitala = {};

	kennitala.isValidCompany = function(){
		var kt = formatKennitala(kennitala);

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
	}

	kennitala.isValidPerson = function(kennitala){
		var kt = formatKennitala(kennitala);

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
	}

	function isPerson(kt){
		var d = kt.substr(0, 2);

		return d > 0 && d <= 31; 
	};

	function isCompany(kt){
		var d = kt.substr(0, 2);

		return d > 40 && d <= 71;
	};

	function formatKennitala(p_kennitala){
		// Make sure kennitala is string
		var kennitala = ""+p_kennitala;

		// Remove unwanted characters from kennitala
		kennitala = kennitala.replace(/[^0-9]/, '');

		return kennitala;
	};

	// AMD/CommonJS/PlainJS wrapper
	if(typeof module !== 'undefined' && module.exports) {
		module.exports = kennitala;
	} else if (typeof define === 'function' && define.amd){
		define(kennitala);
	} else if (window) {
		window.kennitala = kennitala;
	}

}());
