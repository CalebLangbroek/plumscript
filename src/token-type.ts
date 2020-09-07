import { Token } from './token';

export namespace TokenType {
    abstract class TokenType {
        abstract match(str: string): boolean;
        tokenize(str: string): Token {
            return new Token(this);
        }
    }

    export class Variable extends TokenType {
        match(str: string): boolean {
            return /^[A-Za-z]+$/.test(str);
        }
    }

    export class VariableAssignment extends TokenType {
        match(str: string): boolean {
            return /^var/.test(str);
        }
    }

    export class FunctionAssignment extends TokenType {
        match(str: string): boolean {
            return /^fun/.test(str);
        }
    }

    export class FunctionCall extends TokenType {
        match(str: string): boolean {
            return /^[a-z]+\(.*\)$/i.test(str);
        }
    }

    export class Literal extends TokenType {
        match(str: string): boolean {
            return /^(\d+|\"([^\"])*\")$/i.test(str);
        }
    }

    export class Expression extends TokenType {
        match(str: string): boolean {
            return /[^\=]+/.test(str);
        }
    }

    export class Operator extends TokenType {
        match(str: string): boolean {
            return /^\+$/.test(str);
        }
    }

    export const types: { [s: string]: TokenType } = {
        VariableAssignment: new VariableAssignment(),
        Variable: new Variable(),
        FunctionCall: new FunctionCall(),
    };
}
