import { TokenType } from "./token-type";

export class NativeType {
    static readonly TYPES: NativeType[] = [];

    static readonly NT_NATIVE_NUMBER: NativeType = new NativeType("NT_NATIVE_NUMBER", "number", TokenType.T_INTCONSTANT);
    static readonly NT_NATIVE_STRING: NativeType = new NativeType("NT_NATIVE_STRING", "string", TokenType.T_STRINGCONSTANT);
    static readonly NT_NATIVE_BOOLEAN: NativeType = new NativeType("NT_NATIVE_BOOLEAN", "boolean", TokenType.T_BOOLCONSTANT);
    static readonly NT_NATIVE_UNDEFINED: NativeType = new NativeType("NT_NATIVE_UNDEFINED", "undefined", TokenType.T_NULL);

    constructor(readonly name: string, readonly nativeType: string, readonly type: TokenType) {
        NativeType.TYPES.push(this);
    }

    matches(value: any): boolean {
        return typeof value === this.nativeType;
    }

    toString(): string {
        return this.name;
    }
}