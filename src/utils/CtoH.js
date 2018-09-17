/**
 * 全角半角转换
 * @param obj
 * @returns 半角字符串
 * @constructor
 */
function CtoH(obj) {
    let str = obj;
    let result = "";
    if (str) {
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) === 12288) {
                result += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375)
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            else result += String.fromCharCode(str.charCodeAt(i));
        }
        obj = result;
    }
    return obj;
}

export default CtoH;
