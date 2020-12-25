import { TokenType } from './token-type';

export class Token {
    constructor(
        readonly type: TokenType,
        readonly literal: string,
        readonly line: number
    ) {}

    toString(): string {
        return `${this.type}: ${this.getEscapedLiteral()}`;
    }

    private getEscapedLiteral(): string {
        return this.literal.replace('\n', '\\n');
    }
}
