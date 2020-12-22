export class TokenType {
    static types: TokenType[] = [
        new TokenType('T_WHITESPACE', /^\s/),

        new TokenType('T_COMMENT', /^#.*/),

        new TokenType('T_LPAREN', /^\(/),
        new TokenType('T_RPAREN', /^\)/),
        new TokenType('T_ASSIGN', /^=/),
        new TokenType('T_MINUS', /^-/),
        new TokenType('T_PLUS', /^\+/),

        new TokenType('T_STRINGCONSTANT', /^".*"/),
        new TokenType('T_INTCONSTANT', /^[0-9]+/),

        new TokenType('T_ID', /^[A-z]+/),
    ];

    constructor(public name: string, private regex: RegExp) {}

    match(str: string): RegExpMatchArray | null {
        return str.match(this.regex);
    }

    toString(): string {
        return this.name;
    }
}
