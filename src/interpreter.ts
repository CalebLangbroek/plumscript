import {
    Assignment,
    ASTNode,
    Binary,
    Conditional,
    FunctionCall,
    FunctionDeclaration,
    Identifier,
    Literal,
    ReturnStatement,
    Statement,
    VariableDeclaration,
    WhileStatement,
} from './ast-node';
import { ASTNodeType } from './ast-node-type';
import { RuntimeError } from './errors/runtime-error';
import { MemoryScope } from './memory-scope';
import { NativeFunction } from './native-function';
import { Token } from './token';
import { TokenType } from './token-type';

export class Interpreter {
    private currentIndex: number = 0;

    private memory: MemoryScope = new MemoryScope();

    constructor(private nodes: ASTNode[]) {}

    interpret(): void {
        while (!this.isAtEnd()) {
            this.interpretStatement(this.getNextNode());
        }
    }

    interpretStatement(statement: ASTNode): Literal | undefined {
        switch (statement.type) {
            case ASTNodeType.N_VARIABLEDECLARATION: {
                this.interpretVariableDeclaration(
                    statement as VariableDeclaration
                );
                break;
            }
            case ASTNodeType.N_ASSIGNMENT: {
                this.interpretVariableAssignment(statement as Assignment);
                break;
            }
            case ASTNodeType.N_FUNCTIONDECLARATION: {
                this.interpretFunctionDeclaration(
                    statement as FunctionDeclaration
                );
                break;
            }
            case ASTNodeType.N_CONDITIONAL: {
                return this.interpretConditional(statement as Conditional);
            }
            case ASTNodeType.N_WHILE: {
                return this.interpretWhile(statement as WhileStatement);
            }
            case ASTNodeType.N_FUNCTIONCALL: {
                // All though technically not a statement, treat function call like one
                // Can be treated as expression or statement
                return this.interpretFunctionCall(statement as FunctionCall);
            }
            default: {
                throw new RuntimeError(-1, RuntimeError.INVALID_STMT);
            }
        }
    }

    interpretVariableDeclaration(declaration: VariableDeclaration): void {
        if (this.memory.hasVariable(declaration.id)) {
            throw new RuntimeError(
                declaration.id.id.line,
                RuntimeError.DEC_VAR
            );
        }

        const literal = this.interpretExpression(declaration.expr);

        if (
            (declaration.variableType.token.type == TokenType.T_BOOLTYPE &&
                literal.token.type != TokenType.T_BOOLCONSTANT) ||
            (declaration.variableType.token.type == TokenType.T_INTTYPE &&
                literal.token.type != TokenType.T_INTCONSTANT) ||
            (declaration.variableType.token.type == TokenType.T_STRINGTYPE &&
                literal.token.type != TokenType.T_STRINGCONSTANT)
        ) {
            throw new RuntimeError(
                declaration.id.id.line,
                RuntimeError.INVALID_VAR_TYPE
            );
        }

        this.memory.setVariable(declaration.id, literal);
    }

    interpretVariableAssignment(assignment: Assignment): void {
        if (!this.memory.hasVariable(assignment.id)) {
            throw new RuntimeError(
                assignment.id.id.line,
                RuntimeError.UNDEC_VAR
            );
        }

        // TODO add type checking for assignment
        this.memory.setVariable(
            assignment.id,
            this.interpretExpression(assignment.expr)
        );
    }

    interpretFunctionDeclaration(declaration: FunctionDeclaration): void {
        if (
            this.memory.hasFunction(declaration.id) ||
            NativeFunction.hasNativeFunction(declaration.id)
        ) {
            throw new RuntimeError(
                declaration.id.id.line,
                RuntimeError.DEC_FUN
            );
        }

        this.memory.setFunction(declaration.id, declaration);
    }

    interpretConditional(conditional: Conditional): Literal | undefined {
        const condition = this.interpretExpression(conditional.condition);
        let value = undefined;
        if (this.convertToBoolean(condition)) {
            value = this.interpretBlock(conditional.block);
        } else if (conditional.next instanceof Conditional) {
            value = this.interpretConditional(conditional.next);
        } else if (conditional.next instanceof Array) {
            value = this.interpretBlock(conditional.next);
        }
        return value;
    }

    interpretWhile(whileStatement: WhileStatement): Literal | undefined {
        while (
            this.convertToBoolean(
                this.interpretExpression(whileStatement.condition)
            )
        ) {
            const value = this.interpretBlock(whileStatement.block);

            if (value) {
                return value;
            }
        }
    }

    interpretBlock(
        block: Statement[],
        params?: Map<Identifier, Literal>
    ): Literal | undefined {
        this.memory.addScope();
        if (params) {
            params.forEach((val: Literal, id: Identifier) =>
                this.memory.setInCurrentScope(id, val)
            );
        }
        let returnValue = undefined;
        for (const statement of block) {
            if (statement.type === ASTNodeType.N_RETURN) {
                const returnStatement = statement as ReturnStatement;
                if (returnStatement.expr) {
                    returnValue = this.interpretExpression(
                        returnStatement.expr
                    );
                }
            } else {
                returnValue = this.interpretStatement(statement);
            }

            if (returnValue) {
                break;
            }
        }
        this.memory.removeScope();

        return returnValue;
    }

    interpretExpression(expression: ASTNode): Literal {
        switch (expression.type) {
            case ASTNodeType.N_LITERAL: {
                return expression as Literal;
            }
            case ASTNodeType.N_IDENTIFIER: {
                return this.memory.getVariable(expression as Identifier);
            }
            case ASTNodeType.N_BINARY: {
                return this.interpretBinaryExpression(expression as Binary);
            }
            case ASTNodeType.N_FUNCTIONCALL: {
                const functionCall = expression as FunctionCall;
                const literal = this.interpretFunctionCall(functionCall);
                if (literal) {
                    return literal;
                }
                throw new RuntimeError(
                    functionCall.id.id.line,
                    RuntimeError.EXPECT_RETURN
                );
            }
            default: {
                // TODO add better error handling here
                throw new RuntimeError(-1, RuntimeError.INVALID_EXPR);
            }
        }
    }

    interpretFunctionCall(functionCall: FunctionCall): Literal | undefined {
        // handle built-in functions
        if (NativeFunction.hasNativeFunction(functionCall.id)) {
            return this.interpretNativeFunctionCall(functionCall);
        }

        const functionDeclaration = this.memory.getFunction(functionCall.id);

        if (functionDeclaration.params.length !== functionCall.args.length) {
            throw new RuntimeError(
                functionCall.id.id.line,
                RuntimeError.INVALID_ARGS
            );
        }

        const paramsMap: Map<Identifier, Literal> = new Map<
            Identifier,
            Literal
        >();

        for (let i = 0; i < functionCall.args.length; i++) {
            paramsMap.set(
                functionDeclaration.params[i],
                this.interpretExpression(functionCall.args[i])
            );
        }

        return this.interpretBlock(functionDeclaration.block, paramsMap);
    }

    interpretNativeFunctionCall(
        functionCall: FunctionCall
    ): Literal | undefined {
        const nativeFunction = NativeFunction.getNativeFunction(
            functionCall.id
        );

        const returnValue = nativeFunction.execute(
            functionCall.args.map(
                (arg) => this.interpretExpression(arg).token.literal
            )
        );

        if (returnValue) {
            let type = undefined;
            if (returnValue instanceof Number) {
                type = TokenType.T_INTCONSTANT;
            } else if (returnValue instanceof Boolean) {
                type = TokenType.T_BOOLCONSTANT;
            } else {
                type = TokenType.T_STRINGCONSTANT;
            }
            return new Literal(
                new Token(type, returnValue.toString(), functionCall.id.id.line)
            );
        }

        return undefined;
    }

    interpretBinaryExpression(binaryExpression: Binary): Literal {
        const left = this.interpretExpression(binaryExpression.left);
        const right = this.interpretExpression(binaryExpression.right);

        let type = undefined;
        let literal = '';

        // TODO add variable type checking
        switch (binaryExpression.operator.type) {
            case TokenType.T_OR: {
                type = TokenType.T_BOOLCONSTANT;
                literal = (
                    this.convertToBoolean(left) || this.convertToBoolean(right)
                ).toString();
                break;
            }
            case TokenType.T_AND: {
                type = TokenType.T_BOOLCONSTANT;
                literal = (
                    this.convertToBoolean(left) && this.convertToBoolean(right)
                ).toString();
                break;
            }
            case TokenType.T_EQ: {
                type = TokenType.T_BOOLCONSTANT;
                literal = (
                    left.token.literal === right.token.literal
                ).toString();
                break;
            }
            case TokenType.T_NEQ: {
                type = TokenType.T_BOOLCONSTANT;
                literal = (
                    left.token.literal !== right.token.literal
                ).toString();
                break;
            }
            case TokenType.T_LEQ: {
                type = TokenType.T_BOOLCONSTANT;
                literal = (
                    this.convertToInteger(left) <= this.convertToInteger(right)
                ).toString();
                break;
            }
            case TokenType.T_GEQ: {
                type = TokenType.T_BOOLCONSTANT;
                literal = (
                    this.convertToInteger(left) >= this.convertToInteger(right)
                ).toString();
                break;
            }
            case TokenType.T_GT: {
                type = TokenType.T_BOOLCONSTANT;
                literal = (
                    this.convertToInteger(left) > this.convertToInteger(right)
                ).toString();
                break;
            }
            case TokenType.T_LT: {
                type = TokenType.T_BOOLCONSTANT;
                literal = (
                    this.convertToInteger(left) < this.convertToInteger(right)
                ).toString();
                break;
            }
            case TokenType.T_PLUS: {
                if (
                    left.token.type === TokenType.T_STRINGCONSTANT ||
                    right.token.type === TokenType.T_STRINGCONSTANT
                ) {
                    type = TokenType.T_STRINGCONSTANT;
                    literal = left.token.literal + right.token.literal;
                } else {
                    type = TokenType.T_INTCONSTANT;
                    literal = (
                        this.convertToInteger(left) +
                        this.convertToInteger(right)
                    ).toString();
                }
                break;
            }
            case TokenType.T_MINUS: {
                type = TokenType.T_INTCONSTANT;
                literal = (
                    this.convertToInteger(left) - this.convertToInteger(right)
                ).toString();
                break;
            }
            case TokenType.T_MULT: {
                type = TokenType.T_INTCONSTANT;
                literal = (
                    this.convertToInteger(left) * this.convertToInteger(right)
                ).toString();
                break;
            }
            case TokenType.T_DIV: {
                type = TokenType.T_INTCONSTANT;
                // parseInt to remove decimal places
                literal = parseInt(
                    (
                        this.convertToInteger(left) /
                        this.convertToInteger(right)
                    ).toString()
                ).toString();
                break;
            }
            case TokenType.T_MOD: {
                type = TokenType.T_INTCONSTANT;
                literal = (
                    this.convertToInteger(left) % this.convertToInteger(right)
                ).toString();
                break;
            }
            default: {
                throw new RuntimeError(
                    left.token.line,
                    RuntimeError.INVALID_EXPR
                );
            }
        }

        return new Literal(new Token(type, literal, left.token.line));
    }

    private expectType(literal: Literal, errMsg: string, type: TokenType) {
        if (literal.token.type != type) {
            throw new RuntimeError(literal.token.line, errMsg);
        }
    }

    private convertToBoolean(literal: Literal): boolean {
        return literal.token.literal === 'true';
    }

    private convertToInteger(literal: Literal): number {
        return parseInt(literal.token.literal);
    }

    private getNextNode(): ASTNode {
        return this.nodes[this.currentIndex++];
    }

    private isAtEnd(): boolean {
        return this.currentIndex >= this.nodes.length;
    }
}
