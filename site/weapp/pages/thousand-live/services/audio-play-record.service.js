export class AudioPlayRecordService {
    constructor() {
        /* localStorage中存储的key */
        this.AUDIO_PLAY_RECORD = "AUDIO_PLAY_RECORD";
        /* 最大保存课程数 */
        this.maxLen = 20;
    }
    /**
     * 获取localStorage
     *
     * @private
     * @type {Array<AudioRecord>}
     * @memberof AudioPlayRecord
     */
    get storage() {
        try {
            let local = wx.getStorageSync(this.AUDIO_PLAY_RECORD);
            return local ? local : [];
        }
        catch (error) {
            console.error("获取播放记录本地缓存失败", error);
            return [];
        }
    }
    /**
     * 更新localStorage
     *
     * @private
     * @memberof AudioPlayRecord
     */
    set storage(store) {
        try {
            wx.setStorageSync(this.AUDIO_PLAY_RECORD, store);
        }
        catch (error) {
            console.error("更新播放记录本地缓存失败", error);
        }
    }
    /**
     * 获取播放记录
     *
     * @param {string} topicId
     * @returns
     * @memberof AudioPlayRecord
     */
    getRecord(topicId) {
        const local = this.storage;
        const record = local.find(item => item.topicId === topicId);
        return record ? record.records : [];
    }
    /**
     * 更新播放记录
     *
     * @param {AudioRecord['topicId']} topicId
     * @param {audio} audioId
     * @memberof AudioPlayRecord
     */
    updateRecord(topicId, audioId) {
        let local = this.storage;
        let record = local.find(item => item.topicId === topicId);
        if (record) {
            if (record.records.indexOf(audioId) < 0) {
                record.records.push(audioId);
            }
        }
        else {
            local.push({
                topicId,
                records: [audioId]
            });
            /* 超过最多保留数量就干掉 */
            if (local.length > this.maxLen) {
                local = local.splice(-this.maxLen);
            }
            this.storage = local;
        }
        this.storage = local;
    }
}
