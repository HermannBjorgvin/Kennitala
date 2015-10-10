# Kennitala
[![Build Status](https://travis-ci.org/HermannBjorgvin/Kennitala.svg?branch=master)](https://travis-ci.org/HermannBjorgvin/Kennitala)

A validator and general utility for Icelandic kennitölur in Javascript

Compatible with CommonJS, AMD modules, regular Javascript.

Pull requests welcome

####Installation with npm:

    $ npm install kennitala

####Installation with bower:

    $ bower install kennitala

### Example of usage
    var kennitala = require('kennitala');
    
    kennitala.clean('310896DIRTYSSID2099'); // '3108962099'
    kennitala.clean(3108962099);            // '3108962099'
    
    kennitala.isPerson('3108962099');            // True
    kennitala.isPerson('310896-2099');           // True
    kennitala.isPerson(3108962099);              // True
    kennitala.isPerson('31^_^08!!96LOL20T_T99'); // True
    
    kennitala.isCompany('6010100890');  // True
    kennitala.isCompany('601010-0890'); // True
    kennitala.isCompany(6010100890);    // True

### API
    kennitala.clean([string, int]);
        returns string
    
        Ensures datatype is string, then matches and removes all non-digit characters. Does not ensure the remaining string is 10 characters
    
    kennitala.isPerson([string, int]);
        returns boolean
    
        Checks if kennitala checksum is correct and if day of birth is between 1-31
        If passed a string with non-digit characters included it removes them before validating
    
    kennitala.isCompany([string, int]);
        returns boolean
    
        Checks if kennitala checksum is correct and if day of birth is between 41-71
        If passed a string with non-digit characters included it removes them before validating

### Testing 

Uses [Mocha](https://mochajs.org/) for testing. In order to execute the tests, you need to run `npm install -g mocha` first. Once you've done that 
you can open up a command line and point it to the root directory of the project. From there you should be able to type either `npm test` or simply `mocha` to run the tests.

### Building 

To build the project, you can type `npm run dist`, which minifies the script and generates a source map, and places both in the `dist/` folder. 

### Coming soon<sup>TM</sup>
    
    Kennitala generator, for both people and companies
