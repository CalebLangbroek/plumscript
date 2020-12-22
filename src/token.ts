import { TokenType } from './token-type';

export class Token {
    constructor(
        public type: TokenType,
        public literal: string,
        public line: number
    ) {}

    toString(): string {
        return `${this.type}: ${this.getEscapedLiteral()}`;
    }

    private getEscapedLiteral(): string {
        return this.literal.replace('\n', '\\n');
    }
}
