import { SyntaxError } from './errors/syntax-error';
import { Token } from './token';
import { TokenType } from './token-type';

export class Scanner {
    private line: number = 1;
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

        for (const type of TokenType.TYPES) {
            const match = type.match(str);
            if (match) {
                this.currentIndex += match[0].length;
                token = new Token(type, match[0].replaceAll("\"", ""), this.line);
                break;
            }
        }

        if (TokenType.T_NEWLINE.match(str)) {
            this.line++;
        }

        if (!token) {
            throw new SyntaxError(
                this.line,
                SyntaxError.UNKN_CHAR,
                str.substring(0, str.indexOf(' '))
            );
        } else if (token.type !== TokenType.T_WHITESPACE) {
            this.tokens.push(token);
        }
    }
}
