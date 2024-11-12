import { ValidationOptions } from "./types";
declare const evaluate: (kt: string, entityEvaluationFn: ((kt: string) => boolean) | null) => boolean;
declare const isValidDate: (kt: string) => boolean;
declare const isPerson: (kt: string) => boolean;
declare const isTestPerson: (kt: string) => boolean;
declare const isCompany: (kt: string) => boolean;
declare const getDefaultOptions: (options?: ValidationOptions) => ValidationOptions;
export { isValidDate, isPerson, isCompany, isTestPerson, evaluate, getDefaultOptions, };
