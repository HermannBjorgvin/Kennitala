export declare const MAGIC_NUMBERS: number[];
export declare const padZero: (num: number) => string;
export declare const sanitizeInput: (kennitala: string) => string | undefined;
export declare const isTemporary: (kt: string) => boolean;
export declare const getCentury: (centuryCode: number) => string | null;
export declare const calculateCheckDigit: (kt: string) => number | null;
