import { Token } from './token';
import {
    Assignment,
    ASTNode,
    Binary,
    Conditional,
    Declaration,
    Expression,
    FunctionCall,
    FunctionDeclaration,
    Identifier,
    Literal,
    ReturnStatement,
    Statement,
    TypeSpecifier,
    WhileStatement,
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
                return this.parseFunctionDeclaration();
            }
            case TokenType.T_ID: {
                return this.parseAssignmentOrFunctionCall(currentToken);
            }
            case TokenType.T_RETURN: {
                return this.parseReturn();
            }
            case TokenType.T_IF: {
                return this.parseConditional();
            }
            case TokenType.T_WHILE: {
                return this.parseWhile();
            }
            default: {
                throw new SyntaxError(currentToken.line, SyntaxError.UNEX_CHAR);
            }
        }
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        const identifier = this.getNextToken();

        this.expectToken(identifier, SyntaxError.EXPECT_ID, TokenType.T_ID);

        // Consume the L Paren
        this.getNextToken();

        const params: Identifier[] = [];

        while (!this.checkTypes(this.peekNextToken(), TokenType.T_RPAREN)) {
            const typeSpecifier = this.getNextToken();

            this.expectToken(
                typeSpecifier,
                SyntaxError.EXPECT_TYPE,
                TokenType.T_INTTYPE,
                TokenType.T_STRINGTYPE,
                TokenType.T_BOOLTYPE
            );

            const paramID = this.getNextToken();

            this.expectToken(paramID, SyntaxError.EXPECT_ID, TokenType.T_ID);

            // TODO: Add type checking for function parameters
            params.push(new Identifier(paramID));

            if (!this.checkTypes(this.peekNextToken(), TokenType.T_COMMA)) {
                break;
            } else {
                // Consume the comma
                this.getNextToken();
            }
        }

        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_CLOSING_PAREN,
            TokenType.T_RPAREN
        );

        return new FunctionDeclaration(
            new Identifier(identifier),
            params,
            this.parseBlockStatement()
        );
    }

    private parseReturn(): ReturnStatement {
        return this.checkTypes(this.peekNextToken(), TokenType.T_NEWLINE)
            ? new ReturnStatement()
            : new ReturnStatement(this.parseExpression());
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
            this.parseExpression()
        );

        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_NEWLINE,
            TokenType.T_NEWLINE
        );

        return declaration;
    }

    private parseConditional(): Conditional {
        const condition = this.parseExpression();

        const block = this.parseBlockStatement();

        if (this.checkTypes(this.peekNextToken(), TokenType.T_ELSE)) {
            // Consume Else token
            this.getNextToken();

            let next: Conditional | Statement[];

            if (this.checkTypes(this.peekNextToken(), TokenType.T_IF)) {
                // Consume If token
                this.getNextToken();
                next = this.parseConditional();
            } else {
                next = this.parseBlockStatement();
            }

            return new Conditional(condition, block, next);
        }

        return new Conditional(condition, block);
    }

    private parseWhile(): WhileStatement {
        return new WhileStatement(
            this.parseExpression(),
            this.parseBlockStatement()
        );
    }

    private parseBlockStatement(): Statement[] {
        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_OPENING_BRACE,
            TokenType.T_LCB
        );

        this.ignoreTokens(
            TokenType.T_NEWLINE,
            TokenType.T_WHITESPACE,
            TokenType.T_COMMENT
        );

        const statements: Statement[] = [];

        while (
            !this.isAtEnd() &&
            !this.checkTypes(this.peekNextToken(), TokenType.T_RCB)
        ) {
            const statement = this.getNextNode();
            if (statement) {
                statements.push(statement);
            }

            this.ignoreTokens(
                TokenType.T_NEWLINE,
                TokenType.T_WHITESPACE,
                TokenType.T_COMMENT
            );
        }

        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_CLOSING_BRACE,
            TokenType.T_RCB
        );

        // TODO consider making a block AST Node class
        return statements;
    }

    private parseExpression(): Expression {
        return this.parseOrExpression();
    }

    private parseOrExpression(): Expression {
        const nextOperation = this.parseAndExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [TokenType.T_OR]);
    }

    private parseAndExpression(): Expression {
        const nextOperation = this.parseEqualityExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [TokenType.T_AND]);
    }

    private parseEqualityExpression(): Expression {
        const nextOperation = this.parseComparisonExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [
            TokenType.T_EQ,
            TokenType.T_NEQ,
        ]);
    }

    private parseComparisonExpression(): Expression {
        const nextOperation = this.parseAdditionExpression.bind(this);
        return this.parseBinaryExpression(nextOperation, [
            TokenType.T_LEQ,
            TokenType.T_GEQ,
            TokenType.T_GT,
            TokenType.T_LT,
        ]);
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
            TokenType.T_MOD,
        ]);
    }

    private parsePrimaryExpression(): Expression {
        const token = this.getNextToken();

        switch (token.type) {
            case TokenType.T_STRINGCONSTANT:
            case TokenType.T_INTCONSTANT:
            case TokenType.T_BOOLCONSTANT:
            case TokenType.T_NULL: {
                return new Literal(token);
            }
            case TokenType.T_ID: {
                return this.parseIdentifierOrFunctionCall(token);
            }
            case TokenType.T_LPAREN: {
                const expr = this.parseExpression();
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

    private parseIdentifierOrFunctionCall(identifier: Token): Expression {
        return this.checkTypes(this.peekNextToken(), TokenType.T_LPAREN)
            ? this.parseFunctionCall(identifier)
            : new Identifier(identifier);
    }

    private parseAssignmentOrFunctionCall(
        identifier: Token
    ): Expression | Statement {
        if (this.checkTypes(this.peekNextToken(), TokenType.T_LPAREN)) {
            return this.parseFunctionCall(identifier);
        }

        this.expectToken(identifier, SyntaxError.EXPECT_ID, TokenType.T_ID);

        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_ASSIGN,
            TokenType.T_ASSIGN
        );

        const assignment = new Assignment(
            new Identifier(identifier),
            this.parseExpression()
        );

        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_NEWLINE,
            TokenType.T_NEWLINE
        );

        return assignment;
    }

    private parseFunctionCall(identifier: Token): Expression {
        // Consume the L Paren
        this.getNextToken();

        const args: Expression[] = [];

        while (!this.checkTypes(this.peekNextToken(), TokenType.T_RPAREN)) {
            args.push(this.parseExpression());

            if (!this.checkTypes(this.peekNextToken(), TokenType.T_COMMA)) {
                break;
            } else {
                // Consume the comma
                this.getNextToken();
            }
        }

        this.expectToken(
            this.getNextToken(),
            SyntaxError.EXPECT_CLOSING_PAREN,
            TokenType.T_RPAREN
        );

        return new FunctionCall(identifier, args);
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
        if (this.isAtEnd() || !token) {
            throw new SyntaxError(
                this.tokens[this.tokens.length - 1].line,
                SyntaxError.UNEX_EOF
            );
        }

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

    private isAtEnd(): boolean {
        return this.currentIndex >= this.tokens.length;
    }
}
