import React, { Component } from 'react';
import { uploadImage, getStsAuth, uploadVideo ,dataURLtoBlob, cleanVideoUploadStatus } from '../../actions/common';
import { pushImage, uploadData } from '../../actions/short-knowledge';
import { connect } from 'react-redux';
import { collectVisible } from 'components/collect-visible';
import Page from 'components/page';
import {MiddleDialog} from "components/dialog";
import { locationTo, getVal } from 'components/util';
import { share } from "components/wx-utils";
import { request } from 'common_actions/common';
import Detect from 'components/detect';
import {fillParams} from 'components/url-utils';

// import { getDomainUrl } from "../../actions/common";

class Create extends Component {
    state = {
        showDialog: false,

        liveList: [],
        curLive: {},
        knowledgeId: (this.props.location.query.id || this.props.location.query.knowledgeId)||'',
        // 需要编辑的数据
        editData: {},
        // 上传进度
        uploadProgress: 0,
        showProgress: false,
        // 是否使用微信上传图片
        wxSelectImage: Detect.os.weixin && Detect.os.phone,
        showPicStyle:false,
    }

    data = {
        imageFormatsAllow: ['jpeg', 'jpg', 'png', 'bmp', 'gif'], //上传图片的格式
        videoFormatsAllow: ['3gp', 'avi', 'flv', 'mp4', 'mpg', 'asf', 'wmv', 'mkv', 'mov', 'webm'], //上传的视频格式
    }

    componentWillMount(){
        // 清空视频上传状态，用于解决上传视频后由发布页后退回创建页的报错
        this.props.cleanVideoUploadStatus()
    }

    componentDidMount() {
        this.checkDate();
        this.initVideoPlayer();
        this.initStsInfo();
        // this.getDomainUrl();

        // 上传需要使用的oss sdk
        const scriptSrc = [
            '//gosspublic.alicdn.com/aliyun-oss-sdk.min.js',
            '//static.qianliaowang.com/video-admin/aliyun-sdk.min.js',
            '//static.qianliaowang.com/video-admin/vod-sdk-upload-1.0.6.min.js',
        ];

        scriptSrc.forEach((val, index) => {
            const script = document.createElement('script')
            script.src = val
            document.body.appendChild(script)
        })

        this.initLiveList();  
        this.initShare();
        this.initData();   
    }


    /**
     * 6月1号-6月6号敏感时期，屏蔽PPT方式
     *  
     * @memberof Create
     */
    checkDate() {
        let mounth = new Date(this.props.sysTime).getMonth() + 1;
        let day = new Date(this.props.sysTime).getDate();

        console.log('mounth:',mounth,"day:",day)
        if (!(mounth == 6 && day < 7)) {
            this.setState({
                showPicStyle:true
            })
        }        
    }

    initData = async() => {
        // 如果有id，表示审核不通过的
        if(this.state.knowledgeId){
            request.post({
                url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/getKnowledgeById',
                body: { id: this.state.knowledgeId }
            }).then(res => {
                if(res.state.code !== 0){
                    throw new Error(res.state.msg)
                }
                this.setState({editData: getVal(res, 'data.dto')})
            }).catch(err => {
                window.toast(err.message);
            })
        }
    }

    // 初始化分享
    initShare(){
        this.shareOption = {
            title: '快来发布你的知识小视频吧！',
            desc: '照片配上语音和音乐，轻松制作有声小视频～',
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/shortKnowledge.png',
            shareUrl: window.location.href.split('?')[0],
            successFn: () => {
                
            }
        };
        share(this.shareOption);
    }

    // 隐藏播放器，用于截图
    initVideoPlayer() {
        this.videoPlayer = document.createElement("VIDEO");
        this.videoPlayer.volume = 0;
        this.videoPlayer.playsInline = "true";

        // 测试使用的代码，保留
        // this.videoPlayer.style.position = "absolute";
        // this.videoPlayer.style.left = "0";
        // this.videoPlayer.style.top = "50%";
        // this.videoPlayer.style.zIndex = "999";
        // this.videoPlayer.controls = true;
        // window.document.body.appendChild(this.videoPlayer)
        let touchHandle = (e) => {
            try {
                window.removeEventListener("touchstart",touchHandle)
                this.videoPlayer.play();
            } catch (error) {
                
            }
            return false;
        }

        // 手机不能自动播放
        window.addEventListener("touchstart", touchHandle);
    }


    wxUploadImage = (e) => {
        if(!this.state.wxSelectImage){
            return
        }
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: async (res) => {
                let localIds = [...res.localIds];
                this.setState({showProgress: true})
                let serverIds = await this.wxImgUpload(res.localIds);
                let imgItems = serverIds.map((serverId,d) => {
                    return {
                        type: 'image',
                        sort: d + 1,
                        id: Math.floor(Math.random()*1000000),//id为随机数字，用于本地操作的唯一标识
                        resourceId: serverId,
                        wxlocalId: localIds[d]
                    }
                })
                sessionStorage.setItem('resourceList', JSON.stringify(imgItems))
                this.jump()
            },
            cancel:  (res) => {
                console.log(res);
            },
            fail: (res) => {
                console.log(res);
            },

        });
    }

    async wxImgUpload(localIds) {
        let serverIds = [];
        let length = localIds.length
        let i = 0
        while (i < length){
	        let loaclUrl = localIds[i];
            // window.loading(true);
			await new Promise((resolve, reject) => {
				wx.uploadImage({
					localId: loaclUrl,
					isShowProgressTips: 0,
                    success: async (res) => {
                        serverIds.push(res.serverId);
						resolve();
					},
					fail: (res) => {
						window.toast("部分图片上传失败，请重新选择");
						reject();
					},
					complete: (res) => {
						// window.loading(false);
						resolve();
					}
				});
            })
            this.setState({
                uploadProgress: (i + 1)/length * 100,
            })
            i++
        }
        return serverIds;
	};

    componentDidUpdate(props){
        if(props.videoStatus === 'uploaded'){
            if(this.videoData){
                let { bucket, object, file, url} = this.videoData;
                let data = {
                    id: this.state.knowledgeId,
                    liveId: getVal(this.state, 'curLive.id', ''),
                    knowledgeId: this.state.knowledgeId,
                    type: 'shortVideo',
                    // 阿里云截桢
                    coverImage: this.coverImage,    
                    resourceList: [
                        {
                            content: bucket + ',' + object,
                            sort: 1,
                            resourceId: this.props.videoAuth.videoId,
                            fileSize: file.size,
                            fileName: file.name,
                            type: 'video',
                            url: bucket + ',' + object,
                        }
                    ]
                }
                // 如果是重新上传视频的，需要保留除了resourceList以外的全部
                if(this.state.knowledgeId){
                    data = Object.assign({}, {...data}, {...this.state.editData}, {resourceList: data.resourceList})
                }
    
                this.props.uploadData(data)
                let liveId = getVal(this.state, 'curLive.id', '')
                let id = getVal(this.state, 'knowledgeId', '')
                let businessId = this.props.location.query.businessId;
                let businessType = this.props.location.query.businessType;
                let _url = fillParams({liveId, id, businessId, businessType}, '/wechat/page/short-knowledge/publish')
                this.props.router.push(_url)
            }
           
        }
    }
    initLiveList(){
        // 获取直播间列表
        request.post({
            url: '/api/wechat/transfer/h5/live/findLiveEntity',
            body: {
                liveId: this.props.location.query.liveId,
                type: 'creater',
                page: {
                    size: 999,
                    page: 1,
                }
            }
        }).then(res => {
            this.setState({liveList: this.state.liveList.concat(res.data.liveEntityPos || [])})
        }).catch(err => {
        }).then(() => {
            request.post({
                url: '/api/wechat/transfer/h5/live/findLiveEntity',
                body: {
                    liveId: this.props.location.query.liveId,
                    type: 'manager',
                    page: {
                        size: 999,
                        page: 1,
                    }
                }
            }).then(res => {
                this.setState({liveList: this.state.liveList.concat(res.data.liveEntityPos || [])},()=>{
                    this.getCurrentLiveId();
                })
            }).catch(err => {})
        }) 
    }

    getCurrentLiveId (){
        let curLiveId = this.props.location.query.liveId;
        let curLive;
        this.state.liveList.find(item => {
            if (item.id == curLiveId) {
                curLive = item;
                return true;
            }
        });
        if (!curLive) {
            curLive = this.state.liveList[0];
            curLive && (curLiveId = curLive.id);
        }
        this.setState({
            curLive,
        },()=>{
            collectVisible();
        });
    }

    // oss上传
	initStsInfo() {
		this.props.getStsAuth();
		const script = document.createElement('script');
		script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
		document.body.appendChild(script);
	}

    // 视频选择之后的处理
    videoHandler = async(e) => {
        e.persist();
        let file = e.target.files[0];

        // 未上传任何文件时，取消操作并隐藏进度条
        if (!file) {
            this.setState({
                showProgress: false,
            });
            return;
        }

        let liveId = getVal(this.state, 'curLive.id', '')
        this.setState({showProgress: true})

        // 上传的视频时长不超过5分钟（采用宽松限制，阈值应+1s）
        const timeMax = 5 * 60 + 1;
        let fileObj = await this.props.uploadVideo(file, liveId, timeMax, {
            videoPlayer: this.videoPlayer,
            onProgress: (progress) => {
                this.setState({uploadProgress: progress})
            }
        })

        // 若上传被拒绝（一般被认为是时长超出限制），则提示用户并清空文件列表（还原初始状态）
        if(!fileObj){
            e.target.value = [];
            // 重置视频src以保证每次上传为最新
            this.videoPlayer.setAttribute('src', '');
            this.setState({
                showDialog: true,
                showProgress: false
            })
            return
        }

        let canvas = document.createElement('canvas');

        // 获取并设置本地播放地址
        if (Detect.os.ios) {
            // 部分iphone使用FileReader会内存溢出
            this.videoPlayer.src = URL.createObjectURL(file);
        } else {
            let frd = new FileReader();
            frd.onload = (e) => {
                this.videoPlayer.src = e.target.result;
            };
            frd.readAsDataURL(file);
        }
        

        // 视频播放后截屏
        let playingHandle = async (e) => {
            try {
                this.videoPlayer.removeEventListener("playing",playingHandle)
                this.videoWidth = this.videoPlayer.videoWidth;
                this.videoHeight = this.videoPlayer.videoHeight;
                canvas.width = this.videoWidth;
                canvas.height = this.videoHeight;

                let ctx = canvas.getContext("2d");
                ctx.drawImage(this.videoPlayer, 0, 0, this.videoWidth, this.videoHeight);
                let resultFile = dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.5));
                resultFile = new File([resultFile], 'temp.jpg', {
                    type: 'image/jpeg',
                });

                this.videoPlayer.pause();
                let imgUpload = await this.props.uploadImage({file: resultFile ,needTip: false, needLoading: false});

                

                this.coverImage = imgUpload;
                
            } catch (error) {
                throw error;
            }
        }

        this.videoPlayer.addEventListener('playing', playingHandle);

        this.videoPlayer.play();
        this.videoData = fileObj.options.uploadList[0];

        
        // 清除页面缓存
        this.clearStroge()
        
    }

    // 图片选择之后的处理
    imageHandler = async(e) => {
        if(e.target.files.length > 12){
            window.toast('最多上传12张图片，请重新选择')
            return
        }
        // 清除页面缓存
        this.clearStroge()
        this.setState({showProgress: true})
        const result = await this.uploadImageList(e.target.files)
        let {big, err, list} = result
        let upload = []
        list.forEach((i, d) => {
            upload.push({
                sort: d + 1,
                id: Math.floor(Math.random()*1000000),//id为随机数字，用于本地操作的唯一标识
                type: 'image',
                content: i
            })
        })
        sessionStorage.setItem('resourceList', JSON.stringify(upload))
        let toast = ''
        big > 0 && (toast += `${big}张图片大于5M  `)
        err > 0 && (toast += `${err}张图片上传失败`)
        this.jump(toast)
    }

    // 图片上传之后页面跳转
    jump = (toast = '') => {
        let liveId = getVal(this.state, 'curLive.id', '')
        let businessId = this.props.location.query.businessId;
        let businessType = this.props.location.query.businessType;
        let url = fillParams({liveId, businessId, businessType}, '/wechat/page/short-knowledge/ppt-edit')
        if(toast){
            window.toast(toast)
            setTimeout(_=>{
                window.location.href = url
            }, 1500)
        }else {
            window.location.href = url
        }
    }

    uploadImageList = async(imageList) => {
        let i = 0
        let list = []
        let big = 0
        let err = 0
        let length = imageList.length
        return new Promise(async(resolve) => {
            while(i < length){
                const result = await this.props.uploadImage({file: imageList[i], needTip: false, needLoading: false})
                this.setState({
                    uploadProgress: (i + 1)/length * 100,
                })
                if(result === 'tooBig'){
                    ++big
                }else if(result === 'err'){
                    ++err
                }else {
                    list.push(result)
                }
                i++
            }
            resolve({list, big, err})
        })
    }

    // 清除有声PPT页面和发布页面创建的session缓存
    clearStroge = () => {
        let strogeList = ['resourceList', 'totalSecond', 'audioList', 'initData', 'textContent']
        strogeList.forEach(i => {
            sessionStorage.removeItem(i)
        })
    }

    toggleDialog = () => {
        this.setState({showDialog: !this.state.showDialog})
    }

    // 重新上传
    uploadAgain = () => {
        this.toggleDialog()
        setTimeout(_=>{
            let ele = document.querySelector('#upload-video')
            // ele.focus()
            // console.log(ele)
        },10)
    }

    handleSwitchLive = liveId => {
        locationTo(`/wechat/page/live-change?liveId=${liveId}&target=${encodeURIComponent(location.pathname)}`)
    }


    render(){ 
        const { curLive, wxSelectImage } = this.state;
        let imageAcceptArr = this.data.imageFormatsAllow.map(format => `image/${format}`).join(',')
        let videoAcceptArr = this.data.videoFormatsAllow.map(format => `video/${format}`).join(',')

        return (
            <Page title="制作短知识" className="short-knowledge-create">
                {
                    !!(!this.props.location.query.liveId && curLive && curLive.id) &&
                    <div className="switch-live">
                        <div className="title">当前直播间：{curLive.name}</div>
                        <div className="desc">(创建后将在所选的直播间主页展示)
                            <button className="btn-switch-live on-log on-visible"
                                data-log-region="short-create"
                                data-log-pos="change-room"
                                data-log-name="切换直播间"
                                onClick={() => this.handleSwitchLive(curLive.id)}
                            >切换直播间<i className="icon_changethis"></i></button>
                        </div>
                    </div>
                }

                {/* 链接上有id的表示视频审核未通过需要重新编辑，所以要屏蔽上传照片的入口 */}
                {
                    this.state.showPicStyle && (this.props.location.query.id || this.props.location.query.knowledgeId) ? null :
                    <div className="list on-log on-visible"
                        data-log-region="short-upload"
                        data-log-pos="image"
                        data-log-name="上传照片"
                        onClick = {this.wxUploadImage}
                    >
                        <img src={require('./img/icon-upload-picture.png')} alt=""/>
                        <div className="middle-content">
                            <p className="title">上传照片</p>
                            <p className="tip">制作有声PPT，可为图片配音（配音不超过<em>60秒</em>）</p>
                        </div>
                        <span className="icon-enter"></span>
                        {
                            wxSelectImage ? null : 
                            <input id="upload-image" type="file" accept="image/*"  onChange = {this.imageHandler} multiple />
                        }
                    </div>
                }
                <div className="list on-log on-visible"
                        data-log-region="short-upload"
                        data-log-pos="video"
                        data-log-name="上传小视频">
                    <img src={require('./img/icon-upload-video.png')} alt=""/>
                    <div className="middle-content">
                        <p className="title">上传小视频</p>
                        <p className="tip">从手机上传视频（视频不超过<em>5分钟</em>）</p>
                    </div>
                    <span className="icon-enter"></span>
                    <input id="upload-video" type="file" accept="video/*" onChange={this.videoHandler} />
                </div>

                <div className="btn-example" onClick={()=>locationTo("https://m.qlchat.com/wechat/page/short-knowledge/video-list?liveId=100000081018489")}>看看短知识怎么拍</div>
                {/* 讲师协议 */}
                <MiddleDialog
                    className="create-tip-dialog"
                    show={this.state.showDialog}
                    theme="empty"
                    onClose={this.toggleDialog}
                >
                    <div className="tip">视频超过5分钟<br/>请编辑好再上传</div>
                    <div className="upload-again" onClick={this.uploadAgain}>重新上传</div>
                    <div className="give-up" onClick={this.toggleDialog}>放弃</div>
                </MiddleDialog>
                {/* 上传进度显示 */}
                {
                    this.state.showProgress ? 
                    <div className="upload-progress-dialog">
                        <div className="upload-progress">
                            <img className="loading" src={require('./img/loading.png')} alt=""/>
                            <span>上传中{Number(this.state.uploadProgress).toFixed(0)}%</span>
                        </div>
                    </div> : null
                }
            </Page>
        )
    }
}

export default connect(state => ({
    duration: state.common.duration,
    videoAuth: state.common.videoAuth,
    videoStatus: state.common.videoStatus,
    sysTime: state.common.sysTime,
}), {
    uploadImage,
    getStsAuth,
    uploadVideo,
    pushImage,
    uploadData,
    cleanVideoUploadStatus,
})(Create)
