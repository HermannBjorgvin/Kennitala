# Kennitala
A validator for Icelandic kennitölur in node

Installing with npm:

    $ npm install kennitala

Compatible with CommonJS, AMD modules, regular Javascript.

Based off of old code, so defintiely not bullet proof, if you have a pull request it will almost definitely get accepted.

### Example of usage
    var kennitala = require('kennitala');
    
    kennitala.clean('310896DIRTYSSID2099'); '3108962099'
    kennitala.clean(3108962099); '3108962099'
    
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
    
    kennitala.isCompany([string, int]);
        returns boolean
    
        Checks if kennitala checksum is correct and if day of birth is between 41-71

### Things to add:
    
    Kennitala generator, for both people and companies
    
    Unit tests for everything
