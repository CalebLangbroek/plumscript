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

        this.expectToken(identifier, SyntaxError.EXPECT_ID, TokenType.T_ID);

        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_ASSIGN,
            TokenType.T_ASSIGN
        );

        const declaration = new Declaration(
            new TypeSpecifier(typeSpecifier),
            new Identifier(identifier),
            this.parseExpression(typeSpecifier)
        );

        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_NEWLINE,
            TokenType.T_NEWLINE
        );

        return declaration;
    }

    private parseExpression(typeSpecifier: Token): Expression {
        switch (typeSpecifier.type) {
            case TokenType.T_INTTYPE: {
                return this.parseArithmeticExpression();
            }
            case TokenType.T_STRINGTYPE: {
                return this.parseStringExpression();
            }
            case TokenType.T_BOOLTYPE: {
                return this.parseBooleanExpression();
            }
            default: {
                // Should never reach here
                throw new SyntaxError(typeSpecifier.line, SyntaxError.UNKN_ERR);
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
        const nextOperation = this.parsePrimaryArithmeticExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [
            TokenType.T_MULT,
            TokenType.T_DIV,
        ]);
    }

    private parsePrimaryArithmeticExpression(): Expression {
        const token = this.getNextToken();

        switch (token.type) {
            case TokenType.T_INTCONSTANT: {
                return new Literal(token);
            }
            case TokenType.T_ID: {
                return new Identifier(token);
            }
            case TokenType.T_LPAREN: {
                const expr = this.parseAdditionExpression();
                this.expectToken(
                    this.getNextToken(),
                    SyntaxError.EXPECT_CLOSING_PAREN,
                    TokenType.T_RPAREN
                );
                return expr;
            }
            default: {
                throw new SyntaxError(token.line, SyntaxError.INVALID_EXPR);
            }
        }
    }

    private parseStringExpression(): Expression {
        const nextOperation = this.parsePrimaryStringExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [TokenType.T_PLUS]);
    }

    private parsePrimaryStringExpression(): Expression {
        const token = this.getNextToken();

        switch (token.type) {
            case TokenType.T_STRINGCONSTANT: {
                return new Literal(token);
            }
            case TokenType.T_ID: {
                return new Identifier(token);
            }
            case TokenType.T_LPAREN: {
                const expr = this.parseStringExpression();
                this.expectToken(
                    this.getNextToken(),
                    SyntaxError.EXPECT_CLOSING_PAREN,
                    TokenType.T_RPAREN
                );
                return expr;
            }
            default: {
                throw new SyntaxError(token.line, SyntaxError.INVALID_EXPR);
            }
        }
    }

    private parseBooleanExpression(): Expression {
        const nextOperation = this.parsePrimaryBooleanExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [TokenType.T_OR]);
    }

    private parsePrimaryBooleanExpression(): Expression {
        const token = this.getNextToken();

        switch (token.type) {
            case TokenType.T_BOOLTYPE: {
                return new Literal(token);
            }
            case TokenType.T_ID: {
                return new Identifier(token);
            }
            case TokenType.T_LPAREN: {
                const expr = this.parseBooleanExpression();
                this.expectToken(
                    this.getNextToken(),
                    SyntaxError.EXPECT_CLOSING_PAREN,
                    TokenType.T_RPAREN
                );
                return expr;
            }
            default: {
                throw new SyntaxError(token.line, SyntaxError.INVALID_EXPR);
            }
        }
    }

    private parseBinaryExpression(
        next: (...args: any[]) => Expression,
        operatorTypes: TokenType[]
    ): Expression {
        let expr = next();

        while (this.checkTypes(this.peekNextToken(), ...operatorTypes)) {
            const operator = this.getNextToken();
            const right = next();
            expr = new Binary(expr, operator, right);
        }

        return expr;
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

    private expectToken(token: Token, errMsg: string, ...types: TokenType[]) {
        if (!this.checkTypes(token, ...types)) {
            throw new SyntaxError(token.line, errMsg);
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
