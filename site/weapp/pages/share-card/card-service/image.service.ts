import * as regeneratorRuntime from '../../../comp/runtime'
import request from '../../../comp/request';
import { getVal } from '../../../comp/util';
import { api } from '../../../config';
import { wxm } from '../../../service/wx-method.service';
import { setStorage, getStorage } from '../../../service/storage.service';

const SHARE_CARD_BG = 'SHARE_CARD_BG';

// 单例实例，保存在文件闭包内
let imageServiceInstance: ImageService;

/**
 * 图片的服务
 * 1. public static loadImage(remoteUrl: string): Promise<string>
 *      加载远程图片，该图片将会缓存在本地，第二次获取该图片的时候，不会再去下载图片，图片缓存最多7天
 */
export default class ImageService {

    /**
     * cache的格式是{ remoteUrl: localUrl, ... }
     */
    private _cacheImage: { [remoteUrl: string]: string }

    constructor() {
        let storageData = getStorage(SHARE_CARD_BG)
        try {
            if (!storageData) {
                this._cacheImage = {};
            } else {
                this._cacheImage = JSON.parse(storageData);
            }
        } catch (error) {
            console.error(error);
            this._cacheImage = {};
        }
    }

    private static get _instance(): ImageService {
        if (!imageServiceInstance) {
            imageServiceInstance = new ImageService();
        }

        return imageServiceInstance;
    }

    /**
     * 根据网络图片地址获取本地图片地址
     * @param remoteUrl 网络图片地址
     */
    public static async loadImage(remoteUrl: string): Promise<string> {
        if (!remoteUrl) {
            throw "[ImageService] ImageService.loadImage方法需要一个remoteUrl参数，但是得到的参数是" + remoteUrl;
        }

        let localUrl = ImageService._instance._cacheImage[remoteUrl];

        if (localUrl) {
            // 1.invoke getFileInfo to judge whether file is valid or not
            // 2.if file is valid, just return file path
            // 3.if file is invalid, call this.fetchFile that will download file and return localFilePath 
            try {
                let fileInfo = wxm.getFileInfo({ filePath: localUrl })
                if (fileInfo) {
                    return localUrl;
                }
            } catch (error) {
                console.error('[ImageService] wx.getFileInfo error:\n', error);
            }
        }

        return await ImageService._instance.fetchFile(remoteUrl);
    }

    // 1.download file and get a tempFilePath √
    // 2.save file and get a local filePath √
    // 3.insert or update remoteUrl--localUrl in storage
    // 4.return localUrl
    private async fetchFile(remoteUrl: string): Promise<string> {
        let tempFilePath, localFilePath;

        try {
            const downloadFileResult = await wxm.downloadFile({ url: remoteUrl });

            if (downloadFileResult.statusCode === 200) {
                tempFilePath = downloadFileResult.tempFilePath;
            } else {
                tempFilePath = '';
            }
        } catch (error) {
            console.error('[ImageService] wx.downloadFile error:\n', error);
        }

        if (tempFilePath) {
            const saveFileResult = await wxm.saveFile({ tempFilePath });
            localFilePath = saveFileResult.savedFilePath;
        }

        ImageService._instance._cacheImage[remoteUrl] = localFilePath

        try {
            let imageCacheStr = JSON.stringify(ImageService._instance._cacheImage);
            // expires是7天
            setStorage(SHARE_CARD_BG, imageCacheStr, 604800);
        } catch (error) {
            console.error('[ImageService] JSON.stringify error: ', error);
        }

        return localFilePath;
    }
}
