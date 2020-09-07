export class Utils {
    static removeComments(str: string): string {
        return str.replace(/#.*/g, '');
    }

    static removeEmptyLines(str: string): string {
        return str.replace(/[^\S]*\n/g, '\n');
    }

    static splitWithFilter(str: string, splitter: RegExp): string[] {
        return str.split(splitter).filter((el) => el.length > 0);
    }
}
