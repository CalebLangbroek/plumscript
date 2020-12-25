export class TokenType {
    static readonly TYPES: TokenType[] = [];

    static readonly T_NEWLINE: TokenType = new TokenType('T_NEWLINE', /^\n/);
    static readonly T_WHITESPACE: TokenType = new TokenType('T_WHITESPACE', /^\s/);

    static readonly T_COMMENT: TokenType = new TokenType('T_COMMENT', /^#.*/);

    static readonly T_BOOLTYPE: TokenType = new TokenType('T_BOOLTYPE', /^bool\s/);
    static readonly T_ELSE: TokenType = new TokenType('T_ELSE', /^else/);
    static readonly T_FALSE: TokenType = new TokenType('T_FALSE', /^false/);
    static readonly T_FOR: TokenType = new TokenType('T_FOR', /^for/);
    static readonly T_FUN: TokenType = new TokenType('T_FUN', /^fun\s/);
    static readonly T_IF: TokenType = new TokenType('T_IF', /^if/);
    static readonly T_INTTYPE: TokenType = new TokenType('T_INTTYPE', /^int\s/);
    static readonly T_NULL: TokenType = new TokenType('T_NULL', /^null/);
    static readonly T_RETURN: TokenType = new TokenType('T_RETURN', /^return\s/);
    static readonly T_STRINGTYPE: TokenType = new TokenType('T_STRINGTYPE', /^str\s/);
    static readonly T_TRUE: TokenType = new TokenType('T_TRUE', /^true/);
    static readonly T_WHILE: TokenType = new TokenType('T_WHILE', /^while/);
    
    static readonly T_AND: TokenType = new TokenType('T_AND', /^&&/);
    static readonly T_ASSIGN: TokenType = new TokenType('T_ASSIGN', /^=/);
    static readonly T_COMMA: TokenType = new TokenType('T_COMMA', /^,/);
    static readonly T_DIV: TokenType = new TokenType('T_DIV', /^\//);
    static readonly T_DOT: TokenType = new TokenType('T_DOT', /^\./);
    static readonly T_EQ: TokenType = new TokenType('T_EQ', /^==/);
    static readonly T_GEQ: TokenType = new TokenType('T_GEQ', /^>=/);
    static readonly T_GT: TokenType = new TokenType('T_GT', /^>/);
    static readonly T_LCB: TokenType = new TokenType('T_LCB', /^\{/);
    static readonly T_LEQ: TokenType = new TokenType('T_LEQ', /^<=/);
    static readonly T_LPAREN: TokenType = new TokenType('T_LPAREN', /^\(/);
    static readonly T_LT: TokenType = new TokenType('T_LT', /^</);
    static readonly T_MINUS: TokenType = new TokenType('T_MINUS', /^-/);
    static readonly T_MOD: TokenType = new TokenType('T_MOD', /^%/);
    static readonly T_MULT: TokenType = new TokenType('T_MULT', /^\*/);
    static readonly T_NEQ: TokenType = new TokenType('T_NEQ', /^!=/);
    static readonly T_NOT: TokenType = new TokenType('T_NOT', /^!/);
    static readonly T_OR: TokenType = new TokenType('T_OR', /^\|\|/);
    static readonly T_PLUS: TokenType = new TokenType('T_PLUS', /^\+/);
    static readonly T_RCB: TokenType = new TokenType('T_RCB', /^\}/);
    static readonly T_RPAREN: TokenType = new TokenType('T_RPAREN', /^\)/);

    static readonly T_STRINGCONSTANT: TokenType = new TokenType('T_STRINGCONSTANT', /^".*"/);
    static readonly T_INTCONSTANT: TokenType = new TokenType('T_INTCONSTANT', /^[0-9]+/);
    
    static readonly T_ID: TokenType = new TokenType('T_ID', /^[A-z]+/);

    constructor(public name: string, private regex: RegExp) {
        TokenType.TYPES.push(this);
    }

    match(str: string): RegExpMatchArray | null {
        return str.match(this.regex);
    }

    toString(): string {
        return this.name;
    }
}
