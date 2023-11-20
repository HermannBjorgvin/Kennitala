declare module "kennitala" {
  export function isValid(kennitala: string): boolean;
  export function isPerson(kennitala: string): boolean;
  export function isCompany(kennitala: string): boolean;
  export function isTemporary(kennitala: string): boolean;

  export function sanitize(kennitala: string): string | undefined;
  export function format(kennitala: string, spacer?: string): string;

  export function generatePerson(date: Date): string;
  export function generatePerson(
    date: Date,
    startingIncrement: number
  ): string | undefined;
  export function generateCompany(date: Date): string;

  export function info(kennitala: string): KennitalaInfo;

  export interface KennitalaInfo {
    kt: string;
    valid: boolean;
    type: "person" | "company";
    birthday: Date;
    birthdayReadable: string;
    age: number;
  }
}
