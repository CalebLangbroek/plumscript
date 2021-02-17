import { FunctionDeclaration, Identifier, Literal } from './ast-node';
import { RuntimeError } from './errors/runtime-error';

type VariableScope = Map<string, Literal>;
type FunctionScope = Map<string, FunctionDeclaration>;

export class MemoryScope {
    private variableScopes: VariableScope[] = [];
    private functionScopes: FunctionScope[] = [];

    constructor() {
        this.addScope();
    }

    hasVariable(id: Identifier): boolean {
        for (const scope of this.variableScopes) {
            if (scope.has(id.id.literal)) {
                return true;
            }
        }

        return false;
    }

    getVariable(id: Identifier): Literal {
        for (const scope of this.variableScopes) {
            if (scope.has(id.id.literal)) {
                // Casting here bc scope.get() returns undefined if key doesn't exist
                // but we already check that the id exists so it is always a Literal
                return scope.get(id.id.literal) as Literal;
            }
        }

        throw new RuntimeError(id.id.line, RuntimeError.UNDEC_VAR);
    }

    setVariable(id: Identifier, value: Literal) {
        this.getCurrentVariableScope().set(id.id.literal, value);
    }

    hasFunction(id: Identifier): boolean {
        for (const scope of this.functionScopes) {
            if (scope.has(id.id.literal)) {
                return true;
            }
        }

        return false;
    }

    getFunction(id: Identifier): FunctionDeclaration {
        for (const scope of this.functionScopes) {
            if (scope.has(id.id.literal)) {
                // Casting here bc scope.get() returns undefined if key doesn't exist
                // but we already check that the id exists so it is always a Literal
                return scope.get(id.id.literal) as FunctionDeclaration;
            }
        }

        throw new RuntimeError(id.id.line, RuntimeError.UNDEC_FUN);
    }

    setFunction(id: Identifier, value: FunctionDeclaration) {
        this.getCurrentFunctionScope().set(id.id.literal, value);
    }

    addScope() {
        this.variableScopes.push(new Map<string, Literal>());
        this.functionScopes.push(new Map<string, FunctionDeclaration>());
    }

    removeScope() {
        if (this.variableScopes.length !== 0) {
            this.variableScopes.pop();
        }
        if (this.functionScopes.length !== 0) {
            this.functionScopes.pop();
        }
    }

    private getCurrentVariableScope() {
        return this.variableScopes[this.variableScopes.length - 1];
    }

    private getCurrentFunctionScope() {
        return this.functionScopes[this.functionScopes.length - 1];
    }
}
