export class TokenType {
    static types: TokenType[] = [
        new TokenType('T_WHITESPACE', /^\s/),

        new TokenType('T_COMMENT', /^#.*/),

        new TokenType('T_BOOLTYPE', /^bool/),
        new TokenType('T_ELSE', /^else/),
        new TokenType('T_FALSE', /^false/),
        new TokenType('T_FOR', /^for/),
        new TokenType('T_FUN', /^fun/),
        new TokenType('T_IF', /^if/),
        new TokenType('T_INTTYPE', /^int/),
        new TokenType('T_NULL', /^null/),
        new TokenType('T_RETURN', /^return/),
        new TokenType('T_STRINGTYPE', /^string/),
        new TokenType('T_TRUE', /^true/),
        new TokenType('T_WHILE', /^while/),

        new TokenType('T_AND', /^&&/),
        new TokenType('T_ASSIGN', /^=/),
        new TokenType('T_COMMA', /^,/),
        new TokenType('T_DIV', /^\//),
        new TokenType('T_DOT', /^\./),
        new TokenType('T_EQ', /^==/),
        new TokenType('T_GEQ', /^>=/),
        new TokenType('T_GT', /^>/),
        new TokenType('T_LCB', /^\{/),
        new TokenType('T_LEQ', /^<=/),
        new TokenType('T_LPAREN', /^\(/),
        new TokenType('T_LT', /^</),
        new TokenType('T_MINUS', /^-/),
        new TokenType('T_MOD', /^%/),
        new TokenType('T_MULT', /^\*/),
        new TokenType('T_NEQ', /^!=/),
        new TokenType('T_NOT', /^!/),
        new TokenType('T_OR', /^\|\|/),
        new TokenType('T_PLUS', /^\+/),
        new TokenType('T_RCB', /^\}/),
        new TokenType('T_RPAREN', /^\)/),

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
