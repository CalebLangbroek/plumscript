export class SyntaxError extends Error {
    static readonly EXPECT_ASSIGN = "EXPECTED A '='";
    static readonly EXPECT_CLOSING_PAREN = "EXPECTED A CLOSING PARENTHESES";
    static readonly EXPECT_CURLY_BRACKET = "EXPECTED A CURLY BRACKET";
    static readonly EXPECT_ID = "EXPECTED AN IDENTIFIER";
    static readonly EXPECT_NEWLINE = "EXPECTED A NEW LINE";
    static readonly EXPECT_TYPE = "EXPECTED A TYPE SPECIFIER";
    static readonly INVALID_EXPR = "INVALID EXPRESSION";
    static readonly INVALID_STMT = "INVALID STATEMENT";
    static readonly UNEX_CHAR = "UNEXPECTED CHARACTER";
    static readonly UNKN_CHAR = "UNKNOWN CHARACTER";
    static readonly UNKN_ERR = "UNKNOWN ERROR";

    constructor(line: number, ...message: string[]) {
        super(`${message.join(' ')} AT LINE ${line}`);
    }
}
