# Regex Utils
This library contains utilities that are useful when working with JavaScript regular expressions.

The functions are not exported as default, so you can import them in one of the following ways:
```javascript
// ES6
import { functionName } from '@ptolemy2002/regex-utils';
// CommonJS
const { functionName } = require('@ptolemy2002/regex-utils');
```

## Type Reference
```typescript
type RegexInput = string | RegExp;
type TransformRegexOptions = {
    flags?: string;
    caseInsensitive?: boolean;
    accentInsensitive?: boolean;
    matchWhole?: boolean;
};
export type ZodValidator<O> = (v: O) => boolean;
export type ZodValidatorWithErrors<O> = (v: O) => true | string | string[];
```

## Functions
The following functions are available in the library:

### combineFlags
#### Description
Combines two sets of flags into one string. If a flag is present in both sets, it will only appear once in the result.

#### Parameters
- `...flags` (`string[]`): The sets of flags to be combined. Falsey values will be ignored.

#### Returns
`string` - The combined flags.

### escapeRegex
#### Description
Escapes a value so that it can be used as a literal in a regular expression. If spefifying a `RegExp` object, the flags are added after transforming the source to a literal.

#### Parameters
- `value` (`RegexInput`): The value to be escaped.
- `flags` (`string`): The flags to be used in the regular expression. If a `RegExp` object is passed, these flags will be added to the existing flags.

#### Returns
`RegExp` - The escaped regular expression.

### regexAccentInsensitive
#### Description
Attempts to transform a `RegExp` object to be accent insensitive. Note that this is done using a static list of common characters and their accented versions, so it is not perfect.

#### Parameters
- `value` (`RegexInput`): The value to be transformed to be accent insensitive.
- `flags` (`string`): The flags to be used in the regular expression. If a `RegExp` object is passed, these flags will be added to the existing flags.

#### Returns
`RegExp` - The accent insensitive regular expression.

### removeAccents
#### Description
Attempts to remove accents from a string. Note that this is done using a static list of common characters and their accented versions, so it is not perfect.

#### Parameters
- `value` (`string`): The value to be transformed to remove accents.

#### Returns
`string` - The string with accents removed.

### regexCaseInsensitive
#### Description
Transforms a `RegExp` object to be case insensitive by adding the `i` flag.

#### Parameters
- `value` (`RegexInput`): The value to be transformed to be case insensitive.
- `flags` (`string`): The flags to be used in the regular expression. If a `RegExp` object is passed, these flags will be added to the existing flags.

#### Returns
`RegExp` - The case insensitive regular expression.

### regexMatchWhole
#### Description
Transforms a `RegExp` object to match the whole string by adding `^` and `$` to the beginning and end of the source, respectively.

#### Parameters
- `value` (`RegexInput`): The value to be transformed to match the whole string.
- `flags` (`string`): The flags to be used in the regular expression. If a `RegExp` object is passed, these flags will be added to the existing flags.

#### Returns
`RegExp` - The regular expression that matches the whole string.

### transformRegex
#### Description
This function is a quick way to apply multiple supported transformations to a regular expression.

#### Parameters
- `value` (`String | RegExp`): The value to be transformed.
- `args` (`TransformRegexOptions`): Used to specify optional arguments.
    - `accentInsensitive` (`boolean`): Whether to make the regular expression accent insensitive. Default is `false`.
    - `caseInsensitive` (`boolean`): Whether to make the regular expression case insensitive. Default is `false`.
    - `matchWhole` (`boolean`): Whether to make the regular expression match the whole string. Default is `false`.
    - `flags` (`string`): The flags to be used in the regular expression. If a `RegExp` object is passed, these flags will be added to the existing flags.

#### Returns
`RegExp` - The transformed regular expression.

### isValidRegex
#### Description
Checks if a string is a valid regular expression by attempting to create a `RegExp` object with it.

#### Parameters
- `value` (`string`): The value to be checked.
- `flags` (`string`): The flags to be used in the regular expression.

#### Returns
`boolean` - `true` if the string is a valid regular expression, `false` otherwise.

### isValidRegexFlags
#### Description
Checks if a string is a valid set of regular expression flags.

#### Parameters
- `value` (`string`): The value to be checked.

#### Returns
`boolean` - `true` if the string is a valid set of regular expression flags, `false` otherwise.

### interpretZodError
#### Description
Given a zod error, interprets it to `null` if no error is found, a single error message if there is a single error, or an array of error messages if there are multiple errors.

#### Parameters
- `e` (`ZodError`): The zod error to be interpreted.

#### Returns
`string | string[] | null` - The interpreted error message(s).

### zodValidate<O>
#### Description
This is a simple function that takes a zod schema, returning a function that takes a value. If the value matches, the function returns `true`. Otherwise, it returns `false`. `O` refers to the output type of the zod schema, which should be the same as its input type.

#### Parameters
- `p` (`ZodSchema<O>`): The zod schema to be used for validation.

#### Returns
`ZodValidator<O>` - A function that takes a value and returns `true` if the value matches the schema, `false` otherwise.

### zodValidateWithErrors<O>
#### Description
This is a simple function that takes a zod schema, returning a function that takes a value. If the value matches, the function returns `true`. Otherwise, it returns the result of `interpretZodError` on the error. `O` refers to the output type of the zod schema, which should be the same as its input type.

#### Parameters
- `p` (`ZodSchema<O>`): The zod schema to be used for validation.

#### Returns
`ZodValidatorWithErrors<O>` - A function that takes a value and returns `true` if the value matches the schema, an error message if there is a single error, or an array of error messages if there are multiple errors.

### isAlphanumeric
#### Description
Uses `zodValidate` to check if a string is alphanumeric, that is, if it only contains letters, numbers, dashes, and underscores. Empty strings are not considered alphanumeric.

#### Parameters
- `str` (`string`): The value to be checked.

#### Returns
`boolean` - `true` if the string is alphanumeric, `false` otherwise.

### toAlphanumeric
#### Description
Transforms a string to be alphanumeric by removing accents, separating it by non-alphanumeric segments, and then joining the words with the specified `separator`.

#### Parameters
- `str` (`string`): The value to be transformed.
- `separator` (`string`): The separator to be used between words. Default is `'-'`.

#### Returns
`string` - The transformed string.

### isValidEmail
#### Description
Uses `zodValidate` to check if a string is a valid email address. Note that this is a simple check and may not cover all cases, but it should be good enough for most purposes.

#### Parameters
- `value` (`string`): The value to be checked.

#### Returns
`boolean` - `true` if the string is a valid email address, `false` otherwise.

### isValidPhoneNumber
#### Description
Uses `zodValidate` to check if a string is a valid phone number. Note that this is a simple check and may not cover all cases, but it should be good enough for most purposes.

#### Parameters
- `value` (`string`): The value to be checked.

#### Returns
`boolean` - `true` if the string is a valid phone number, `false` otherwise.

### isValidURL
#### Description
Uses `zodValidate` to check if a string is a valid URL. Note that this is a simple check and may not cover all cases, but it should be good enough for most purposes.

#### Parameters
- `value` (`string`): The value to be checked.

#### Returns
`boolean` - `true` if the string is a valid URL, `false` otherwise.

### isValidSSN
#### Description
Uses `zodValidate` to check if a string is a valid Social Security Number (SSN). Note that this is a simple check and may not cover all cases, but it should be good enough for most purposes.

#### Parameters
- `value` (`string`): The value to be checked.

#### Returns
`boolean` - `true` if the string is a valid SSN, `false` otherwise.

## Schemas
The following schemas are available in the library:

### ZodCoercedBooleanEnum
A zod schema that specifies an enum of strings that can be interpreted as booleans. This is used within `ZodCoercedBoolean` to actually perform the coercion.

### ZodCoercedBoolean
A zod schema that takes in a value accepted by `ZodCoercedBooleanEnum` and coerces it to a boolean. This is useful when you want to accept multiple values that can be interpreted as booleans.

## Peer Dependencies
These should be installed in order to use the library, as npm does not automatically add peer dependencies to your project.
- zod: ^3.23.8

## Commands
The following commands exist in the project:

- `npm run uninstall` - Uninstalls all dependencies for the library
- `npm run reinstall` - Uninstalls and then Reinstalls all dependencies for the library
- `npm run example-uninstall` - Uninstalls all dependencies for the example app
- `npm run example-install` - Installs all dependencies for the example app
- `npm run example-reinstall` - Uninstalls and then Reinstalls all dependencies for the example app
- `npm run example-start` - Starts the example app after building the library
- `npm run build` - Builds the library
- `npm run release` - Publishes the library to npm without changing the version
- `npm run release-patch` - Publishes the library to npm with a patch version bump
- `npm run release-minor` - Publishes the library to npm with a minor version bump
- `npm run release-major` - Publishes the library to npm with a major version bump