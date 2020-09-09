import { SyntaxError } from './errors/syntax-error';
import { TokenType } from './token-type';

export namespace TokenUtils {
    export function tokenize(str: string): Token {
        for (const key in TokenType.types) {
            const type = TokenType.types[key];
            if (type.match(str)) {
                return type.tokenize(str);
            }
        }
        throw new SyntaxError(`Invalid Syntax: ${str}`);
    }
}

export class Token {
    name: string = '';
    value: Token | number | string = '';
    params: Token[] = [];

    constructor(public type: TokenType.TokenType) {}
}
