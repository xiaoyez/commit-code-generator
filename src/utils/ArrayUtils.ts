import {indexOf} from "lodash";

/**
 * 判断数组是否包含某个元素
 * @param arr
 * @param elem
 */
export function contains(arr:any[], elem:any){
    return indexOf(arr,elem) >= 0;
}