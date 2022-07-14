declare module "kennitala" {
    export function isValid(kennitala: string | number): boolean;
    export function isPerson(kennitala: string | number): boolean;
    export function isCompany(kennitala: string | number): boolean;

    export function sanitize(kennitala: string | number): string;
    export function format(kennitala: string | number, spacer?: string): string;

    export function generatePerson(date: Date): string
    export function generatePerson(date: Date, startingIncrement: number): string | undefined;
    export function generateCompany(date: Date): string;

    export function info(kennitala: string | number): KennitalaInfo;

    export interface KennitalaInfo {
        kt: string;
        valid: boolean;
        type: "person" | "company";
        birthday: Date;
        birthdayReadable: string;
        age: number;
    }
}
