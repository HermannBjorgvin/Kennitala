// src/types.ts

export interface KennitalaInfo {
  kt: string;
  valid: boolean;
  type: "person" | "company" | "temporary" | "invalid";
  birthday: Date;
  birthdayReadable: string;
  age: number;
}

export interface ValidationOptions {
  allowTestDataset?: boolean;
}
