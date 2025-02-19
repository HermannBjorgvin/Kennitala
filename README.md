# Kennitala

Icelandic national ID (kennitölur) utilities for servers and clients. Now with TypeScript support!

[![Build Status](https://github.com/HermannBjorgvin/Kennitala/actions/workflows/ci.yml/badge.svg)](https://github.com/HermannBjorgvin/Kennitala/actions)
[![npm](https://img.shields.io/npm/v/kennitala.svg)](https://www.npmjs.com/package/kennitala)
[![npm](https://img.shields.io/npm/dm/kennitala.svg)](https://www.npmjs.com/package/kennitala)
![npm bundle size](https://img.shields.io/bundlephobia/min/kennitala)

Install with npm:

```bash
npm install kennitala
```

### Examples

```javascript
import { isValid } from "kennitala";

// Check if a kennitala is valid for either a person or a company
isValid("3108962099"); // returns true
isValid("8281249124"); // returns false
```

### Heads Up for Storing in Databases

This library validates kennitölur both with `-` spacers and without, so remember to **sanitize** your kennitala before storing it in a database!

You can use the included `sanitize` function:

```javascript
import { sanitize } from "kennitala";

const sanitizedKennitala = sanitize("310896-2099");
// returns '3108962099'
```

### More Examples

```javascript
import {
  isValid,
  isPerson,
  isCompany,
  formatKennitala,
  info,
  generatePerson,
  generateCompany,
} from 'kennitala';

// Get detailed information about a kennitala
const kennitalaInfo = info('3108962099');
// kennitalaInfo contains:
{
  kt: '3108962099',
  valid: true,
  type: 'person',
  birthday: new Date('1996-08-31T00:00:00.000Z'),
  birthdayReadable: 'Sat Aug 31 1996',
  age: 27,
}

// Check if a kennitala is valid for a person (returns false for companies)
isPerson('3108962099');            // returns true
isPerson('601010-0890');           // returns false (invalid date)
isPerson(3108962099);              // returns false (invalid input type)
isPerson('31^_^08!!96LOL20T_T99'); // returns false (invalid format)

// Check if a kennitala is valid for a company (returns false for persons)
isCompany('6010100890');  // returns true
isCompany('601010-0890'); // returns true
isCompany('3108962099');  // returns false

// Format a kennitala by adding a traditional '-' spacer
formatKennitala('3108962099');       // returns '310896-2099'
formatKennitala('3108962099', false); // returns '3108962099'
```

### API Documentation

Below is the API based on the type definitions from the refactored TypeScript library.

#### `isValid(kennitala: string, options?: { allowTestKennitala?: boolean }): boolean`

Checks if the kennitala checksum is correct for either a person or company. Non-digit characters are removed before validation.

- **Parameters:**

  - `kennitala`: The kennitala string to validate.
  - `options` (optional): An object with the following property:
    - `allowTestKennitala` (default: `false`): Set to `true` to allow validation of test kennitala numbers.

- **Returns:** `true` if the kennitala is valid, `false` otherwise.

#### `isPerson(kennitala: string, options?: { allowTestKennitala?: boolean }): boolean`

Checks if the kennitala is valid for a person. The day of birth must be between 1-31. Non-digit characters are removed before validation.

- **Parameters:**

  - `kennitala`: The kennitala string to validate.
  - `options` (optional): Same as in `isValid`.

- **Returns:** `true` if the kennitala is valid for a person, `false` otherwise.

#### `isCompany(kennitala: string): boolean`

Checks if the kennitala is valid for a company. The day of birth must be between 41-71. Non-digit characters are removed before validation.

- **Parameters:**

  - `kennitala`: The kennitala string to validate.

- **Returns:** `true` if the kennitala is valid for a company, `false` otherwise.

#### `isTemporary(kennitala: string): boolean`

Checks if the kennitala is a valid temporary ID.

- **Parameters:**

  - `kennitala`: The kennitala string to validate.

- **Returns:** `true` if the kennitala is a valid temporary ID, `false` otherwise.

#### `sanitize(kennitala: string): string | undefined`

Sanitizes the input by removing all non-digit characters.

- **Parameters:**

  - `kennitala`: The kennitala string to sanitize.

- **Returns:** The sanitized kennitala string if input is valid, `undefined` otherwise.

#### `formatKennitala(kennitala: string, spacer?: boolean): string`

Formats the kennitala by adding a `-` spacer between the 6th and 7th digits. Does not validate the input.

- **Parameters:**

  - `kennitala`: The kennitala string to format.
  - `spacer` (optional): Includes a `-` spacer character by default.

- **Returns:** The formatted kennitala string.

#### `info(kennitala: string): KennitalaInfo | undefined`

Returns an object containing information about the kennitala.

- **Parameters:**

  - `kennitala`: The kennitala string to analyze.

- **Returns:** An object of type `KennitalaInfo` if valid, `undefined` otherwise.

**`KennitalaInfo` Type Definition:**

```typescript
interface KennitalaInfo {
  kt: string; // The sanitized kennitala
  valid: boolean; // Whether the kennitala is valid
  type: "person" | "company" | "temporary" | "invalid"; // Type of kennitala
  age?: number; // Age calculated from the birthday (if applicable)
  birthday?: Date; // Date object representing the birthday (if applicable)
  birthdayReadable?: string; // Human-readable date string (if applicable)
}
```

#### `generatePerson(date: Date): string`

Generates a valid kennitala for a person based on a `Date` object to specify the birth date.

- **Parameters:**

  - `date`: The birth date to use for generating the kennitala.

- **Returns:** A valid kennitala string.

#### `generateCompany(date: Date): string`

Generates a valid kennitala for a company based on a `Date` object to specify the registration date.

- **Parameters:**

  - `date`: The date to use for generating the company kennitala.

- **Returns:** A valid kennitala string.

### Testing

The library uses [Jest](https://jestjs.io/) for testing. To run the tests, use:

```bash
npm test
```

### Building

To build the project, run:

```bash
npm run build
```

This will compile the TypeScript code and place the output in the `dist/` folder.
