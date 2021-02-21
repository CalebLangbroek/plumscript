import { Token } from '../src/token';
import { TokenType } from '../src/token-type';

describe('token', () => {
    const token = new Token(TokenType.T_ID, 'sum', 1);

    it('returns to string', () => {
        const toString = token.toString();

        expect(toString).toEqual('T_ID: sum');
    });
});
