
/**
 * 图片上传组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import {
    initStsAuth,
    uploadImage,
} from '../../../../actions/common';

import FileInput from 'components/file-input';

@autobind
class ImageUploader extends Component {
    state = {
        // 上传成功的图片URL
        imgUrlUploaded: '',
    }

    /**
     * 处理图片上传
     */
    handleImageUpload(e){
        const {formatsAllow, maxSize, stsAuth, callback} = this.props;
        const file = e.target.files[0];
        typeof _qla != 'undefined' && _qla('click', {
            region:'upload-camp-bg',
        });
        uploadImage(file, stsAuth, maxSize, 'camp').then((uploadImageUrl) => {
            this.setState({
                imgUrlUploaded: uploadImageUrl
            });
            // 回调函数调用
            if (typeof callback === 'function') {
                callback(uploadImageUrl);
            }
        });
    }

    /**
     * OSS上传初始化
     */
    initStsInfo() {
        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
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
        // 初始化stsAuth上传信息
        this.initStsInfo();
        this.props.initStsAuth();
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
        return (
            <div className={classnames("co-image-uploader", customClass)}>
                <FileInput
                    className='co-image-uploader-input'
                    accept='image/*'
                    onChange={this.handleImageUpload}
                />
                {
                    imgUrlUploaded ?
                        // 已上传图片预览区域
                        <div className="co-image-uploader-preview">
                            <img className="preview-image" src={`${this.state.imgUrlUploaded}@250h_400w_1e_1c_2o`} alt="上传图片预览" />
                            <div className="preview-tip">上传尺寸({`${width}*${height}`})</div>
                        </div>
                    :
                        // 图片上传操作区域
                        <div className="co-image-uploader-workarea">
                            <div>
                                <div className="placeholderImage">
                                {
                                    placeholderImage ?
                                        <img className="placeholder-image" src={placeholderImage} alt="图片上传" />
                                    : 
                                        <span className="icon-placeholder icon_pictures"></span>
                                }
                                </div>
                                <div className="upload-tip">{tip}</div>
                                <div className="aspect-ratio">{`(${width}*${height})`}</div>
                            </div>
                        </div>
                }
            </div>
        )
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
    initStsAuth,
}

export default connect(mapStateToProps, mapActionToProps)(ImageUploader);