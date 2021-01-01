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
                return this.parseDeclaration(currentToken);
            }
            case TokenType.T_FUN: {
            }
            default: {
                throw new SyntaxError(currentToken.line, '');
            }
        }
    }

    private parseDeclaration(typeSpecifier: Token): Declaration {
        const identifier = this.getNextToken();

        if (!this.checkTypes(identifier, TokenType.T_ID)) {
            throw new SyntaxError(identifier.line, SyntaxError.EXPECT_ID);
        }

        if (!this.checkTypes(this.getNextToken(), TokenType.T_ASSIGN)) {
            throw new SyntaxError(identifier.line, SyntaxError.EXPECT_ASSIGN);
        }

        return new Declaration(
            new TypeSpecifier(typeSpecifier),
            new Identifier(identifier),
            this.parseExpression(typeSpecifier)
        );
    }

    private parseExpression(typeSpecifier: Token): Expression {
        switch (typeSpecifier.type) {
            case TokenType.T_INTTYPE: {
                return this.parseArithmeticExpression();
            }
            case TokenType.T_STRINGTYPE: {
                return this.parseArithmeticExpression();
            }
            default: {
                // Should never reach here
                throw new SyntaxError(typeSpecifier.line, '');
            }
        }
    }

    private parseArithmeticExpression(): Expression {
        return this.parseAdditionExpression();
    }

    private parseAdditionExpression(): Expression {
        const nextOperation = this.parseMultiplicationExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [
            TokenType.T_PLUS,
            TokenType.T_MINUS,
        ]);
    }

    private parseMultiplicationExpression(): Expression {
        const nextOperation = this.parsePrimaryExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [
            TokenType.T_MULT,
            TokenType.T_DIV,
        ]);
    }

    private parsePrimaryExpression(): Expression {
        const token = this.getNextToken();

        switch (token.type) {
            case TokenType.T_STRINGCONSTANT:
            case TokenType.T_INTCONSTANT: {
                return new Literal(token);
            }
            case TokenType.T_ID: {
                return new Identifier(token);
            }
            default: {
                throw new SyntaxError(token.line, '');
            }
        }
    }

    private parseBinaryExpression(
        next: (...args: any[]) => Expression,
        operators: TokenType[]
    ): Expression {
        const left = next();

        for (const operator of operators) {
            if (this.peekNextToken().type === operator) {
                const right = next();
                return new Binary(left, this.getNextToken(), right);
            }
        }

        return left;
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
