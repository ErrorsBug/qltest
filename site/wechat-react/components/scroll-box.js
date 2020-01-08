/**
 * @author jiajun.li
 * @date 20180521
 *
 * 可滚动div滚动动画
 */



/**
 * 横向滚动
 * @param {el} box 
 * @param {num} scrollEnd 
 * @param {num} time 
 * @param {func} callback 
 */

export function scrollToX(box, scrollEnd, time, callback) {
    time === undefined && (time = 200);
    if (!time) {
        box.scrollLeft = scrollEnd;
        callback && callback();
        return;
    }

    // 起始点
    let scrollBegin = box.scrollLeft;
    // 需要滚动的距离
    let _scroll = scrollEnd - scrollBegin;
    let count = Math.ceil(time / 40);
    let distInt = Math.ceil(_scroll / count);
    let Int = setInterval(function () {
        scrollBegin += distInt;
        box.scrollLeft = scrollBegin;
        if (!--count) {
            box.scrollLeft = scrollEnd;
            clearInterval(Int);
            callback && callback();
        }
    }, 40);
}