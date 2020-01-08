import { ApiService } from '../api-service'

class AliyunUploaderService {
    
    private scriptLoaded: string[] = []
    private scripts = [
        '//gosspublic.alicdn.com/aliyun-oss-sdk.min.js',
        '//static.qianliaowang.com/video-admin/aliyun-sdk.min.js',
        '//static.qianliaowang.com/video-admin/vod-sdk-upload-1.0.6.min.js',
    ]

    public get ready() {
        return this.scriptLoaded.length === this.scripts.length
    }

    private loadScript(srcs: string[]) {
        srcs.forEach((item, index) => {
            const $script = document.createElement('script')
            $script.src = item
            $script.onload = () => { this.scriptLoaded.push(item) }
            document.body.appendChild($script)
        })
    }

    private async requestVideoAuth(file: File) {
        const result = await this.apiService.get({
            url: '/h5/common/videoAuth',
            body: {
                fileName: file.name,
                fileSize: file.size,
            }
        })
        return result.data
    }

    private async saveMedia(auth, uploadInfo, topicId) {
        const { requestId, uploadAddress, uploadAuth, videoId } = auth
        const { bucket, endPoint, file, object, userData } = uploadInfo

        const result = await this.apiService.post({
            url: '/h5/media/add',
            body: {
                fileSize: file.size,
                fileName: file.name,
                mediaId: videoId,
                topicId: topicId,
                type: 'video',
                url: bucket + ',' + object,
            }
        })
    }

    private async refreshAuth(videoId) {
        const result = await this.apiService.post({
            url: '/h5/media/refresh',
            body: { videoId },
        })

        return result.data
    }

    public async uploadFile(
        file: File,
        {
            onUploadstarted = () => { },
            onUploadSucceed = () => { },
            onUploadFailed = () => { },
            onUploadProgress = () => { },
            onUploadTokenExpired = () => { },
        },
        topicId: string
    ) {
        const auth = await this.requestVideoAuth(file)
        const { requestId, uploadAddress, uploadAuth, videoId } = auth

        const uploader = new (window as any).VODUpload({
            /* 开始上传 */
            'onUploadstarted': (uploadInfo) => {
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress);
                onUploadstarted.apply(this, [uploadInfo])
            },
            /* 文件上传成功 */
            'onUploadSucceed': (uploadInfo) => {
                this.saveMedia(auth, uploadInfo, topicId)
                onUploadSucceed.apply(this, [uploadInfo])
            },
            /* 文件上传失败 */
            'onUploadFailed': (uploadInfo, code, message) => {
                onUploadFailed.apply(this, [uploadInfo, code, message])
            },
            /* 文件上传进度，单位：字节 */
            'onUploadProgress': function (uploadInfo, totalSize, uploadedSize) {
                onUploadProgress.apply(this, [uploadInfo, totalSize, uploadedSize])
            },
            /* 上传凭证超时 */
            'onUploadTokenExpired': async () => {
                const { requestId, uploadAuth } = await this.refreshAuth(videoId)
                uploader.resumeUploadWithAuth(uploadAuth);
            },
        })

        const accessKeyId = ''
        const accessKeySecret = ''
        const userData = '{"Vod":{"UserData":"{"IsShowWaterMark":"false","Priority":"7"}"}}';

        uploader.init(accessKeyId, accessKeySecret);
        uploader.addFile(file, null, null, null, userData);
        uploader.startUpload()
    }

    constructor(private apiService: ApiService) { }
}