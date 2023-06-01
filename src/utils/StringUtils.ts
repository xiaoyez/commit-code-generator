import pluralize from 'pluralize-esm';
/**
 * 单词复数形式转单数形式
 * @param str
 */
export function singular(str: string) {
    if (str.endsWith("List"))
        str = str.substring(0, str.lastIndexOf('List'));
    return pluralize.singular(str);
}
