/**
 * 将对象以search语句的形式放入url中
 *
 * @export
 * @param {string} url 请求地址
 * @param {*} query search语句对象
 * @returns {string} 构建好的url
 */
export function buildquery(url: string, query: any): string {
    if (!query || typeof query !== 'object') {
        return url
    }

    let result: string[] = []
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            const val = query[key]
            // 如果是数组则将每一项都push进result
            if (Array.isArray(val)) {
                val.forEach((item) => {
                    result.push(`${key}=${val}`)
                })
            } else {
                result.push(`${key}=${val}`)
            }
        }
    }

    let querysymbol: string = url.indexOf('?') > -1
        ? '&'
        : '?'

    return url + querysymbol + result.join('&')
}