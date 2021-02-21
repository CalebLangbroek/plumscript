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
                token = new Token(
                    type,
                    this.replaceAll(match[0], '"', ''),
                    this.line
                );
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

    private replaceAll(
        source: string,
        search: string,
        replace: string
    ): string {
        let index = source.indexOf(search);

        while (index !== -1) {
            source = source.replace(search, replace);
            index = source.indexOf(search, index + replace.length);
        }

        return source;
    }
}
