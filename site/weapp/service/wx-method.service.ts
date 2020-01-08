interface WxMethodParams {
    [index: string]: any
    success?: (res: any) => void
    fail?: (err: any) => void
}

class WxMethodService {

    public login = this.promisify(wx.login)
    public getUserInfo = this.promisify(wx.getUserInfo)
    public checkSession = this.promisify(wx.checkSession)
    public getSetting = this.promisify((wx as any).getSetting)
    public openSetting = this.promisify((wx as any).openSetting)
    public downloadFile = this.promisify(wx.downloadFile)
    public saveFile = this.promisify(wx.saveFile)
    public getSavedFileInfo = this.promisify(wx.getSavedFileInfo)
    public getSavedFileList = this.promisify(wx.getSavedFileList)
    public getFileInfo = this.promisify((wx as any).getFileInfo)
    public canvasToTempFilePath = this.promisify((wx as any).canvasToTempFilePath)
    public saveImageToPhotosAlbum = this.promisify((wx as any).saveImageToPhotosAlbum)
    public showModal = this.promisify(wx.showModal)


    /**
     * 将一些微信的原生方法promise化，避免callback hell
     * 
     * @private
     * @param {Function} method 
     * @param {*} [option={}] 
     * @returns 
     * @memberof WxpService
     */
    public promisify(method: Function, option: any = {}) {
        return function (obj: WxMethodParams = {}):Promise<any> {
            Object.assign(obj, option)

            return new Promise((resolve, reject) => {
                obj.success = obj.success || function (res: any) {
                    resolve(res)
                }
                obj.fail = obj.fail || function (err: any) {
                    reject(err)
                }

                method(obj)
            })
        }
    }
}

export const wxm = new WxMethodService()
