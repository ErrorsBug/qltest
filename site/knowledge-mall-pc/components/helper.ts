/**
 * 从对象中选出特定值组合成一个新的对象返回
 * 
 * @param {Object} obj 要挑选的对象（听起来怎么有点奇怪？）
 * @param {string[]} picks 要选择的特定key
 * @param {RegExp} [reg] 要选择的特定key满足的正则
 * @returns 
 */
export function pickObj(obj: Object, picks: string[] = [], reg?: RegExp)
{
    const keys = Object.keys(obj)
    let ret = {}

    keys.filter(item => { return picks.indexOf(item) > -1 || reg.test(item) })
        .forEach(item => { ret[item] = obj[item] })

    return ret
}

/**
 * 从对象中选出特定值组合成一个数组返回
 * 
 * @param {Object} obj 要挑选的对象（听起来怎么有点奇怪？）
 * @param {string[]} picks 要选择的特定key
 * @param {RegExp} [reg] 要选择的特定key满足的正则
 * @returns 
 */
export function pickObjToArr(obj: Object, picks: string[] = [], reg?: RegExp)
{
    const keys = Object.keys(obj)
    let ret = []

    keys.filter(item => { return picks.indexOf(item) > -1 || (reg && reg.test(item)) })
        .forEach(item => { ret.push({ key: item, value: obj[item] }) })
    
    return ret
}

/**
 * 一个简单的复制对象方法，注意对于属性有函数的对象无法实现完全复制，会丢失
 * 掉值是函数的key
 * 
 * @export
 * @template T 
 * @param {T} obj 
 * @returns {T} 
 */
export function simpleCopy<T>(obj: T): T
{
    return JSON.parse(JSON.stringify(obj))
}

/**
 * 过滤掉对象中没有值的key，返回一个新的对象
 * 
 * @export
 * @param {Object} obj 
 * @returns 
 */
export function objFilter(obj: Object)
{
    let ret = {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) {
            ret[key] = obj[key]
        }
    }
    return ret
}