export class SyntaxError extends Error {
    static readonly EXPECT_ASSIGN = "EXPECTED A '='";
    static readonly EXPECT_CLOSING_PAREN = "EXPECTED A CLOSING PARENTHESES";
    static readonly EXPECT_ID = "EXPECTED AN IDENTIFIER";
    static readonly EXPECT_NEWLINE = "EXPECTED A NEW LINE";
    static readonly INVALID_EXPR = "INVALID EXPRESSION"
    static readonly UNKN_CHAR = "UNKNOWN CHARACTER";
    static readonly UNKN_ERR = "UNKNOWN ERROR";

    constructor(line: number, ...message: string[]) {
        super(`${message.join(' ')} AT LINE ${line}`);
    }
}
