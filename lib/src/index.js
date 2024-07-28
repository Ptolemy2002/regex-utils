const accentPatterns = [
    "(a|á|à|ä|â|ã)", "(A|Á|À|Ä|Â|Ã)",
    "(e|é|è|ë|ê)"  , "(E|É|È|Ë|Ê)"  ,
    "(i|í|ì|ï|î)"  , "(I|Í|Ì|Ï|Î)"  ,
    "(o|ó|ò|ö|ô|õ)", "(O|Ó|Ò|Ö|Ô|Õ)",
    "(u|ú|ù|ü|û)"  , "(U|Ú|Ù|Ü|Û)"
];

export function combineFlags(...flags) {
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

export function escapeRegex(value, flags = "") {
    if (typeof value === 'string') {
        return new RegExp(value.replaceAll(/[\-\^\$.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    } else if (value instanceof RegExp) {
        return escapeRegex(value.source, combineFlags(value.flags, flags));
    } else {
        throw new TypeError("Expected string or RegExp, got " + typeof value);
    }
}

export function regexAccentInsensitive(value, flags = "") {
    if (typeof value === 'string') {
        accentPatterns.forEach((pattern) => {
            value = value.replaceAll(new RegExp(pattern, "g"), pattern);
        });
        return new RegExp(value, flags);
    } else if (value instanceof RegExp) {
        return regexAccentInsensitive(value.source, combineFlags(value.flags, flags));
    } else {
        throw new TypeError("Expected string or RegExp, got " + typeof value);
    }
}

export function removeAccents(value) {
    if (typeof value === 'string') {
        accentPatterns.forEach((pattern) => {
            value = value.replaceAll(new RegExp(pattern, "g"), pattern[1]);
        });
        return value;
    } else {
        throw new TypeError("Expected string, got " + typeof value);
    }
}

export function regexCaseInsensitive(value, flags = "") {
    if (typeof value === 'string') {
        if (!flags.includes("i")) {
            flags += "i";
        }
        return new RegExp(value, flags);
    } else if (value instanceof RegExp) {
        return regexCaseInsensitive(value.source, combineFlags(value.flags, flags));
    } else {
        throw new TypeError("Expected string or RegExp, got " + typeof value);
    }
}

export function regexMatchWhole(value, flags = "") {
    if (typeof value === 'string') {
        return new RegExp(`^${value}$`, flags);
    } else if (value instanceof RegExp) {
        return regexMatchWhole(value.source, combineFlags(value.flags, flags));
    } else {
        throw new TypeError("Expected string or RegExp, got " + typeof value);
    }
}

export function transformRegex(value, {flags="", accentInsensitive=false, caseInsensitive=false, matchWhole=false}) {
    if (accentInsensitive) value = regexAccentInsensitive(value, flags);
    if (caseInsensitive) value = regexCaseInsensitive(value, flags);
    if (matchWhole) value = regexMatchWhole(value, flags);
    
    if (value instanceof RegExp) {
        value = new RegExp(value.source, combineFlags(value.flags, flags));
    } else {
        value = new RegExp(value, flags);
    }

    return value;
}

export function isValidRegex(value, flags = "") {
    try {
        new RegExp(value, flags);
        return true;
    } catch {
        return false;
    }
}

export function isValidRegexFlags(value) {
    return /^[gimsuy]*$/.test(value);
}

export const alphanumericPattern = /[\w_-]+/i;
export const nonAlphanumericPattern = /[^\w_-]+/i;

export function isAlphanumeric(str) {
    return transformRegex(alphanumericPattern, {matchWhole: true}).test(str);
}

export function toAlphanumeric(str, separator="-") {
    const globalNonAlphanumericPattern = transformRegex(nonAlphanumericPattern, {flags: "g"});
    str = removeAccents(str);
    const words = str.split(globalNonAlphanumericPattern);
    return words.map((word) => {
        return word.replaceAll(globalNonAlphanumericPattern, "");
    }).filter((word) => word).join(separator);
}

export function isValidEmail(v) {
    return /^\S+@\S+\.\S+$/.test(v);
}

export function isValidPhoneNumber(v) {
    return /^\+?\d?\s*(\(\d{3}\)|\d{3})(\s*|-)\d{3}(\s*|-)\d{4}$/.test(v);
}

export function isValidURL(v) {
    return /^https?:\/\/\S+\.\S+$/.test(v);
}

export function isValidSSN(v) {
    return /^\d{3}-?\d{2}-?\d{4}$/.test(v);
}