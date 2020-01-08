import React from 'react';
import { connect } from 'react-redux';
import { saveActiveImage, updateImageList, pushImage } from '../../../../actions/short-knowledge';
import { uploadImage, getStsAuth } from '../../../../actions/common';
import Detect from 'components/detect';
import { imgUrlFormat } from 'components/util';

const reducer = state => {
    return {
        resourceList: state.shortKnowledge.resourceList || [],
        activeImage: state.shortKnowledge.activeImage,
    }
}

const actions = {
    saveActiveImage,
    updateImageList,
    getStsAuth,
    uploadImage,
    pushImage
}

class ImgBar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isShowMask: false,
            // 是否使用微信上传图片
            wxSelectImage: Detect.os.weixin && Detect.os.phone
        }
    }

    data = {
        imageFormatsAllow: ['jpeg', 'jpg', 'png', 'bmp', 'gif'], //上传图片的格式
    }

    componentWillMount(){
        
    }

    componentDidMount(){
        this.initStsInfo()
        this.props.whereShowAddImageBtn()
    }

    // oss上传
	initStsInfo() {
		this.props.getStsAuth();
		const script = document.createElement('script');
		script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
		document.body.appendChild(script);
    }

    // 图片选择之后的处理
    imageHandler = async(e) => {
        let remain = 12 - this.props.resourceList.length
        if(e.target.files.length > remain){
            window.toast(`剩余可上传${remain}张图片！`)
            return
        }
        window.loading(true)
        const result = await this.uploadImageList(e.target.files)
        window.loading(false)
        let {big, err, list} = result
        let length = this.props.resourceList && this.props.resourceList.length
        let sort = length > 0 ? this.props.resourceList[length - 1].sort + 1 : 1
        let upload = []
        list.forEach((i, d) => {
            upload.push({
                sort: sort + d,
                type: 'image',
                content: i,
                id: Math.floor(Math.random()*1000000),//id为随机数字，用于本地操作的唯一标识
            })
        })
        let toast = ''
        big > 0 && (toast += `${big}张图片大于5M  `)
        err > 0 && (toast += `${err}张图片上传失败`)
        toast &&  window.toast(toast)
        this.props.pushImage(upload)
        // 判断添加图片按钮出现在列表外还是在列表内
        this.props.whereShowAddImageBtn()
        // 将上传的图片的第一张显示在滚动区域内
        let allImg = document.querySelectorAll('.img-container')
        this.showCurrentImage(allImg[length], 100)
    }

    uploadImageList = async(imageList) => {
        let i = 0
        let list = []
        let big = 0
        let err = 0
        return new Promise(async(resolve) => {
            while(i < imageList.length){
                const result = await this.props.uploadImage({file: imageList[i], needTip: false, needLoading: false})
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
    
    // 选择图片
    selectImage = (i, d)=>{
        if(i.active){
            return
        }
        this.props.updateImageList('update', d)
        // store存储当前选中的图片链接，用于别的组件使用
        this.props.saveActiveImage({...i, active: true})
        // this.showCurrentImage()
    }

    // 判断当前图片列表的滚动条高度是否为0
    get isShowMask(){
        let ele = document.querySelector('.mg-bar-container')
        return ele && ele.scrollTop != 0
    }

    // 滚动处理
    scrollHandler(e){
        this.setState({isShowMask: e.currentTarget.scrollTop > 10})
    }

    // 将选中的图片显示在页面上
    showCurrentImage = (ele, time) => {
        let timeout = setTimeout(_=>{
            (ele || document.querySelector('.img-container.active')).scrollIntoView()
            clearTimeout(timeout)
        }, time || 0)
    }

    wxUploadImage = (e) => {
        console.log(this.state.wxSelectImage)
        if(!this.state.wxSelectImage){
            return
        }
        let remain = 12 - this.props.resourceList.length
        let count = remain > 9 ? 9 : remain
        wx.chooseImage({
            count,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: async (res) => {
                let localIds = [...res.localIds];
                let serverIds = await this.wxImgUpload(res.localIds);
                let length = this.props.resourceList && this.props.resourceList.length
                let sort = length > 0 ? this.props.resourceList[length - 1].sort + 1 : 1
                let imgItems = serverIds.map((serverId,d) => {
                    return {
                        type: 'image',
                        sort: sort + d,
                        id: Math.floor(Math.random()*1000000),//id为随机数字，用于本地操作的唯一标识
                        resourceId: serverId,
                        wxlocalId: localIds[d]
                    }
                })
                this.props.pushImage(imgItems)
                // 判断添加图片按钮出现在列表外还是在列表内
                this.props.whereShowAddImageBtn()
                // 将上传的图片的第一张显示在滚动区域内
                let allImg = document.querySelectorAll('.img-container')
                this.showCurrentImage(allImg[length], 100)
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
        while (localIds.length > 0){
	        let loaclUrl = localIds.shift();
            window.loading(true);
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
						window.loading(false);
						resolve();
					}
				});
			})
        }
        return serverIds;
	};

    render(){
        let imageAcceptArr = this.data.imageFormatsAllow.map(format => `image/${format}`).join(',')
        let { showAddImageOutside, resourceList } = this.props
        let { wxSelectImage } = this.state
        return (
            <div className={`img-bar-container${this.state.isShowMask ? ' move' : ''}`}>
                <div className="img-list" onScroll={this.scrollHandler.bind(this)}>
                    {
                        this.props.resourceList.map((i,d)=>{
                            return (
                                <div className={`img-container${i.active ? ' active' : ''}`} key={`i-${d}`} onClick={this.selectImage.bind(null, i, d)}>
                                    <div className="img">
                                        <img src={i.content ? imgUrlFormat(i.content, '?x-oss-process=image/resize,m_fill,limit_0,h_140,w_140') : i.wxlocalId} alt=""/>
                                    </div>
                                    <span className="index">{d+1}</span>
                                </div>
                            )
                        })
                    }
                    {
                        showAddImageOutside == 'N'? 
                        <div className="add-image on-log"
                            data-log-region="ppt-edit"
                            data-log-pos="insert"
                            data-log-name="添加图片"
                            onClick={this.wxUploadImage}
                        >
                            <span className="icon_plus"></span>
                            <span className="label">{this.props.resourceList.length < 12 ? '添加图片' : '已满12张'}</span>
                            {
                                (!wxSelectImage && resourceList.length < 12) ? <input type="file" accept="image/*" onChange = {this.imageHandler} multiple /> : null
                            }                 
                        </div> : null
                    }
                </div>
                {
                    showAddImageOutside == 'Y'? 
                    <div className="add-image out on-log"
                        data-log-region="ppt-edit"
                        data-log-pos="insert"
                        data-log-name="添加图片"
                        onClick={this.wxUploadImage}
                    >
                        <span className="icon_plus"></span>
                        <span className="label">{this.props.resourceList.length < 12 ? '添加图片' : '已满12张'}</span>
                        {
                            (!wxSelectImage && resourceList.length < 12) ? <input type="file" accept="image/*" onChange = {this.imageHandler} multiple /> : null
                        }                 
                    </div> : null
                }
            </div>
        )
    }
}

export default connect(reducer, actions)(ImgBar)

