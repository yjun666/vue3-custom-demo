import router from '@/router';
import { Decimal } from 'decimal.js';
import XEUtils from 'xe-utils';

// 手机号码正则匹配
export const validatorPhoneNum = (phoneNum: string) => {
    const regUser = /^[\u4e00-\u9fa5]{2,4}$/; // 2-4个中文字符正则
    const regTel = new RegExp(
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    ); // 11位手机号码正则
    return regTel.test(phoneNum);
};

/**
* @param {string} str   需要插入的字符（串）
* @param {int} length   间隔几个字符
*/
export const strInsert = (str:string, length:number) => {
    // const reg = new RegExp('\\d{1,' + length + '}', 'g');
    const reg = new RegExp('.{1,' + length + '}', 'g');
    const ma:any = str.match(reg);
    return ma.join('^_^') + '^_^'; // 最后面不要"^_^" 就去掉( + "^_^")
}
