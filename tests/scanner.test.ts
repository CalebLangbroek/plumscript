import { SyntaxError } from '../src/errors/syntax-error';
import { Scanner } from '../src/scanner';
import { Token } from '../src/token';
import { TokenType } from '../src/token-type';

describe('scanner', () => {
    it('return tokens from scanning string', () => {
        const scanner = new Scanner(`
            str helloWorld = "Hello World!"
    
            print(helloWorld)
        `);
        const result = scanner.scan();

        expect(result).toEqual(
            expect.arrayContaining([
                new Token(TokenType.T_NEWLINE, '\n', 1),
                new Token(TokenType.T_STRINGTYPE, 'str', 2),
                new Token(TokenType.T_ID, 'helloWorld', 2),
                new Token(TokenType.T_ASSIGN, '=', 2),
                new Token(TokenType.T_STRINGCONSTANT, 'Hello World!', 2),
                new Token(TokenType.T_NEWLINE, '\n', 2),
                new Token(TokenType.T_NEWLINE, '\n', 3),
                new Token(TokenType.T_ID, 'print', 4),
                new Token(TokenType.T_LPAREN, '(', 4),
                new Token(TokenType.T_ID, 'helloWorld', 4),
                new Token(TokenType.T_RPAREN, ')', 4),
                new Token(TokenType.T_NEWLINE, '\n', 4),
            ])
        );
    });

    it('throws on unknown character', () => {
        const scanner = new Scanner(`
            int str a = "Not a valid character";
        `);

        expect(scanner.scan.bind(scanner)).toThrowError(SyntaxError.UNKN_CHAR);
    });
});
