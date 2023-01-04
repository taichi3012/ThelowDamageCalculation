export default class StringUtil {
    static reverse(string: string) {
        return string.split("").reverse().join("");
    }
}