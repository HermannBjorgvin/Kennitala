(function(){
    
    /*
        Library API exports
    */
    var kennitala = {};

    kennitala.isValid = function(kennitala) {
        // Adds support for temporary KT
        var kt = formatKennitala(kennitala);
        if (kt.length === 10 && (kt.substring(0, 1) === '8' || kt.substring(0, 1) === '9')) {
            return true;
        }

        var person = evaluate(kennitala, isPerson);
        var company = evaluate(kennitala, isCompany);
        var dateValid = isValidDate(kennitala)

        return dateValid && (person || company);
    }

    kennitala.isPerson = function(kennitala) {
        var dateValid = isValidDate(kennitala)

        return dateValid && evaluate(kennitala, isPerson);
    };

    kennitala.isCompany = function(kennitala) {
        var dateValid = isValidDate(kennitala)

        return dateValid && evaluate(kennitala, isCompany);
    };

    kennitala.isTemporary = function(kennitala) {
        var kt = formatKennitala(kennitala)
        if (kt.length === 10 && (kt.substring(0, 1) === '8' || kt.substring(0, 1) === '9')) {
            return true;
        } else {
            return false;
        }
    }

    kennitala.sanitize = function (kennitala) {
        return formatKennitala(kennitala);
    };

    kennitala.format = function (kennitala, spacer) {
        var kt = formatKennitala(kennitala);
        spacer = typeof spacer !== 'undefined' ? spacer : '-';

        kt = kt.substring(0,6) + spacer + kt.substring(6, 10);

        return kt;
    };

    kennitala.generatePerson = function(date) {
        return generateKennitala(date, personDayDelta);
    };

    kennitala.generateCompany = function(date) {
        return generateKennitala(date, companyDayDelta);
    };

    /*
        Returns object with relevant information about kennitala    
        {
            kennitala: char(10),
            valid: boolean,
            type: enum("company", "person")
            age: int,
            birthday: Date object,
            birthdayReadable: Human readable Date String
        }
    */
    kennitala.info = function(kt){
        var info = {};

        info.kt = formatKennitala(kt);

        var isPersonType = evaluate(kt, isPerson);
        var isCompanyType = evaluate(kt, isCompany);

        // Check if kennitala is a valid company or person
        if (isPersonType || isCompanyType){
            info.valid = true;
            info.type = isPersonType === true ? "person" : "company";

            // Get birthday Date object
            var kennitala = formatKennitala(kt);
            var day = kennitala.substring(0, 2);
            
            // Company day delta
            if (day > 31) {
                day = day - 40;
            }
            var month = kennitala.substring(2, 4);

            // Century
            var year = (kennitala.substring(9, 10) == 0 ? 20 : 19) + kennitala.substring(4, 6);
            var birthday = new Date(year, month - 1, day);
            info.birthday = birthday;

            // Birthday readable string
            info.birthdayReadable = birthday.toDateString();

            // Age
            var today = new Date();
            var currentYear = today.getFullYear();
            
            // Birthday shifted forward to the current year
            var calcDate = new Date(birthday);
                calcDate.setFullYear(currentYear);
            
            var age = currentYear - birthday.getFullYear();
            if (calcDate > today) {
                age--;
            }
            if (age < 0) {
                // þjóðskrá some times registers kennitölur with temporary last digits... add 100 to correct negative age outcome
                age = age + 100;
            }
            else {
                age = age < 1
                    ? (today.getTime() - birthday.getTime()) /
                        1000 /
                        60 /
                        60 /
                        24 /
                        365.2422
                    : age;
            }

            info.age = age;

            return info;
        }
        else {
            info.valid = false;
            
            return info;
        }
    }

    /**
     * Evaluates the input string as a possible kennitala, as well
     * as running the possible entityEvaluation function on the input,
     * before calculating the sum 
     */
    var MAGIC_NUMBERS = [3, 2, 7, 6, 5, 4, 3, 2, 0, 0];
    function evaluate(input, entityEvaluationFn) {
        var kt = formatKennitala(input);
        if (kt.length !== 10) {
            return false;
        }

        if (entityEvaluationFn && !entityEvaluationFn(kt)) {
            return false;
        }
        var sum = kt.split('').reduce(function (prev, curr, i) {
            return prev + curr * MAGIC_NUMBERS[i];
        }, 0);

        var remainder = 11 - (sum % 11);
        var secretNr = parseInt(kt.substring(8, 9), 10);

        return (remainder == 11 && secretNr === 0) || remainder === secretNr;
    }

    // Checks if date is valid. This function could probably be simplified.
    function isValidDate(kennitala) {
        var kt = formatKennitala(kennitala)

        var d = parseInt(kt.substring(0, 2), 10);
        var m = parseInt(kt.substring(2, 4), 10);
        var y = parseInt(kt.substring(4, 6), 10);
        var c = parseInt(kt.substring(9, 10), 10);
        var yPre = ""

        if (isNaN(d) || isNaN(m) || isNaN(y) || isNaN(c)) {
            return false;
        }

        // For company kt we remove 40 from day
        if (d > 40 && d <= 71) {
            d = d - 40;
        }

        if (c === 0) {
            yPre = "20"
        } else if (c === 9) {            
            yPre = "19"
        } else if (c === 8) {
            yPre = "18"
        }

        var date = yPre
        date += (y < 10) ? "0" + y : "" + y
        date += "-"
        date += (m < 10) ? "0" + m : "" + m
        date += "-"
        date += (d < 10) ? "0" + d : "" + d

        return !isNaN(new Date(date).getTime())
    }

    // People have first two characters between 1-31
    function isPerson(kennitala) {
        var kt = formatKennitala(kennitala)
        var d = parseInt(kt.substring(0, 2), 10);

        // 7th and 8th characters for persons should be between incrementing from 20-99
        var inc = parseInt(kt.substring(6, 8), 10);

        return d > 0 && d <= 31 && inc >= 20 && inc <= 99;
    }

    // Companies have first two characters between 41-71
    function isCompany(kennitala) {
        var kt = formatKennitala(kennitala)
        var d = parseInt(kt.substring(0, 2), 10);

        return d > 40 && d <= 71;
    }

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
        }
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
            var digit8 = "" + Math.floor(Math.random() * 10);

            if (isPerson(kt)) {
                digit7 = "" + Math.floor(Math.random() * 8 + 2);
            }

            var tempKt = kt + digit7 + digit8;

            // Ninth number
            var sum = 0;
            for (var i = 0; i < 8; i++) {
                sum += tempKt[i] * MAGIC_NUMBERS[i];
            }

            sum = 11 - (sum % 11);
            sum = (sum == 11) ? 0 : sum;

            if (sum == 10) {
                return randomAndChecksum(kt);
            }
            else{
                return digit7 + digit8 + sum;
            }
        }

        // 7-9th characters
        kt += randomAndChecksum(kt);

        // 10th character is century
        year = date.getFullYear();
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
    }

    // UMD wrapper
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = kennitala;
    } else if (typeof define === 'function' && define.amd) {
        define(kennitala);
    } else if (window) {
        window.kennitala = kennitala;
    }

})();
