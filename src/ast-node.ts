import { ASTNodeType } from './ast-node-type';
import { Token } from './token';

export abstract class ASTNode {
    constructor(readonly type: ASTNodeType) {}
}

export abstract class Expression extends ASTNode {}
export abstract class Statement extends ASTNode {}

export class VariableDeclaration extends Statement {
    constructor(readonly variableType: TypeSpecifier, readonly id: Identifier, readonly expr: Expression) {
        super(ASTNodeType.N_VARIABLEDECLARATION);
    }
}

export class FunctionDeclaration extends Statement {
    constructor(readonly id: Identifier, readonly params: Identifier[], readonly block: Statement[]) {
        super(ASTNodeType.N_FUNCTIONDECLARATION);
    }
}

export class Assignment extends Statement {
    constructor(readonly id: Identifier, readonly expr: Expression) {
        super(ASTNodeType.N_ASSIGNMENT);
    }
}

export class ReturnStatement extends Statement {
    constructor(readonly expr?: Expression) {
        super(ASTNodeType.N_RETURN);
    }
}

export class Conditional extends Statement {
    constructor(readonly condition: Expression, readonly block: Statement[], readonly next? : Conditional | Statement[]) {
        super(ASTNodeType.N_CONDITIONAL);
    }
}

export class WhileStatement extends Statement {
    constructor(readonly condition: Expression, readonly block: Statement[]) {
        super(ASTNodeType.N_WHILE);
    }
}

export class Binary extends Expression {
    constructor(readonly left: Expression, readonly operator: Token, readonly right: Expression) {
        super(ASTNodeType.N_BINARY);
    }
}

export class Literal extends Expression {
    constructor(readonly token: Token) {
        super(ASTNodeType.N_LITERAL);
    }
}

export class Identifier extends Expression {
    constructor(readonly id: Token) {
        super(ASTNodeType.N_IDENTIFIER);
    }
}

export class FunctionCall extends Expression {
    constructor(readonly id: Identifier, readonly args: Expression[]) {
        super(ASTNodeType.N_FUNCTIONCALL);
    }
}

export class TypeSpecifier extends ASTNode {
    constructor(readonly token: Token) {
        super(ASTNodeType.N_TYPESPECIFIER);
    }
}
