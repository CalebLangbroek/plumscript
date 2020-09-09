import { Token, TokenUtils } from './token';
import { Utils } from './utils/utils';

export namespace TokenType {
    export abstract class TokenType {
        abstract match(str: string): boolean;
        tokenize(str: string): Token {
            return new Token(this);
        }
    }

    export class Variable extends TokenType {
        match(str: string): boolean {
            return /^[A-Za-z]+$/.test(str);
        }
        tokenize(str: string): Token {
            const token = super.tokenize(str);
            token.name = str;
            return token;
        }
    }

    export class VariableAssignment extends TokenType {
        match(str: string): boolean {
            return /^var/.test(str);
        }
        tokenize(str: string): Token {
            const token = super.tokenize(str);
            const split: string[] = Utils.splitWithFilter(str, /\s/);

            if (
                split.length < 4 ||
                !/^[a-z]+$/i.exec(split[1]) ||
                '=' !== split[2]
            ) {
                throw new SyntaxError(
                    'Invalid variable declaration: variable needs a name, assignment, and value'
                );
            }

            token.name = split[1];
            token.value = TokenUtils.tokenize(split.slice(3).join(' '));

            return token;
        }
    }

    export class FunctionAssignment extends TokenType {
        match(str: string): boolean {
            return /^fun/.test(str);
        }
        tokenize(str: string): Token {
            const token = super.tokenize(str);
            token.name = str;
            return token;
        }
    }

    export class FunctionCall extends TokenType {
        match(str: string): boolean {
            return /^[a-z]+\(.*\)$/i.test(str);
        }
        tokenize(str: string): Token {
            const token = super.tokenize(str);
            token.name = str.slice(0, str.indexOf('('));

            const params = str.slice(str.indexOf('(') + 1, str.indexOf(')'));

            if (params) {
                for (let param of params.split(',')) {
                    param = param.trim();
                    if (param.length < 1) continue;
                    token.params.push(TokenUtils.tokenize(param));
                }
            }

            return token;
        }
    }

    export class Literal extends TokenType {
        match(str: string): boolean {
            return /^(\d+|\"([^\"])*\")$/i.test(str);
        }
        tokenize(str: string): Token {
            const token = super.tokenize(str);
            if (!isNaN(Number(str))) {
                token.value = Number(str);
            } else {
                token.value = str;
            }

            return token;
        }
    }

    export class Expression extends TokenType {
        match(str: string): boolean {
            return /[^\=]+/.test(str);
        }
        tokenize(str: string): Token {
            const token = super.tokenize(str);
            Utils.splitWithFilter(str, /\s/).forEach((el) =>
                token.params.push(TokenUtils.tokenize(el))
            );

            return token;
        }
    }

    export class Operator extends TokenType {
        match(str: string): boolean {
            return /^\+$/.test(str);
        }
        tokenize(str: string): Token {
            const token = super.tokenize(str);
            token.value = str;
            return token;
        }
    }

    export const types: { [s: string]: TokenType } = {
        VariableAssignment: new VariableAssignment(),
        Variable: new Variable(),
        FunctionCall: new FunctionCall(),
        Literal: new Literal(),
    };
}
