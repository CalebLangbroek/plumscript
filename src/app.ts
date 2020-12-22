import { Scanner } from './scanner';

const input = `
    # A simple program
    var a = 4
    var b = 5 + 3
    print("John")
`;

export function main() {
    const scanner = new Scanner(input);
    const tokens = scanner.scan();

    for (const token of tokens) {
        console.log('' + token);
    }
}

main();
