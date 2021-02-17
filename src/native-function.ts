import { FunctionCall, Identifier } from './ast-node';
import { RuntimeError } from './errors/runtime-error';

export class NativeFunction {
    static readonly FUNCTION_IDS: string[] = [];
    static readonly FUNCTIONS: NativeFunction[] = [];

    static readonly NF_PRINT = new NativeFunction('print', console.log);

    static readonly NF_POWER = new NativeFunction('pow', Math.pow);

    static readonly NF_LEN = new NativeFunction('len', (a: any) => a.length);

    static hasNativeFunction(id: Identifier): boolean {
        return NativeFunction.FUNCTION_IDS.includes(id.id.literal);
    }

    static getNativeFunction(id: Identifier): NativeFunction {
        const nativeFunction = NativeFunction.FUNCTIONS.find(
            (natFun) => natFun.name === id.id.literal
        );
        if (nativeFunction) {
            return nativeFunction;
        }

        // Should never reach here
        throw new RuntimeError(id.id.line, RuntimeError.UNDEC_FUN);
    }

    constructor(readonly name: string, readonly nativeFunction: Function) {
        NativeFunction.FUNCTIONS.push(this);
        NativeFunction.FUNCTION_IDS.push(this.name);
    }

    execute(params: any[]): any {
        return this.nativeFunction(...params);
    }
}
