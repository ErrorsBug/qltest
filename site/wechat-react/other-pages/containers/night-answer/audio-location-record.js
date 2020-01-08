export class AudioLocationRecord{
    /* 存储的最大长度 */
    static maxLen = 10
    /* localstorage中存储的字段 */
    static KEYWORD = 'AUDIO_LOCATION_STORAGE'

    /**
     * 根据期号获取播放记录
     * 
     * @static
     * @param {number} issueNum 
     * @memberof AudioLocationRecord
     */
    static fetch(issueNum) {
        try {
            let storage = localStorage.getItem(AudioLocationRecord.KEYWORD)
            storage = JSON.parse(storage)
            if (Array.isArray(storage)) {
                return storage.find(item => {
                    return item.issueNum == issueNum
                })
            }
            return null
        } catch (error) {
            console.error('获取音频播放记录失败', error)
            return null
        }
    }

    /**
     * 添加或更新播放记录
     * 
     * @static
     * @param {any} item 新增或更新的记录
     * @memberof AudioLocationRecord
     */
    static update(record) {
        try {
            if (!record.issueNum) {
                throw new Error('要保存的播放记录缺少期号')
            }
            let storage = localStorage.getItem(AudioLocationRecord.KEYWORD)
            let arr = JSON.parse(storage) || []

            /* 去掉前面同期的记录 */
            arr = arr.filter(item => item.issueNum !== record.issueNum)
            arr.push(record)
            if (arr.length > AudioLocationRecord.maxLen) {
                arr.shift()
            }
            localStorage.setItem(AudioLocationRecord.KEYWORD, JSON.stringify(arr))
            return true
        } catch (error) {
            console.error('更新音频播放记录失败: ', error)
            return false
        }
    }
}
