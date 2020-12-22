import { Constants } from './constants/constants';
import { SyntaxError } from './errors/syntax-error';
import { Token } from './token';
import { TokenType } from './token-type';

export class Scanner {
    private line: number = 0;
    private tokens: Token[] = [];
    private currentIndex: number = 0;

    constructor(private source: string) {}

    scan(): Token[] {
        while (this.currentIndex != this.source.length) {
            this.scanString();
        }
        return this.tokens;
    }

    private scanString(): void {
        const str = this.source.substring(this.currentIndex);
        let token = null;

        for (const type of TokenType.types) {
            const match = type.match(str);
            if (match) {
                this.currentIndex += match[0].length;
                token = new Token(type, match[0], this.line);
                break;
            }
        }

        if (str.match(/^\n/)) {
            this.line++;
        }

        if (token) {
            this.tokens.push(token);
        } else {
            throw new SyntaxError(
                this.line,
                Constants.UNKN_CHAR_ERR,
                str.substring(0, str.indexOf(' '))
            );
        }
    }
}
