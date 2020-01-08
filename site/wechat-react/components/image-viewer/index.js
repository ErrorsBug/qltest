import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';

import { imgUrlFormat } from '../util';
import Detect from '../detect';

@autobind
class ImageViewer extends PureComponent {
    data = {
        // 图片原始大小
        imgWidth: 0,
        imgHeight: 0,

        // 最小显示宽度
        minScaleWidth: 0,
        // 最大显示宽度
        maxScaleWidth: 0,
        // 是否处理缩放状态
        isScaling: false,
        // 是否拖动
        isMouseMoving: false,
    }

    state = {
        // 图片预览是否打开
        isImageViewerActive: false,
        // 图片地址
        imgUrl: '',
        // 图片显示宽度
        imgWidth: 0,
        // 图片显示高度
        imgHeight: 0,
        // 外边距
        marginLeft: 'auto',
        marginTop: 'auto',
    }

    componentDidMount() {
        // this.initScaleLimit();
        // this.initImageSizeIfComplete();
        // this.initImageEvts();
    }

    // 暴露给外部方法，打开图片预览
    // url -当前预览的图片地址
    // urls -所有可预览图片地址列表（仅当在手机微信中生效）
    show(url, urls) {
        if (!url) {
            return;
        }
        // 手机平台且为微信平台时使用微信sdk(非ios手机不支持base64)
        if (Detect.os.phone && Detect.os.weixin && !(url.indexOf('data:image') >= 0 && !Detect.os.ios)) {
            typeof wx != 'undefined' && wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: urls || [] // 需要预览的图片http链接列表
            });
        // 使用自定义预览模式
        } else {
            this.setState({
                imgWidth: 0,
                imgHeight: 0,
            });

            this.initScaleLimit();
            this.setState({
                isImageViewerActive: true,
                imgUrl: url,
            });

            setTimeout(() => {
                this.initImageSizeIfComplete();
                this.initImageEvts();
            }, 0);
        }
    }

    close() {
        this.handleCloseImageViewer();
    }

    // 关闭图片预览
    handleCloseImageViewer(e) {
        this.setState({
            isImageViewerActive: false,
        });
    }

    // 根据屏幕环境初始化放大参数
    initScaleLimit() {
        let availWidth = this.refs.imageViewer.offsetWidth || document.getElementById('app').offsetWidth;

        this.data.minScaleWidth = availWidth / 5;
        this.data.maxScaleWidth = availWidth * 3;
    }

    // 初始化图片显示大小(解决加载过图片不执行onloa回调的问题)
    initImageSizeIfComplete() {
        if (!this.state.isImageViewerActive) {
            return;
        }

        let imgDom = findDOMNode(this.refs.image);

        if (imgDom.complete) {
            this.initImageSize();
        }
    }

    // 初始化图片大小
    initImageSize() {
        let imgDom = this.refs.image;
        let imgWidth = imgDom.width;
        let imgHeight = imgDom.height;

        let imgNewWidth = imgWidth * window.dpr;
        let imgNewHeight = imgHeight * window.dpr;

        this.data.imgWidth = imgWidth;
        this.data.imgHeight = imgHeight;

        let defaultWidth = this.refs.imageViewer.offsetWidth - 60 * window.dpr;
        if (imgNewWidth > defaultWidth) {
            imgNewWidth = defaultWidth;
        }

        imgNewHeight = imgHeight * imgNewWidth / imgWidth;

        this.setState({
            imgWidth: imgNewWidth,
            imgHeight: imgNewHeight,
            marginLeft: imgNewWidth / 2,
            marginTop: imgNewHeight / 2,
        });
    }

    // 图片加载完初始化图片显示大小
    handleImageLoad(e) {
        this.initImageSize();
    }

    updateImageSize(width) {
        if (width < this.data.minScaleWidth) {
            width = this.data.minScaleWidth;
        }

        if (width > this.data.maxScaleWidth) {
            width = this.data.maxScaleWidth;
        }

        let height = this.data.imgHeight * width / this.data.imgWidth;

        this.setState({
            imgWidth: width,
            imgHeight: height,
            marginLeft: width / 2,
            marginTop: height / 2,
        });
    }

    updateImageMargin(left, top) {
        this.setState({
            marginLeft: left,
            marginTop: top,
        });
    }

    // 初始化事件
    initImageEvts() {
        // pc鼠标滑轮缩放
        this.bindMouseScrollEvts();

        // 双指缩放
        this.bindScaleEvts();

        // 拖动移动图片位置
        setTimeout(() => {
            this.bindMouseMoveEvts();
        }, 0);
    }

    // 手指双指进行图片缩放
    bindScaleEvts() {
        let touchStartTime;
        let touchTarget;
        let distance;

        this.data.isScaling = false;

        // 手指触屏时间小于200ms时，直接作为关闭事件处理
        let touchStartFn = (e) => {
            // e.preventDefault();
			e.stopPropagation();
			touchStartTime = Date.now();
			touchTarget = e.target;
        };

        let touchEndFn = (e) => {
			e.preventDefault();
			e.stopPropagation();
			// this.refs.imageViewer.off('touchmove');
			let touchEndTime = Date.now();
			let duration = touchEndTime - touchStartTime;

			if (duration < 200 && (this.refs.bg === touchTarget || this.refs.closeBtn === touchTarget)) {
				this.handleCloseImageViewer();
			}

            this.data.isScaling = false;
            distance = 0;
        };


        let getDistance = (e) => {

			let distX = e.touches[0].pageX - e.touches[1].pageX;
			let distY = e.touches[0].pageY - e.touches[1].pageY;
			let distance = Math.sqrt(distX * distX + distY * distY);

			return distance;
		};

        // 双指拖动时缩放
		let pinchStartFn = (e) => {
			distance = getDistance(e);
            this.data.isScaling = true;
		};

		let pinchMoveFn = (e) => {
            if (!this.data.isScaling) {
                return;
            }
			var dist = getDistance(e);
			var moveDist = dist - distance;

            let newWidth = this.state.imgWidth + moveDist;
			this.updateImageSize(newWidth);
			distance = dist;

			return;
		};

        let _touchStartFn = (e) => {
            if (this.state.isImageViewerActive) {
                if (e.touches.length === 1) {
                    touchStartFn(e);
                }

                if (e.touches.length === 2) {
                    pinchStartFn(e);
                }
            }
            return;
        };

        this.bindEvt(this.refs.imageViewer, 'touchstart', _touchStartFn);
        this.bindEvt(this.refs.imageViewer, 'touchend', touchEndFn);
        this.bindEvt(this.refs.imageViewer, 'touchmove', pinchMoveFn);
    }

    // pc鼠标滑轮滚动进行缩放
    bindMouseScrollEvts() {
        let mouseScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 打开图片预览时可缩放
            if (this.state.isImageViewerActive) {
				let delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
					(e.originalEvent && e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox

                let newWidth;

				if (delta > 0) {
					newWidth = this.state.imgWidth + 50;
				} else if (delta < 0) {
					newWidth = this.state.imgWidth - 50;
				}

                this.updateImageSize(newWidth);
			}
        }

        this.bindEvt(this.refs.imageViewer, 'mousewheel', mouseScroll);
        this.bindEvt(this.refs.imageViewer, 'DOMMouseScroll', mouseScroll);
    }

    // 鼠标拖动时移动图片位置
    bindMouseMoveEvts() {
        let msx;
        let msy;
        let mousedownFn = (e) => {
            // e.preventDefault();
            msx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
            msy = e.clientY || (e.touches && e.touches[0].clientY) || 0;

            this.data.isMouseMoving = true;
            this.data.mousemovingStartMarginLeft = this.state.marginLeft;
            this.data.mousemovingStartMarginTop = this.state.marginTop;
        };

        let mousemoveFn = (e) => {
            if (!this.data.isMouseMoving) {
                return;
            }

            e.preventDefault();
            try {
                let mex = e.clientX || (e.touches && e.touches[0].clientX) || 0;
                let mey = e.clientY || (e.touches && e.touches[0].clientY) || 0;
                this.updateImageMargin(this.data.mousemovingStartMarginLeft - (mex - msx),this.data.mousemovingStartMarginTop - (mey - msy));
                
            } catch (error) {
                console.error(error)
            }
        }

        let mouseupFn = (e) => {
            this.data.isMouseMoving = false;
        };

        if (this.refs.image) {
            this.bindEvt(this.refs.image, 'mousedown', mousedownFn);
            this.bindEvt(this.refs.imageViewer, 'mousemove', mousemoveFn);
            this.bindEvt(this.refs.imageViewer, 'mouseup', mouseupFn);

            this.bindEvt(this.refs.image, 'touchstart', mousedownFn);
            this.bindEvt(this.refs.imageViewer, 'touchmove', mousemoveFn);
            this.bindEvt(this.refs.imageViewer, 'touchend', mouseupFn);
        }
    }

    // 事件绑定代理
    bindEvt(target, evtKey, evtFn) {
        if (target && evtFn && evtKey) {
            target.removeEventListener(evtKey, evtFn, false);
            target.addEventListener(evtKey, evtFn, false);
        }
    }

    // componentWillReceiveProps(nextProps) {
    //
    // }

    render() {
        return (
            <div ref="imageViewer" className={`co-image-viewer ${this.state.isImageViewerActive ? '': 'hidden'}`}>
                {
                    this.state.isImageViewerActive? (
                        <div>
                            <div ref="bg" className="bg" onClick={this.handleCloseImageViewer}></div>
                            <div ref="closeBtn" className="icon_cross close-btn" onClick={this.handleCloseImageViewer}></div>
                            <img ref="image"
                                src={imgUrlFormat(this.state.imgUrl, '')}
                                style={{
                                    width: this.state.imgWidth? `${this.state.imgWidth}px`: 'auto',
                                    height: this.state.imgHeight? `${this.state.imgHeight}px`: 'auto',
                                    marginLeft: this.state.marginLeft === 'auto'? 'auto': `-${this.state.marginLeft}px`,
                                    marginTop: this.state.marginTop === 'auto'? 'auto': `-${this.state.marginTop}px`
                                }}
                                onLoad={this.handleImageLoad}/>
                        </div>
                    ): null
                }
            </div>
        );
    }
}

ImageViewer.propTypes = {

};

export default ImageViewer;
