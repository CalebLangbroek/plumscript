export class SyntaxError extends Error {
    static readonly EXPECT_ID = "EXPECTED AN IDENTIFIER";
    static readonly EXPECT_ASSIGN = "EXPECTED AN '='";
    static readonly UNKN_CHAR = "UNKNOWN CHARACTER"

    constructor(line: number, ...message: string[]) {
        super(`${message.join(' ')} AT LINE ${line}`);
    }
}
