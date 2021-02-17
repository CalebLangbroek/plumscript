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
        for (let i = this.variableScopes.length - 1; i > -1; i--) {
            const scope = this.variableScopes[i];
            if (scope.has(id.id.literal)) {
                return true;
            }
        }

        return false;
    }

    getVariable(id: Identifier): Literal {
        for (let i = this.variableScopes.length - 1; i > -1; i--) {
            const scope = this.variableScopes[i];
            if (scope.has(id.id.literal)) {
                // Casting here bc scope.get() returns undefined if key doesn't exist
                // but we already check that the id exists so it is always a Literal
                return scope.get(id.id.literal) as Literal;
            }
        }

        throw new RuntimeError(id.id.line, RuntimeError.UNDEC_VAR);
    }

    setVariable(id: Identifier, value: Literal): void {
        // Check if variable already exists
        for (let i = this.variableScopes.length - 1; i > -1; i--) {
            const scope = this.variableScopes[i];
            if (scope.has(id.id.literal)) {
                scope.set(id.id.literal, value);
                return;
            }
        }

        // Otherwise declare new in current scope
        this.getCurrentVariableScope().set(id.id.literal, value);
    }

    setInCurrentScope(id: Identifier, value: Literal) {
        this.getCurrentVariableScope().set(id.id.literal, value);
    }

    hasFunction(id: Identifier): boolean {
        for (let i = this.functionScopes.length - 1; i > -1; i--) {
            const scope = this.functionScopes[i];
            if (scope.has(id.id.literal)) {
                return true;
            }
        }

        return false;
    }

    getFunction(id: Identifier): FunctionDeclaration {
        for (let i = this.functionScopes.length - 1; i > -1; i--) {
            const scope = this.functionScopes[i];
            if (scope.has(id.id.literal)) {
                // Casting here bc scope.get() returns undefined if key doesn't exist
                // but we already check that the id exists so it is always a Literal
                return scope.get(id.id.literal) as FunctionDeclaration;
            }
        }

        throw new RuntimeError(id.id.line, RuntimeError.UNDEC_FUN);
    }

    setFunction(id: Identifier, value: FunctionDeclaration): void {
        // Check if function already exists
        for (const scope of this.functionScopes) {
            if (scope.has(id.id.literal)) {
                scope.set(id.id.literal, value);
                return;
            }
        }

        // Otherwise declare new in current scope
        this.getCurrentFunctionScope().set(id.id.literal, value);
    }

    addScope(): void {
        this.variableScopes.push(new Map<string, Literal>());
        this.functionScopes.push(new Map<string, FunctionDeclaration>());
    }

    removeScope(): void {
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
