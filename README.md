<h1 align=left>Kennitala</h1>
Icelandic national ID (kennitölur) utilities for servers and clients. Now with TypeScript support!

[![Build Status](https://travis-ci.org/HermannBjorgvin/Kennitala.svg?branch=master)](https://travis-ci.org/HermannBjorgvin/Kennitala)
[![npm](https://img.shields.io/npm/v/kennitala.svg)](https://www.npmjs.com/package/kennitala)
[![npm](https://img.shields.io/npm/dm/kennitala.svg)](https://www.npmjs.com/package/kennitala)
![npm bundle size](https://img.shields.io/bundlephobia/min/kennitala)

Install with npm:

```bash
npm install kennitala
```

Install with yarn:

```bash
yarn add kennitala
```

## V2.0.0-beta

A V2 is available and includes support for the new temporary id's.  
V2 includes one breaking change, the "clean" method is now "sanitize" to clarify what it does. It's required to sanitize an id before storing it since this library validates both id's with `-` spacers and without.

To try the V2 beta version you can install it like so:
`yarn add kennitala@2.0.0-beta.2`

Please raise any issue you find. Also note that the V2 code will be refactored, it does have some code duplication due to the unexpected addition of temporary id's.

### Examples

``` Javascript
const kennitala = require('kennitala');
    
// Check if kennitala is valid for either a company or individual
kennitala.isValid('3108962099'); // returns True
kennitala.isValid('8281249124'); // returns False
```

### Heads up for storing in Databases

This library will validate kennitölur with `-` spacers and no spacer, so remember to sanitize your kennitala before storing in a database!

This can be done with the included `.clean` or `.format` functions like so:

```Javascript
const kennitala = require('kennitala');

kennitala.clean('310896DIRTYSSID2099');
// returns '3108962099'
```

### More examples

``` Javascript
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
	age: 22
}

// Check if kennitala is valid for a person (returns false for companies)
kennitala.isPerson('3108962099');            // returns True
kennitala.isPerson('601010-0890');           // returns False
kennitala.isPerson(3108962099);              // returns True
kennitala.isPerson('31^_^08!!96LOL20T_T99'); // returns True

// Checks if kennitala is valid for a company (returns false for persons)
kennitala.isCompany('6010100890');  // True
kennitala.isCompany('601010-0890'); // True
kennitala.isCompany(3108962099);    // False

// the .format() method formats a kennitala and adds a traditional - spacer
// takes an optional parameter for the spacer between the 6th and 7th digit
// defaults to '-' but can be customized with an optional parameter

kennitala.format('310896DIRTYSSID2099');
// returns '310896-2099'

kennitala.format('3108962099', '-apple pie-');
// returns '310896-apple pie-2099'

kennitala.format('3108962099', '');
// returns '3108962099'

// the .clean() method removes all non digit characters. ideal for database storage
kennitala.clean(3108962099); // returns '3108962099'
```

### API documentation
    
    kennitala.isValid([string, int]);
        returns boolean
    
        Checks if kennitala checksum is correct for either a person or company
        If passed a string with non-digit characters included it removes them before validating
    
    kennitala.info([string, int]);
    	returns object with relevant information about this kennitala
        {
            kt: char(10),
            valid: boolean,
            type: enum("company", "person")
            age: int,
            birthday: Date object,
            birthdayReadable: Human readable Date String
        }

    kennitala.isPerson([string, int]);
        returns boolean
    
        Checks if kennitala checksum is correct and if day of birth is between 1-31
        If passed a string with non-digit characters included it removes them before validating
    
    kennitala.isCompany([string, int]);
        returns boolean
    
        Checks if kennitala checksum is correct and if day of birth is between 41-71
        If passed a string with non-digit characters included it removes them before validating

    kennitala.format([string, int], ?[string]);
        returns string
	
        Ensures datatype is string, then matches and removes all non-digit characters
        and adds a traditional '-' spacer between 6th and 7th digit. This can be customized
        with an optional 2nd parameter.
	
    kennitala.clean([string, int]);
        returns string
    
        Ensures datatype is string, then matches and removes all non-digit characters.
        Does not ensure the remaining string is 10 characters or that the kennitala is valid

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


### Sponsored by BrowserStack
Since Oct 2nd 2018 we are proudly sponsored in part by BrowserStack which sponsors thousands of open source projects. The plan is to implement automated testing for older browsers which will give us and our users good overview of the support they can expect for older browsers and operating systems.

<img width=300 src="https://raw.github.com/HermannBjorgvin/Kennitala/master/Browserstack-logo.svg?sanitize=true">

> I am using BrowserStack to easily test this library accross different browsers and operating systems from the comfort of my personal Linux machines, no need to set up a Windows or MacOS machine for testing.
> - Hermann Björgvin
