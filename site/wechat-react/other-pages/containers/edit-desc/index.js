import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import { getDescriptList } from '../../actions/common';
import { uploadImage, getStsAuth } from '../../actions/common'; 
import { saveVipDesc } from '../../actions/vip';
import { getUrlParams } from 'components/url-utils';
import { locationTo } from 'components/util';



class EditDesc extends Component {
    constructor(props) {
        super(props);
        this.urlParams = getUrlParams();

        this.state = {
            profiles: [],                   // 描述列表
        }
    }

    async componentDidMount() {
        await this.getDesc();
        this.initStsInfo();
    }

    // oss上传初始化
    initStsInfo() {
        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
    }

    getDesc = () => {
        let params = [];

        // 通用vip
        if (this.urlParams.type === 'generalVip') {
            params = [this.urlParams.liveId, 'liveVipDesc'];
        }

        this.props.getDescriptList(...params)
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);
                this.setState({
                    profiles: res.data.descriptions[params[1]] || []
                })
            })
            .catch(err => {
                console.error(err);
                window.toast(err.message);
            })
    }

    onClickCancel = () => {
        history.back();
    }

    onClickSave = () => {
        let request;

        if (this.urlParams.type === 'generalVip') {
            request = this.props.saveVipDesc({
                category: 'liveVipDesc',
                liveId: this.urlParams.liveId,
                profiles: this.state.profiles
            })
        }
        
        request.then(res => {
            if (res.state.code) throw Error(res.state.msg);
            window.toast('保存成功');
            let redirectUrl = '';
            if (this.urlParams.type === 'generalVip') {
                redirectUrl = `/wechat/page/live-vip-setting?liveId=${this.urlParams.liveId}&from=editDesc`;
            } else {
                redirectUrl = document.referrer ? document.referrer : '/wechat/page/recommend';
            }
            locationTo(redirectUrl);
        }).catch(err => {
            console.error(err);
            window.toast(err.message);
        })
    }


    /**
     * desc-list操作相关
     */
    addItemText = e => {
        let item = {
            type: 'text',
            content: '',
        }
        this.setState({
            profiles: [
                ...this.state.profiles,
                item
            ]
        })
    }

    onChangeUploadImg = e => {
        let files = e.target.files;
        files = Array.prototype.slice.call(files);
        this._uploadFiles = files;
        this.addItemImg();
    }

    addItemImg = async () => {
        if (!this._uploadFiles || !this._uploadFiles.length) return;

        if (this.state.profiles.filter(item => item.type === 'image').length >= 20) return window.toast('图片数量不能超过20张');

        if (!this.props.stsAuth) {
            window.loading(true)
            await this.props.getStsAuth();
            window.loading(false)
        }

        this.props.uploadImage(this._uploadFiles.shift(), 'vipDesc')
            .then(res => {
                let item = {
                    type: 'image',
                    content: res,
                }
                this.setState({
                    profiles: [
                        ...this.state.profiles,
                        item
                    ]
                })
            }).catch(err => {
                console.error(err);
                window.toast(err.message);
            })
    }

    onChangeItem = (e, index) => {
        let profiles = [...this.state.profiles];
        profiles[index] = {
            ...profiles[index],
            content: e.target.value
        }
        this.setState({profiles})
    }

    onDeleteItem = (e, index) => {
        let profiles = [...this.state.profiles];
        profiles.splice(index, 1);
        this.setState({profiles})
    }

    onUpItem = (e, index) => {
        if (index == 0) return;
        let profiles = [...this.state.profiles],
            item = profiles.splice(index, 1);
        profiles.splice(index - 1, 0, ...item);
        this.setState({profiles})
    }

    onDownItem = (e, index) => {
        if (index == this.state.profiles.length - 1) return;
        let profiles = [...this.state.profiles],
            item = profiles.splice(index, 1);
        profiles.splice(index + 1, 0, ...item);
        this.setState({profiles})
    }

    render() {
        let { profiles } = this.state;

        return (
            <Page className="p-edit-desc">
                <header>
                    <div className="btns">
                        <label className="btn" htmlFor="upload-img">
                            <i className="icon-img-c"></i>添加图片
                            <input 
                                type="file" id="upload-img" style={{display: 'none'}} 
                                multiple="multiple"
                                accept="image/jpg,image/png,image/jpeg,image/gif,image/bmp"
                                onChange={this.onChangeUploadImg}/>
                        </label>
                        <div className="btn" onClick={this.addItemText}><i className="icon-text-c"></i>添加文字</div>
                    </div>
                </header>

                <main>
                    <div className="__edit-desc-list">
                        {
                            profiles.map((item, index) =>
                                <EditDescItem
                                    key={index}
                                    index={index}
                                    data={item}
                                    onChange={this.onChangeItem}
                                    onDelete={this.onDeleteItem}
                                    onUp={this.onUpItem}
                                    onDown={this.onDownItem}
                                    disableUp={index === 0}
                                    disableDown={index === profiles.length - 1}/>
                            )
                        }
                    </div>
                </main>

                <footer>
                    <div className="btns">
                        <div className="btn" onClick={this.onClickCancel}>取消</div>
                        <div className="btn submit" onClick={this.onClickSave}>保存</div>
                    </div>
                </footer>
            </Page>
        )
    }
}




/**
 * onChange
 * onDelete
 */
export class EditDescItem extends Component {
    render() {
        let { data, disableUp, disableDown } = this.props;

        let upClassName = disableUp ? 'icon_up disable' : 'icon_up',
            downClassName = disableDown ? 'icon_down disable' : 'icon_down';

        let content;
        if (data.type === 'text') {
            content = <div className="content">
                <textarea
                    placeholder="输入文字"
                    value={data.content}
                    onChange={this.onChange}
                />
            </div>
        } else if (data.type === 'image') {
            content = <div className="content">
                <img src={data.content} alt=""/>
            </div>
        }

        return (
            <div className={`__edit-desc-item __type-${data.type}`}>
                <div className="content-wrap">
                    {content}
                </div>
                <div className="control-wrap">
                    <div className="icon_cross" onClick={this.onDelete}></div>
                    <div className={upClassName} onClick={this.onUp}></div>
                    <div className={downClassName} onClick={this.onDown}></div>
                </div>
            </div>
        )
    }
    
    onChange = (e, index) => {
        this.props.onChange && this.props.onChange(e, this.props.index)
    }

    onDelete = e => {
        this.props.onDelete && this.props.onDelete(e, this.props.index)
    }

    onUp = e => {
        if (this.props.disableUp) return;
        this.props.onUp && this.props.onUp(e, this.props.index)
    }

    onDown = e => {
        if (this.props.disableDown) return;
        this.props.onDown && this.props.onDown(e, this.props.index)
    }
}




function mapStateToProps(state) {
    return {
        stsAuth: state.common.stsAuth,
    }
}

const mapDispatchToProps = {
    getDescriptList,
    saveVipDesc,
    uploadImage,
    getStsAuth,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditDesc)