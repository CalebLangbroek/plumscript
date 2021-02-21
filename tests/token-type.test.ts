import { TokenType } from '../src/token-type';

describe('T_ID', () => {
    it('matches id', () => {
        const result = TokenType.T_ID.match('sum = 45');

        expect(result).toEqual(expect.arrayContaining(['sum']));
    });

    it('does not match id', () => {
        const result = TokenType.T_ID.match('# This is a comment');

        expect(result).toEqual(null);
    });
});

describe('T_INTCONSTANT', () => {
    it('matches id', () => {
        const result = TokenType.T_INTCONSTANT.match('55 + 45');

        expect(result).toEqual(expect.arrayContaining(['55']));
    });

    it('does not match id', () => {
        const result = TokenType.T_INTCONSTANT.match('int a = 5');

        expect(result).toEqual(null);
    });
});

describe('T_STRINGCONSTANT', () => {
    it('matches id', () => {
        const result = TokenType.T_STRINGCONSTANT.match(
            '"First String"' + '"Second String"'
        );

        expect(result).toEqual(expect.arrayContaining(['"First String"']));
    });

    it('does not match id', () => {
        const result = TokenType.T_STRINGCONSTANT.match(`str b = "Hello Test"`);

        expect(result).toEqual(null);
    });
});
