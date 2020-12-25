import { Token } from './token';
import {
    ASTNode,
    Binary,
    Declaration,
    Expression,
    Identifier,
    Literal,
    TypeSpecifier,
} from './ast-node';
import { TokenType } from './token-type';
import { SyntaxError } from './errors/syntax-error';

export class Parser {
    private currentIndex: number = 0;

    constructor(private tokens: Token[]) {}

    parse(): ASTNode[] {
        const nodes: ASTNode[] = [];

        while (!this.isAtEnd()) {
            const node = this.getNextNode();
            if (node) {
                nodes.push(node);
            }
        }

        return nodes;
    }

    private getNextNode(): ASTNode | null {
        this.ignoreTokens(
            TokenType.T_NEWLINE,
            TokenType.T_WHITESPACE,
            TokenType.T_COMMENT
        );

        if (this.isAtEnd()) {
            return null;
        }

        const currentToken = this.getNextToken();

        switch (currentToken.type) {
            case TokenType.T_INTTYPE:
            case TokenType.T_STRINGTYPE:
            case TokenType.T_BOOLTYPE: {
                return this.finishDeclaration(currentToken);
            }
            default: {
                throw new SyntaxError(currentToken.line, '');
            }
        }
    }

    private finishDeclaration(typeSpecifier: Token): Declaration {
        const identifier = this.getNextToken();

        if (!this.checkTypes(identifier, TokenType.T_ID)) {
            throw new SyntaxError(identifier.line, SyntaxError.EXPECT_ID);
        }

        this.ignoreTokens(TokenType.T_WHITESPACE);

        if (!this.checkTypes(this.getNextToken(), TokenType.T_ASSIGN)) {
            throw new SyntaxError(identifier.line, SyntaxError.EXPECT_ASSIGN);
        }

        this.ignoreTokens(TokenType.T_WHITESPACE);

        return new Declaration(
            new TypeSpecifier(typeSpecifier),
            new Identifier(identifier),
            this.finishExpression()
        );
    }

    private finishExpression(): Expression {
        return new Literal(this.getNextToken());
    }

    private checkTypes(token: Token, ...types: TokenType[]) {
        for (const type of types) {
            if (token.type === type) {
                return true;
            }
        }
        return false;
    }

    private ignoreTokens(...types: TokenType[]): void {
        while (
            !this.isAtEnd() &&
            this.checkTypes(this.peekNextToken(), ...types)
        ) {
            this.currentIndex++;
        }
    }

    private peekNextToken(): Token {
        return this.tokens[this.currentIndex];
    }

    private getNextToken(): Token {
        return this.tokens[this.currentIndex++];
    }

    private getPreviousToken(): Token {
        return this.tokens[this.currentIndex--];
    }

    private isAtEnd(): boolean {
        return this.currentIndex == this.tokens.length;
    }
}
