export class RuntimeError extends Error {
    static readonly DEC_FUN = "FUNCTION ALREADY DECLARED";
    static readonly DEC_VAR = "VARIABLE ALREADY DECLARED";
    static readonly EXPECT_BOOL = "EXPECTED A BOOLEAN VALUE";
    static readonly EXPECT_INT = "EXPECTED A INTEGER VALUE";
    static readonly EXPECT_RETURN = "EXPECTED A RETURN VALUE";
    static readonly EXPECT_STR = "EXPECTED A STRING VALUE";
    static readonly INVALID_EXPR = "INVALID EXPRESSION";
    static readonly INVALID_ARGS = "INVALID NUMBER OF ARGS";
    static readonly INVALID_STMT = "INVALID STATEMENT";
    static readonly INVALID_VAR_TYPE = "INVALID VARIABLE TYPE";
    static readonly UNDEC_FUN = "UNDECLARED FUNCTION";
    static readonly UNDEC_VAR = "UNDECLARED VARIABLE";
    static readonly UNKN_ERR = "UNKNOWN ERROR";

    constructor(line: number, ...message: string[]) {
        super(`${message.join(' ')} AT LINE ${line}`);
    }
}
