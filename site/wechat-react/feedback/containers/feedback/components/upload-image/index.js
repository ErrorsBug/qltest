import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { insertOssSdk, uploadImage } from 'common_actions/common';
import Detect from 'components/detect';




class UploadImage extends React.PureComponent {
    static defaultProps  = {
        count: 9,
    }

    state = {
        imgs: []
    }

    render() {
        const children = this.props.children;
        const child0 = children && children[0];
        const child1 = children && children[1];

        return <Fragment>
            {typeof child0 === 'function' && child0(this.state.imgs)}
            {
                this.state.imgs.length < this.props.count &&
                <label className={classNames('btn-upload-image', this.props.className)} onClick={this.onClick} {...this.props.attrs}>
                    {
                        typeof child1 !== 'undefined'
                            ?
                            typeof child1 === 'function' 
                                ?
                                child1()
                                :
                                child1
                            :
                            '上传图片'
                    }
                </label>
            }
            <input
                style={{display: 'none'}}
                type="file"
                ref={r => this.input = r}
                multiple
                accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
                onChange={this.onChange}
            />
        </Fragment>
    }

    onClick = e => {
        if (!this.isWechatError && Detect.os.phone && Detect.os.weixin) {
            e.preventDefault();
            this.handleUploadWechat();
        } else {
            this.input.click();
        }
    }

    onChange = e => {
        const files = Array.prototype.slice.call(e.target.files);
        if (!files.length) return;
        e.target.value = '';
        this.handleUpload(files);
    }

    handleUploadWechat = () => {
        wx.chooseImage({
            count: this.props.count - this.state.imgs.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                const localIds = res.localIds || [];
                let imgs = [...this.state.imgs];
                localIds.forEach(localId => {
                    imgs.push(this.createImgState({
                        localId,
                    }));
                })

                // 限制图片数量
                imgs = imgs.slice(0, this.props.count);

                this.setState({
                    imgs
                }, () => {
                    this.uploadImageLoop();
                })
            },
            fail: err => {
                window.toast('调用微信图片上传失败，重新点击将使用普通上传方式', 2000);
                this.isWechatError = true;
            }
        });
    }

    handleUpload = async files => {
        // 加载oss.sdk  
        if (!await insertOssSdk().catch(err => {
            window.toast(err.message);
        })) return;

        let imgs = [...this.state.imgs];
        files.forEach(file => {
            imgs.push(this.createImgState({
                file,
            }));
        })

        // 限制图片数量
        imgs = imgs.slice(0, this.props.count);

        this.setState({
            imgs
        }, () => {
            this.uploadImageLoop();
        })
    }

    uploadImageLoop = async () => {
        let lastErr;

        let validIndex = this.getUploadValidIndex();

        while (validIndex >= 0) {
            console.log('uploadImage', validIndex);

            await this.updateImgState(validIndex, {
                status: 'pending',
            });

            // 上传逻辑，成功则更新state，失败将删除图片项
            await this.uploadImageOne(validIndex)
                .catch(err => {
                    lastErr = err;
                    const imgs = [...this.state.imgs];
                    imgs.splice(validIndex, 1);
                    this.setState({imgs});
                })
            
            validIndex = this.getUploadValidIndex();
        }

        this.props.onUpload && this.props.onUpload(
            lastErr,
            this.state.imgs
                .filter(i => i.status === 'success')
        )
    }

    uploadImageOne(index) {
        const img = this.state.imgs[index];

        return (img.file
            ?
            this.props.uploadImage(img.file)
                .then(res => 
                    this.updateImgState(index, {
                        status: 'success',
                        content: res,
                        file: null,
                    })
                )
            :
            new Promise((resolve, reject) => {
                wx.uploadImage({
                    localId: img.localId,
                    isShowProgressTips: 1,
                    success: res => {
                        resolve(res);
                    },
                    fail: () => {
                        reject(Error('微信上传图片失败：' + img.localId));
                    },
                });
            })
                .then(res =>
                    this.updateImgState(index, {
                        status: 'success',
                        mediaId: res.serverId,
                    })
                )
            )
        .catch(err => {
            const img = this.state.imgs[index];
            console.warn('上传图片失败', err, img);
            if (img.retry >= 1) {
                // 超过最大重新上传次数，抛错
                throw err;
            } else {
                // 重新上传
                img.retry = (img.retry || 0) + 1;
                return this.uploadImageOne(index);
            }
        })
    }

    getUploadValidIndex = () => {
        for (let i in this.state.imgs) {
            let img = this.state.imgs[i];
            if (img.status === 'pending') return;
            if (img.status !== 'success' && img.status !== 'error') {
                return i;
            }
        }
    }

    updateImgState = (index, obj) => {
        return new Promise(resolve => {
            const imgs = [...this.state.imgs];
            imgs[index] = {
                ...imgs[index],
                ...obj
            }
            this.setState({imgs}, resolve)
        })
    }

    createImgState = obj => {
        return {
            status: '',
            content: '',
            ...obj,
        }
    }
}



export default connect(state => state, {uploadImage})(UploadImage);
