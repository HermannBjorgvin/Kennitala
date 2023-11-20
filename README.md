Kennitala

---

Icelandic national ID (kennitölur) utilities for servers and clients. Now with TypeScript support!

[![Build Status](https://travis-ci.org/HermannBjorgvin/Kennitala.svg?branch=master)](https://travis-ci.org/HermannBjorgvin/Kennitala)
[![npm](https://img.shields.io/npm/v/kennitala.svg)](https://www.npmjs.com/package/kennitala)
[![npm](https://img.shields.io/npm/dm/kennitala.svg)](https://www.npmjs.com/package/kennitala)
![npm bundle size](https://img.shields.io/bundlephobia/min/kennitala)

Install with npm:

```bash
npm install kennitala
```

### Examples

```Javascript
const kennitala = require('kennitala');

// Check if kennitala is valid for either a company or individual
kennitala.isValid('3108962099'); // returns True
kennitala.isValid('8281249124'); // returns False
```

### Heads up for storing in Databases

This library will validate kennitölur with `-` spacers and no spacer, so remember to sanitize your kennitala before storing in a database!

This can be done with the included `.sanitize` function like so:

```Javascript
const kennitala = require('kennitala');

kennitala.sanitize('310896-2099');
// returns '3108962099'
```

### More examples

```Javascript
const kennitala = require('kennitala');

// the .info() method returns an object with useful information
kennitala.info('3108962099');
// returns
{
	kt: '3108962099',
	valid: true,
	type: 'person',
	birthday: 1996-08-31T00:00:00.000Z,
	birthdayReadable: 'Sat Aug 31 1996',
	age: 27
}

// Check if kennitala is valid for a person (returns false for companies)
kennitala.isPerson('3108962099');            // returns True
kennitala.isPerson('601010-0890');           // returns False because of invalid date
kennitala.isPerson(3108962099);              // returns False because of numeric type
kennitala.isPerson('31^_^08!!96LOL20T_T99'); // returns False because... well, just no

// Checks if kennitala is valid for a company (returns false for persons)
kennitala.isCompany('6010100890');  // True
kennitala.isCompany('601010-0890'); // True
kennitala.isCompany('3108962099');  // False

// the .format() method formats a kennitala and adds a traditional - spacer
// takes an optional parameter for the spacer between the 6th and 7th digit
// defaults to '-' but can be customized with an optional parameter

// Great for using with getters/setters in forms where you want to show the traditional format to users

kennitala.format('31089620');
// returns '310896-20'

kennitala.format('3108962099', '');
// returns '3108962099'

```

### API documentation

    kennitala.isValid(string, ?options: { allowTestDataset: false });
        returns boolean

        Checks if kennitala checksum is correct for either a person or company
        If passed a string with non-digit characters included it removes them before validating

        Allows passing optional options object to enable the test dataset
        https://www.skra.is/um-okkur/frettir/frett/2020/10/13/Ny-utgafa-af-gervigognum-thjodskrar/

    kennitala.info(string);
    	returns object with relevant information about this kennitala
        {
            kt: char(10),
            valid: boolean,
            type: enum("company", "person")
            age: int,
            birthday: Date object,
            birthdayReadable: Human readable Date String
        }

    kennitala.isPerson(string, ?options: { allowTestDataset: false });
        returns boolean

        Checks if kennitala checksum is correct and if day of birth is between 1-31
        If passed a string with non-digit characters included it removes them before validating

        Allows passing optional options object to enable the test dataset
        https://www.skra.is/um-okkur/frettir/frett/2020/10/13/Ny-utgafa-af-gervigognum-thjodskrar/

    kennitala.isCompany(string);
        returns boolean

        Checks if kennitala checksum is correct and if day of birth is between 41-71
        If passed a string with non-digit characters included it removes them before validating

    kennitala.format(string, ?[string]);
        returns string

        Ensures datatype is string, then matches and removes all non-digit characters
        and adds a traditional '-' spacer between 6th and 7th digit. This can be customized
        with an optional 2nd parameter.

    kennitala.sanitize(string);
        returns string or undefined

        Ensures datatype is string, then matches and removes all non-digit characters.

        Does not ensure a valid kennitala, only used for sanitizing input.

    kennitala.generatePerson([date]);
        returns string

        Takes Date object as a parameter and returns a new kennitala for a person

    kennitala.generateCompany([date]);
        returns string

        Takes Date object as a parameter and returns a new kennitala for a company

### Testing

Uses [Mocha](https://mochajs.org/) for testing. In order to execute the tests, you need to run `npm install -g mocha` first. Once you've done that
you can open up a command line and point it to the root directory of the project. From there you should be able to type either `npm test` or simply `mocha` to run the tests.

### Building

To build the project, you can type `npm run dist`, which minifies the script and generates a source map, and places both in the `dist/` folder.
