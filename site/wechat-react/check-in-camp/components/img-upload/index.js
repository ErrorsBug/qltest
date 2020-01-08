
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import FileInput from 'components/file-input';
import Detect from 'components/detect';
import {
    uploadImage,
} from 'thousand_live_actions/common';

@autobind
class ImgUpload extends Component {
    
    state = {
        // 是否使用微信上传
        notWx:true,
    }

    componentDidMount() {
        // 上传初始化
        this.initStsInfo();
    }

    // oss上传初始化
    initStsInfo() {
        this.setState({
            notWx : this.props.notWx || (Detect.os.weixin&&Detect.os.phone)
        })

        if (document.getElementById('ali-sts')) {
            return false;
        }
        
        if(!(Detect.os.weixin && Detect.os.ios)){
            const script = document.createElement('script');
            script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
            script.id = 'ali-sts'
            document.body.appendChild(script);
        }
    }

    onSelectImage(e) {
        if (Detect.os.weixin&&Detect.os.phone) {
            this.addImageWx();
        } else {
            this.addImagePc(e);
        }
    }
    
    /**
     * 
     * 添加图片组件PC
     * @param {any} 
     * @returns 
     * @memberof ImgUpload
     */
    async addImagePc(event) {
        const files = event.target.files;
        let count = Object.prototype.toString.call(this.props.count) == "[object Number]" ?  this.props.count : 9;
        if (count == 0) {
            if (Object.prototype.toString.call(this.props.maxCount) == "[object Number]") {
                window.toast('最多只能选择' + this.props.maxCount + '张图片');
            } else {
                window.toast('图片数量已达最大限制');
            }
            return false;
        }
        if (files.length > count) {
            window.toast('最多还能选择' + count + '张图片');
            return false;
        }

        let filesUploadTask = [];
        Array.prototype.forEach.call(files, (f) => {
            filesUploadTask.push(this.props.uploadImage(f,this.props.finder||"camp"));
        });
        event.target.value = '';
        
        
        try {
            let imgLinks = await Promise.all(filesUploadTask);
            imgLinks = imgLinks.filter(url =>{
                return url && url
            })
            // 可能所有图片超过大小限制
            if (imgLinks.length < 1) {
                return false;
            }
            let imgItems = await imgLinks.map(item => {
                return {
                    type: 'image',
                    url: item,
                }
            })
            this.props.uploadHandle && this.props.uploadHandle(imgItems);
        } catch (error) {
            console.log(error)
        }
        
        


    }

    /**
     * 
     * 添加图片组件WX
     * @param {any} index 
     * @returns 
     * @memberof ImgUpload
     */
    addImageWx() {
        let count = Object.prototype.toString.call(this.props.count) == "[object Number]" && count <= 9 && count >= 0 ?  this.props.count : 9;
        if (count == 0) {
            if (Object.prototype.toString.call(this.props.maxCount) == "[object Number]") {
                window.toast('最多只能选择' + this.props.maxCount + '张图片');
            } else {
                window.toast('图片数量已达最大限制');
            }
            return false;
        } 

        wx.chooseImage({
            count: count||9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: async (res) => {
                
                let localIds = [...res.localIds];
                let serverIds = await this.wxImgUpload(res.localIds);
                let imgItems = serverIds.map((serverId,idx) => {
                    return {
                        type: 'imageId',
                        serverId: serverId,
                        localId:localIds[idx]
                    }
                })
                this.props.uploadHandle && this.props.uploadHandle(imgItems);
                

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



    render() {
        return (
            <div className='img-upload-btn'
                onClick={this.state.notWx ? this.onSelectImage : () => { }}
            >
                {this.props.children}
                {
                    !this.state.notWx &&
                    <div className='media-file-uploader'>
                        <FileInput
                            className='media-file-input'
                            onChange={this.onSelectImage}
                            accept='image/jpg,image/jpeg,image/png,image/gif,image/bmp'
                            multiple ={ this.props.multiple || 'false'}
                        />
                    </div>
                }
            </div>
        );
    }    
};

ImgUpload.propTypes = {
};

function mapStateToProps (state) {
    return {
        
    }
}

const mapActionToProps = {
    uploadImage,
}

export default connect(mapStateToProps, mapActionToProps)(ImgUpload);
