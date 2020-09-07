import { SyntaxError } from './errors/syntax-error';
import { TokenType } from './token-type';

export type TokenType =
    | TokenType.VariableAssignment
    | TokenType.Variable
    | TokenType.FunctionCall;

export class Token {
    static tokenize(str: string): Token {
        for (const key in TokenType.types) {
            const type = TokenType.types[key];
            if (type.match(str)) {
                return type.tokenize(str);
            }
        }
        throw new SyntaxError(`Invalid Syntax: ${str}`);
    }

    name: string = '';
    value: Token | number | string = '';
    params: Token[] = [];

    constructor(public type: TokenType) {}
}
