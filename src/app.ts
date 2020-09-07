import { Utils } from './utils/utils';
import { Token } from './token';
import { SyntaxError } from './errors/syntax-error';

const input = `
    # A simple program
    var a = 4

    var y = 5
    
    var name = "John"

    print(4, "John", y) 
`;

function executeProgram(program: string): void {
    program = Utils.removeComments(program);
    program = Utils.removeEmptyLines(program);

    let lines = Utils.splitWithFilter(program, /\n/);

    let tokens: Token[] = [];
    lines.forEach((line) => {
        if (line.length < 1) return;
        tokens = tokens.concat(tokenize(line));
    });

    for (const op of tokens) {
        console.log(op);
    }
}

function tokenize(str: string): Token {
    if (str.length < 1) {
        throw new SyntaxError('Unexpected empty token');
    }
    str = str.trim();

    return Token.tokenize(str);
}

executeProgram(input);
