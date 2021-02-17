export class ASTNodeType {
    static readonly TYPES: ASTNodeType[] = [];

    static readonly N_VARIABLEDECLARATION: ASTNodeType = new ASTNodeType("N_VARIABLEDECLARATION");

    static readonly N_FUNCTIONDECLARATION: ASTNodeType = new ASTNodeType("N_FUNCTIONDECLARATION");

    static readonly N_ASSIGNMENT: ASTNodeType = new ASTNodeType("N_ASSIGNMENT");

    static readonly N_RETURN: ASTNodeType = new ASTNodeType("N_RETURN");

    static readonly N_CONDITIONAL: ASTNodeType = new ASTNodeType("N_CONDITIONAL");

    static readonly N_WHILE: ASTNodeType = new ASTNodeType("N_WHILE");

    static readonly N_BINARY: ASTNodeType = new ASTNodeType("N_BINARY");

    static readonly N_TYPESPECIFIER: ASTNodeType = new ASTNodeType("N_TYPESPECIFIER");

    static readonly N_LITERAL: ASTNodeType = new ASTNodeType("N_LITERAL");

    static readonly N_IDENTIFIER: ASTNodeType = new ASTNodeType("N_IDENTIFIER");

    static readonly N_FUNCTIONCALL: ASTNodeType = new ASTNodeType("N_FUNCTIONCALL");

    constructor(readonly name: string) {
        ASTNodeType.TYPES.push(this);
    }

    toString(): string {
        return this.name;
    }
}