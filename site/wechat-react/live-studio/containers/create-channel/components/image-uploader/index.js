
/**
 * 图片上传组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { imgUrlFormat } from 'components/util';


import {
    uploadImage,
    getStsAuth,
} from '../../../../actions/common';

@autobind
class ImageUploader extends Component {
    state = {
        // 上传成功的图片URL
        imgUrlUploaded: '',
    }

    /**
     * 处理图片上传
     */
    async handleImageUpload(event){
        const file = event.target.files[0]
        event.target.value = '';
        try {
            const filePath = await this.props.uploadImage(file,"topicHead");
            if (filePath) {
                this.setState({
                    imgUrlUploaded : filePath
                })
                // 回调函数调用
                if (typeof this.props.callback === 'function') {
                    this.props.callback(filePath);
                }
            }


        } catch (error) {
            console.log(error);
        }
    }

    // oss上传初始化
    initStsInfo() {
        // if(!(Detect.os.weixin && Detect.os.ios)){
            const script = document.createElement('script');
            script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
            document.body.appendChild(script);
        // }
    }

    componentWillReceiveProps(nextProps){
        const {previewImageUrl} = nextProps;
        if (previewImageUrl) {
            this.setState({
                imgUrlUploaded: previewImageUrl
            });
        }
    }

    componentDidMount(){
        this.props.getStsAuth();//初始化oss的auth
        this.initStsInfo();
    }

    render(){
        const {
            customClass,
            placeholderImage,
            tip,
            width,
            height,
            callback,
            formatsAllow,
            maxSize,
        } = this.props;
        const {imgUrlUploaded} = this.state;
        const acceptAttr = formatsAllow.map((format) => {
            return `image/${format}`;
        }).join(',');
        return [
            <div className={classnames("co-image-uploader", customClass)}>
                <div className={`hidden-input`}>
                    <input type="file" className={`co-image-uploader-input`} accept={acceptAttr} onChange={this.handleImageUpload} />
                </div>
                <div className="explanation">
                    <span className={`label${this.props.optimize ? ' optimize-tip-pao' : ''}`}>设置头图<i className="example on-log" data-log-region="channel_cover_example" onClick={this.props.openExample}>示例</i> </span>
                    {this.props.optimize && 
                    <div className="optimize-tip">当前默认封面，建议上传新封面或者使用
                    <br /> 
                        <span className="style-tips" onClick = {this.props.showStyleTips}>在线头图设计</span> 
                    ，操作简单，点示例查看</div>}
                </div>
                {
                    imgUrlUploaded ?
                        // 已上传图片预览区域
                        <div className="co-image-uploader-preview">
                            <div className="preview-image" style={{backgroundImage: `url(${this.state.imgUrlUploaded})`}}></div> 
                        </div>
                    :
                        // 图片上传操作区域
                        <div className="co-image-uploader-workarea">
                            <div className="tip">建议尺寸：800 x 500</div>
                        </div>
                }
                
            </div>
            
        ]
    }
}

ImageUploader.propTypes = {
    // 自定义的组件类名
    customClass: PropTypes.string,
    // 占位图的路径
    placeholderImage: PropTypes.string,
    // 提示文字
    tip: PropTypes.string,
    // 上传图片的宽度
    width: PropTypes.number,
    // 上传图片的高度
    height: PropTypes.number,
    // 组件回调函数
    callback: PropTypes.func,
    // 允许的图片格式
    formatsAllow: PropTypes.array,
    // 上传图片的最大值(以M为单位)
    maxSize: PropTypes.number,
    // 预览图的路径URL, 这个值如果存在，那么组件默认处于预览模式
    previewImageUrl: PropTypes.string,
}

ImageUploader.defaultProps = {
    width: 800,
    height: 500,
    tip: '上传图片',
    formatsAllow: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
    maxSize: 2,
}

const mapStateToProps = (state) => ({
    // stsAuth信息
    stsAuth: state.common.stsAuth,
})

const mapActionToProps = {
    uploadImage,
    getStsAuth,
}

export default connect(mapStateToProps, mapActionToProps)(ImageUploader);