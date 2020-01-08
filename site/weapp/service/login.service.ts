import { wxm } from './wx-method.service'
import { apiService } from './api.service'
import { setStorage, getStorage } from './storage.service'
import { getCurrentPageUrl } from "../comp/util";

interface ILoginResult{
    errMsg: string
    code: string
}

interface IUserInfoResult{
    userInfo: Object
    rawData: string
    signature: string
    encryptedData: string
    iv: string
}

interface IApiResult{
    sid: string
    expires: number
}

interface ILoginQueue{
    resolve: any
    reject:any
}

class LoginService {
    private SID_STORAGE_KEY = 'sid'
    private USERID_STORAGE_KEY = 'userId'
    private MINISESSION_STORAGE_KEY = 'miniSessionKey'

    constructor(){
        this.login = this.login.bind(this)
        this.doLogin = this.doLogin.bind(this)
    }

    /* 记录是否处在登录状态，避免重复登录 */
    static loginQueue = new Array<ILoginQueue>()

    /**
     * 登录方法，需要确保用户处于登录状态时使用
     * 
     * @memberof LoginService
     */
    public async login(loginstr?:String) {
        return new Promise(async (resolve, reject) => {

            /*登录队列*/
            LoginService.loginQueue.push({
                resolve,
                reject,
            });    

            if (LoginService.loginQueue.length > 1) {//需要登录的页面重定向到登录页面，重新push resolve 到 LoginService
                console.log('login--已在登陆中...')
                return
            }  
             
            //检查是否有登录或是否登录过期过期
            const isLogined = await this.checkLoginState();
            if (!isLogined) {
                //没登录或者登录过期则重新登录
                this.doLogin(loginstr).then(()=>{
                    this.clearLoginQueue('resolve')
                },(err)=>{
                    this.clearLoginQueue('reject')
                });
            } else {
                global.isLogined = true
                this.clearLoginQueue('resolve')
            }
        })
    }

    /* 干掉登录队列 */
    private clearLoginQueue(state: 'resolve' | 'reject') {
        console.log('....clearLoginQueue:', state);
        if (state === 'resolve') {
            let len = LoginService.loginQueue.length;
            if (len) {
                LoginService.loginQueue[len - 1].resolve();
            }
        } else {
            LoginService.loginQueue.forEach(item => item.reject());
        }
        LoginService.loginQueue = [];
    }

    /* 检查登录状态是否过期 */
    private async checkLoginState() {
        try {
            /* 检查session是否过期 */
            const sid = getStorage(this.SID_STORAGE_KEY)
            if (!sid) {
                throw new Error('login--登录状态失效')
            }
            /* 检查登录状态是否过期 */
            await wxm.checkSession().then((data)=>{
                return true
                console.log(data);
            },(err)=>{
                throw new Error('login--获取登录缓存失败:'+err);
                console.log(err);
            })
        } catch (error) {
            /* 如果有过期就会抛出错误，在catch中return false */
            console.log('login--需重新登录: ', error)
            return false
        }
    }

    /**
     * 发起登录操作，登录状态无效时调用
     * 
     * @private
     * @memberof LoginService
     */
    private async doLogin(loginstr?:String) {
        return new Promise(async (resolve, reject) => {
            try {
                const loginResult = await wxm.login() as ILoginResult
                const { code } = loginResult
                let userInfoResult: IUserInfoResult;
                var urlresule = getCurrentPageUrl();
                try {
                    // 获取用户信息
                    userInfoResult = await wxm.getUserInfo();
                    this.loginInfo(code,userInfoResult,loginstr||urlresule).then(()=>{
                        resolve();
                    });
                } catch (e) {
                    //如果没有授权登录，则跳转到授权登录页面，手动点击登录
                    if( getCurrentPages()[0].__route__ !=='pages/login-page/login-page'){
                        reject(e);
                        wx.redirectTo({
                            url: '/pages/login-page/login-page?redirectUrl='+ encodeURIComponent('/' + urlresule),
                        })
                        return false;
                    }

                    wxm.getSetting({
                        success: async (res)=>{
                            if (res.authSetting['scope.userInfo']) {
                                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                                wxm.getUserInfo({
                                success: function(res) {
                                    userInfoResult = res.userInfo ;
                                    this.loginInfo(code,userInfoResult,loginstr||urlresule).then(()=>{
                                        resolve();
                                    },(e:any)=>{
                                        reject(e);
                                    });
                                }
                                })
                            }else{
                                reject(e);
                            }
                        
                        }
                    });
                }
            } catch (error) {
                console.error('调用登录失败:', error)
                setTimeout(() => {
                    reject(error);
                }, 500);
            }
        });
    }

    async loginInfo(code:any,userInfoResult:any,loginstr:any){
        return new Promise(async (resolve, reject) => {
        const { rawData, signature, encryptedData, iv } = userInfoResult

            const apiResult = await apiService.get({
                url: '/api/weapp/auth/login',
                data: {
                    code,
                    rawData,
                    signature,
                    encryptedData,
                    iv,
                },
            })
            if (apiResult && apiResult.state && apiResult.state.code === 0) {
                const { sid, miniSessionKey, expires, userInfo: { userId } } = apiResult.data

                if (sid && expires) {
                    setStorage(this.SID_STORAGE_KEY, sid, expires)
                    setStorage(this.MINISESSION_STORAGE_KEY, sid, expires)
                    setStorage(this.USERID_STORAGE_KEY, userId, expires)
                    
                    global.isLogined = true;
                    resolve();
                    
                } else {
                    reject(Error(`授权登录失败！sid=${sid} expires=${expires}`));
                }
            } else if (apiResult.state) {
                reject(Error('调用授权登录接口失败！ msg:' + apiResult.state.msg));
            }
        });
    }
}



export const loginService = new LoginService()
