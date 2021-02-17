import { readFileSync } from 'fs';
import { Interpreter } from './interpreter';
import { Parser } from './parser';
import { Scanner } from './scanner';

export class PlumScript {
    constructor(private source: string) {}

    run() {
        try {
            const scanner = new Scanner(this.source);
            const tokens = scanner.scan();
            const parser = new Parser(tokens);
            const ast = parser.parse();
            const interpreter = new Interpreter(ast);
            interpreter.interpret();
        } catch (e) {
            console.log(<Error>e.message);
        }
    }
}

function main(args: string[]) {
    const source = readFileSync(args[0]);
    const plum = new PlumScript(source.toString());
    plum.run();
}

main(process.argv.slice(2));
