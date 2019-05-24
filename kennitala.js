(function(){
	
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

	kennitala.generatePerson = function(date) {
		return generateKennitala(date, personDayDelta);
	};

	kennitala.generateCompany = function(date) {
		return generateKennitala(date, companyDayDelta);
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
		var secretNr = parseInt(kt.substr(8, 1), 10);

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

	// Generate kennitala, takes in person/company entity function as well
	function generateKennitala(date, entityFn) {
		var kt = '';

	    // Date of month
	    var day = date.getDate();
	    if (day < 10) {
	    	day = "0"+day;
	    }
	    day = ""+day;

	    // Raise the day by 0 or 40 depending on whether this is a person or company
	    day = entityFn(day);

	    kt += day;

	    // Month
	    var month = date.getMonth();
	    month += 1;

	    if (month < 10) {
	    	month = "0"+month;
	    };
	    month = ""+month;

	    kt += month;

	    // Year
	    var year = date.getFullYear();
	    year = ""+year;
	    year = year[2] + year[3];

	    kt += year;

	    /*
	    	Recursive function that generates two random digits
	    	then generates 9th character from 1-8th characters

	    	Checks if 9th character is 10 in which case the entire proccess is repeated
	    */
	    function randomAndChecksum(kt) {
		    /* 
		    	7th and 8th characters are seemingly random for companies
		    	but are incrementing from 20-99 for individuals
		    */
		    var digit7 = "" + Math.floor(Math.random() * 10);
		    var digit8 = "" + Math.floor(Math.random() * 10)

		    if (isPerson(kt)) {
		        var digit7 = "" + Math.floor(Math.random() * 8 + 2);
		    }

		    var tempKt = kt + twoRandomDigits;

		    // Ninth number
		    var sum = 0;
		    for (var i = 0; i < 8; i++) {
		    	sum += tempKt[i] * MAGIC_NUMBERS[i];
		    };

		    sum = 11 - (sum % 11);
		    sum = (sum == 11) ? 0 : sum;

		    if (sum == 10) {
		    	return randomAndChecksum(kt);
		    }
		    else{
		    	return twoRandomDigits + sum;
		    };
	    }

	    // 7-9th characters
	    kt += randomAndChecksum(kt);

	    // 10th character is century
	    var year = date.getFullYear();
	    year = ""+year;
	    kt += year[1];

	    return kt;
	}

	// People's birth day of month is raised by 0
	function personDayDelta(day){
		return day;
	}

	// Companies birth day of month is raised by 40
	function companyDayDelta(day){
		return "" + (parseInt(day, 10) + 40);
	}

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

})();
