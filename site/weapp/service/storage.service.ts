interface StorageData {
    _expires: number
    value: string
}

export function setStorage(key: string, data: any, expires?: number) {
    try {
        const expireTime = expires ? Date.now() + expires * 1000 : -1
        const storageData: StorageData = {
            _expires: expireTime,
            value: data,
        }

        wx.setStorageSync(key, storageData)
    } catch (error) {
        console.error('设置storage失败: ', error)
    }
}

export function getStorage(key: string): any {
    try {
        console.log('key:', key)
        const storageData = wx.getStorageSync(key) as StorageData
        const expireTime = storageData._expires

        if (!storageData) {
            return null
        }
        if (expireTime > 0 && expireTime < Date.now()) {
            console.info('缓存过期: ', key)
            wx.removeStorageSync(key)
            return null
        }

        return storageData.value
    } catch (error) {
        console.error('获取storage失败: ', error)
    }
}
