export class NativeFunction {
    static readonly FUNCTIONS: NativeFunction[] = [];

    static readonly NF_PRINT = new NativeFunction("print", console.log);

    constructor(readonly name: string, readonly nativeFunction: Function) {
        NativeFunction.FUNCTIONS.push(this);
    }

    execute(...params: any[]) {
        this.nativeFunction(params);
    }
}