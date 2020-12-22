export class SyntaxError extends Error {
    constructor(line: number, ...message: string[]) {
        super(`${message.join(' ')} AT LINE ${line}`);
    }
}
