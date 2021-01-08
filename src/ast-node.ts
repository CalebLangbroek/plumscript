import { Token } from './token';

export abstract class ASTNode {
    constructor(readonly name: string) {}
}

export abstract class Expression extends ASTNode {}
export abstract class Statement extends ASTNode {}


export class Declaration extends Statement {
    constructor(readonly type: TypeSpecifier, readonly id: Identifier, readonly expr: Expression) {
        super("N_VARIABLEDECLARATION");
    }
}

export class FunctionDeclaration extends Statement {
    constructor(readonly id: Identifier, readonly params: Expression[], readonly body: Statement[]) {
        super("N_FUNCTIONDECLARATION");
    }
}

export class Assignment extends Statement {
    constructor(readonly id: Identifier, readonly expr: Expression) {
        super("N_ASSIGNMENT");
    }
}

export class ReturnStatement extends Statement {
    constructor(readonly expr?: Expression) {
        super("N_RETURN");
    }
}

export class Binary extends Expression {
    constructor(readonly left: Expression, readonly operator: Token, readonly right: Expression) {
        super("N_BINARY");
    }
}

export class TypeSpecifier extends ASTNode {
    constructor(readonly token: Token) {
        super("N_TYPESPECIFIER");
    }
}

export class Literal extends Expression {
    constructor(readonly token: Token) {
        super("N_LITERAL");
    }
}

export class Identifier extends Expression {
    constructor(readonly id: Token) {
        super("N_IDENTIFIER");
    }
}

export class FunctionCall extends Expression {
    constructor(readonly id: Token, readonly args: Expression[]) {
        super("N_FUNCTIONCALL");
    }
}
