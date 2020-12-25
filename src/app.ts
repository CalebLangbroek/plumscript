import { Parser } from './parser';
import { Scanner } from './scanner';

const input = `
    # A simple program
    bool a = 4

    str b = "Hello World"
`;

export function main() {
    const scanner = new Scanner(input);
    const tokens = scanner.scan();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    for (const node of ast) {
        console.log(node);
    }
}

main();
