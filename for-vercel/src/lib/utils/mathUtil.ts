import StringUtil from "./stringUtil";

export default class MathUtil {
    static baseNumberCharacter = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    ];

    static parseBaseInt(string: string, radix: number) {
        if (radix > this.baseNumberCharacter.length) return 0;

        string = string.split(".")[0];
        if (!string.match(/^-?((?!0)[\da-zA-Z]+|0)$/)) return 0;

        const baseChars = this.baseNumberCharacter.slice(0, radix);

        const isNegativeNum = string.startsWith("-");
        if (isNegativeNum) string = string.replace("-", "");

        let resultNum = 0;
        let digitRec = 0;
        for (const str of StringUtil.reverse(string)) {
            const index = baseChars.indexOf(str);

            if (index === -1) return 0;

            resultNum += index * radix ** digitRec;
            digitRec++;
        }

        return isNegativeNum ? -resultNum : resultNum;
    }

    static toBaseIntString(number: number, radix: number) {
        const baseChars = this.baseNumberCharacter.slice(0, radix);

        let resultStr = "";
        let i = Math.trunc(number > 0 ? number : -number);
        do {
            const remainde = i % radix;

            resultStr = baseChars[remainde] + resultStr;

            i -= remainde;
            i /= radix;
        } while (i !== 0);

        if (number < 0) resultStr = "-" + resultStr;

        return resultStr;
    }
}