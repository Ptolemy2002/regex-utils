import { z, ZodError, ZodIssue, ZodSchema } from "zod";

export type RegexInput = string | RegExp;

const accentPatterns: string[] = [
    "(a|á|à|ä|â|ã)", "(A|Á|À|Ä|Â|Ã)",
    "(e|é|è|ë|ê)"  , "(E|É|È|Ë|Ê)"  ,
    "(i|í|ì|ï|î)"  , "(I|Í|Ì|Ï|Î)"  ,
    "(o|ó|ò|ö|ô|õ)", "(O|Ó|Ò|Ö|Ô|Õ)",
    "(u|ú|ù|ü|û)"  , "(U|Ú|Ù|Ü|Û)"
];

export function combineFlags(...flags: string[]): string {
    const result = new Set();
    flags.forEach((flag) => {
        if (flag) {
            flag.split("").forEach((c) => {
                if (!result.has(c)) result.add(c);
            });
        }
    });

    return [...result].join("");
}

export function escapeRegex(value: RegexInput, flags: string = ""): RegExp {
    if (typeof value === 'string') {
        return new RegExp(value.replaceAll(/[\-\^\$.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    } else {
        return escapeRegex(value.source, combineFlags(value.flags, flags));
    }
}

export function regexAccentInsensitive(value: RegexInput, flags: string = ""): RegExp {
    if (typeof value === 'string') {
        let stringValue = value as string;

        accentPatterns.forEach((pattern) => {
            stringValue = stringValue.replaceAll(new RegExp(pattern, "g"), pattern);
        });

        return new RegExp(stringValue, flags);
    } else {
        return regexAccentInsensitive(value.source, combineFlags(value.flags, flags));
    }
}

export function removeAccents(value: string): string {
    accentPatterns.forEach((pattern) => {
        value = value.replaceAll(new RegExp(pattern, "g"), pattern[1]);
    });
    return value;
}

export function regexCaseInsensitive(value: RegexInput, flags: string = ""): RegExp {
    if (typeof value === 'string') {
        if (!flags.includes("i")) {
            flags += "i";
        }
        return new RegExp(value, flags);
    } else {
        return regexCaseInsensitive(value.source, combineFlags(value.flags, flags));
    }
}

export function regexMatchWhole(value: RegexInput, flags: string = ""): RegExp {
    if (typeof value === 'string') {
        return new RegExp(`^${value}$`, flags);
    } else {
        return regexMatchWhole(value.source, combineFlags(value.flags, flags));
    }
}

export type TransformRegexOptions = {
    flags?: string;
    caseInsensitive?: boolean;
    accentInsensitive?: boolean;
    matchWhole?: boolean;
};
export function transformRegex(value: RegexInput, {
    flags="",
    accentInsensitive=false,
    caseInsensitive=false,
    matchWhole=false
}: TransformRegexOptions = {}): RegExp {
    if (accentInsensitive) value = regexAccentInsensitive(value, flags);
    if (caseInsensitive) value = regexCaseInsensitive(value, flags);
    if (matchWhole) value = regexMatchWhole(value, flags);
    
    if (typeof value === 'string') {
        value = new RegExp(value, flags);
    } else {
        value = new RegExp(value.source, combineFlags(value.flags, flags));
    }

    return value;
}

export function isValidRegex(value: string, flags: string = ""): boolean {
    try {
        new RegExp(value, flags);
        return true;
    } catch {
        return false;
    }
}

export function isValidRegexFlags(value: string): boolean {
    return /^[gimsuy]*$/.test(value);
}

export type ZodValidator<O> = (v: O) => boolean;
export type ZodValidatorWithErrors<O> = (v: O) => true | string | string[];

export function interpretZodError(e: ZodError): string | string[] | null {
    const { errors } = e;

    function formatIssue(issue: ZodIssue) {
        const { path, message } = issue;
        if (path.length === 0) return message;
        return `${path.join(".")}: ${message}`;
    }

    if (errors.length === 0) return null;
    if (errors.length === 1) return formatIssue(errors[0]);
    return errors.map((e) => formatIssue(e));
}

export type ZodSafeParseable<O> = {
    safeParse: (v: unknown) => z.SafeParseReturnType<unknown, O>;
};

export function zodValidate<O>(
    p: ZodSafeParseable<O>,
): ZodValidator<O> {
    return (v) => {
        const result = p.safeParse(v);
        return result.success;
    }
}

export function zodValidateWithErrors<O>(
    p: ZodSafeParseable<O>,
    _throw = false,
): ZodValidatorWithErrors<O> {
    return (v) => {
        const result = p.safeParse(v);
        if (result.success) return true;

        const error = interpretZodError(result.error)!;
        if (_throw) {
            if (Array.isArray(error)) {
                throw new Error(error.join("\n"));
            } else {
                throw new Error(error);
            }
        }
        return error;
    }
}

const alphanumericPattern: RegExp = /[\w_-]+/i;
const nonAlphanumericPattern: RegExp = /[^\w_-]+/i;

export function isAlphanumeric(str: string): boolean {
    return zodValidate(
        z.string().regex(transformRegex(alphanumericPattern, {matchWhole: true}))
    )(str);
}

export function toAlphanumeric(str: string, separator: string = "-"): string {
    const globalNonAlphanumericPattern = transformRegex(nonAlphanumericPattern, {flags: "g"});
    str = removeAccents(str);
    const words = str.split(globalNonAlphanumericPattern);
    return words.map((word) => {
        return word.replaceAll(globalNonAlphanumericPattern, "");
    }).filter((word) => word).join(separator);
}

export function isValidEmail(v: string): boolean {
    return zodValidate(z.string().email())(v);
}

export function isValidURL(v: string): boolean {
    return zodValidate(z.string().url())(v);
}

export function isValidPhoneNumber(v: string): boolean {
    return zodValidate(
        z.coerce.string().regex(/^\+?\d?\s*(\(\d{3}\)|\d{3})(\s*|-)\d{3}(\s*|-)\d{4}$/)
    )(v);
}

export function isValidSSN(v: string): boolean {
    return zodValidate(z.coerce.string().regex(/^\d{3}-?\d{2}-?\d{4}$/))(v);
}

export const ZodCoercedBooleanEnum = z.enum([
    "true", "false",
    "t", "f",
    "yes", "no",
    "y", "n",
    "1", "0",
    "on", "off"
]);

export const ZodCoercedBoolean = ZodCoercedBooleanEnum.transform((val) => {
  switch (val) {
    case "true":
    case "t":
    case "yes":
    case "y":
    case "1":
    case "on":
      return true;
    case "false":
    case "f":
    case "no":
    case "n":
    case "0":
    case "off":
      return false;
  }
});