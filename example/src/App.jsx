import { useState } from "react";
import {
    escapeRegex, removeAccents, transformRegex, isValidRegex, isValidRegexFlags, isAlphanumeric, toAlphanumeric,
    isValidEmail, isValidPhoneNumber, isValidURL, isValidSSN, zodValidate
} from "@ptolemy2002/regex-utils";
import { z } from "zod";

window.testValidation = (v) => {
    return zodValidate(
        z.object(
            {
                required: z.any().refine((v) => v !== undefined, {message: "required is missing"}),

                string: z.string({message: "invalid string"}).optional(),
                number: z.number({message: "invalid number"}).optional(),
                boolean: z.boolean({message: "invalid boolean"}).optional(),
                date: z.date({message: "invalid date"}).optional(),
                array: z.string({message: "invalid array item"}).array().optional(),
                object: z.object({}, {message: "invalid object"}).optional(),
                union: z.union([z.string(), z.number()], {message: "invalid union"}).optional()
            },
            {message: "invalid value type"}
        )
    )(v);
}

function App() {
    const [text, setText] = useState("");
    const [regex, setRegex] = useState("");
    const [regexError, setRegexError] = useState(null);
    const [accentInsensitive, setAccentInsensitive] = useState(false);
    const [caseInsensitive, setCaseInsensitive] = useState(false);
    const [matchWhole, setMatchWhole] = useState(false);
    const [flags, setFlags] = useState("");

    function handleRegexChange(e) {
        if (!isValidRegex(e.target.value)) {
            setRegexError("Invalid regex");
        } else {
            setRegexError(null);
            setRegex(e.target.value);
        }
    }

    function handleFlagsChange(e) {
        if (!isValidRegexFlags(e.target.value)) {
            setRegexError("Invalid flags");
        } else {
            setRegexError(null);
            setFlags(e.target.value);
        }
    }

    return (
        <div className="App p-3">
            <p>
                Use window.testValidation to test the zodValidate function.
            </p>

            <label>Text: </label>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <p>
                Escaped: {escapeRegex(text).source} <br />
                Accents Removed: {removeAccents(text)} <br />
                Is Alphanumeric: {isAlphanumeric(text).toString()} <br />
                To Alphanumeric: {toAlphanumeric(text)} <br />
                Is Email: {isValidEmail(text).toString()} <br />
                Is Phone Number: {isValidPhoneNumber(text).toString()} <br />
                Is URL: {isValidURL(text).toString()} <br />
                Is SSN: {isValidSSN(text).toString()}
            </p>

            <label>Regex: </label>
            <input
                type="text"
                defaultValue={regex}
                onChange={handleRegexChange}
            /> <br />

            <label>Flags: </label>
            <input
                type="text"
                defaultValue={flags}
                onChange={handleFlagsChange}
            /> <br />

            <label>Acent Insensitive: </label>
            <input
                type="checkbox"
                checked={accentInsensitive}
                onChange={(e) => setAccentInsensitive(e.target.checked)}
            /> <br />

            <label>Case Insensitive: </label>
            <input
                type="checkbox"
                checked={caseInsensitive}
                onChange={(e) => setCaseInsensitive(e.target.checked)}
            /> <br />

            <label>Match Whole: </label>
            <input
                type="checkbox"
                checked={matchWhole}
                onChange={(e) => setMatchWhole(e.target.checked)}
            />

            {regexError && <p className="text-danger">{regexError}</p>}

            {
                !regexError && <p>
                    Matches: {transformRegex(regex, {flags, accentInsensitive, caseInsensitive, matchWhole}).test(text).toString()}
                </p>
            }
        </div>
    );
}

export default App;
