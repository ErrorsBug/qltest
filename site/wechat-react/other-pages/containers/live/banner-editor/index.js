const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { withRouter } from 'react-router';
import FileInput from 'components/file-input';
import { stringify } from 'querystring';

import Page from 'components/page';
import { locationTo } from 'components/util';

// actions
import {
    saveBanner
} from '../../../actions/live';
import { uploadImage, getStsAuth } from '../../../actions/common';

import SelectIcon from './components/select-icon';

@withRouter
@autobind
class BannerEditor extends Component {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        host: '',

        liveId: '',
        imgUrl: '',
        title: '',
        link: '',
        type: 'topic', // topic | channel | vip | link | none
        mediaId: '',
        businessId: '', // topic: topicId | channel: channelId
        businessName: '', // topic: topic name | channel: channel name
        inputLink: '',
    }

    componentDidMount() {
        try {
            const { link, type } = this.props.router.location.query;

            let state = {
                host: document.location.origin,
            }

            let saveState = sessionStorage.getItem('bannerEditorSaveState')

            if (saveState) {
                try {
                    saveState = JSON.parse(saveState)
                    state = { ...state, ...saveState}

                    sessionStorage.removeItem('bannerEditorSaveState')
                } catch (e) {
                    console.error(e);
                }
            }

            state = { ...state, ...this.props.router.location.query }

            if (type == 'link' && link) {
                state.inputLink = link;
            } else {
                state.inputLink = undefined;
            }

            this.setState(state);
        } catch (error) {
            console.error(error);
        }

        this.initStsInfo();
    }

    // oss上传
    initStsInfo() {
        this.props.getStsAuth();

        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
    }

    onInputTitle(e) {
        if (e.target.value.length > 20) {
            window.toast('最多输入20个字符');
        } else {
            this.setState({
                title: e.target.value
            })
        }
    }

    onInputLink(e) {
        this.setState({
            inputLink: e.target.value
        })
    }

    /**
     * 跳转到话题和系列课
     */
    onLinkToSelector() {
        const state = stringify(this.state);
        const inputs = document.querySelectorAll('input');
        [].forEach.call(inputs, (item) => {
            item.value = '';
        })

        sessionStorage.setItem('bannerEditorSaveState', JSON.stringify(this.state))

        locationTo(`/wechat/page/live-topic-channel-selector?${state}`)
    }

    onSelectType(type) {
        this.setState({ type });
    }

    async onChangeFile(event) {
        const file = event.target.files[0]
        try {
            const filePath = await this.props.uploadImage(file, "channelLogo");
            this.setState({
                imgUrl: filePath,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async onSave() {
        if (!this.state.imgUrl) {
            window.toast('请上传图片');
            return;
        }

        if (this.state.title.length > 20) {
            window.toast('最多输入20个字符');
            return;
        }

        let link = '';

        if (this.state.type === 'link') {
            if (!this.state.inputLink) {
                window.toast('请输入链接地址');
                return;
            } else if (!/^https?:\/\/.*/.test(this.state.inputLink)) {
                window.toast('请输入正确的链接，以http或者https开头');
                return;
            }
            link = this.state.inputLink;
        }

        if (this.state.type === 'vip') {
            link = `${this.state.host}/wechat/page/live-vip?liveId=${this.state.liveId}`;
        }

        if (this.state.type === 'topic' || this.state.type === 'channel') {
            if (!this.state.businessId) {
                window.toast('请选择话题或系列课');
                return;
            }
        }

        const commitParams = {
            ...this.state,
            link: link,
        };


        try {
            const result = await this.props.saveBanner({
                ...commitParams
            });

            if (result.state.code === 0) {
                locationTo('/wechat/page/live/banner/' + this.state.liveId);
            }
        } catch (error) {
            console.log(error);
            window.toast('输入的内容有误');
        }
    }

    render() {
        const { imgUrl, type, isOpenVip } = this.state;

        return (
            <Page title={"轮播图设置"} className='banner-editor-container'>
                <div className='banner-editor-content'>

                    <section className='image-uploader'>
                        {
                            imgUrl ?
                                <div className='image-preview'
                                    style={{
                                        backgroundImage: `url(${ imgUrl })`
                                    }}>
                                    <FileInput
                                        className = "input-image"
                                        onChange={this.onChangeFile}
                                    />

                                    <span className='btn-edit'>修改</span>
                                </div>
                                :
                                <div className='image-placeholder'>
                                    <FileInput
                                        className = "input-image"
                                        onChange={this.onChangeFile}
                                    />

                                    <div className='placeholder-info'>

                                        <p className='info-1'>
                                            <img src={ require('../img/image-icon.png') } alt="" />
                                            上传轮播图
                                        </p>
                                        <p className='info-2'>建议尺寸：800×500</p>
                                    </div>
                                </div>
                        }
                    </section>

                    <section className='input-group-wrap'>
                        <header>标题</header>

                        <section className='input-row'>
                            <input type="text"
                                   placeholder="标题仅做标识不显示，可不填"
                                   ref={input => this.titleInput = input}
                                   value={this.state.title}
                                   onChange={this.onInputTitle} />
                        </section>
                    </section>

                    <section className='input-group-wrap'>
                        <header>跳转类型</header>
                        {(type === 'topic' || type === 'channel')}

                        <ul>
                            <li className={ (type === 'topic' || type === 'channel') ? 'active' : '' }
                                onClick={ () => this.onSelectType('topic') }>
                                <SelectIcon active={ type === 'topic' || type === 'channel' } />
                                <div className='item-content'>
                                    <span>课程或系列课</span>

                                    <div className='options pointer' onClick={ this.onLinkToSelector }>
                                        {
                                            (this.state.businessId && this.state.businessName) ?
                                                this.state.businessName
                                                :
                                                '选择课程或系列课'
                                        }
                                        <i className='icon_enter'></i>
                                    </div>
                                </div>
                            </li>
                            {
                                isOpenVip === 'Y' &&
                                    <li className={ type === 'vip' ? 'active' : '' }
                                        onClick={ () => this.onSelectType('vip') }>
                                        <SelectIcon active={ type === 'vip' } />
                                        <div className='item-content'>
                                            <span>VIP</span>

                                            <div className='options' style={{overflow: "hidden"}}>
                                                {`${this.state.host}/wechat/page/live-vip?liveId=${this.state.liveId}`}
                                            </div>
                                        </div>
                                    </li>
                            }
                            <li className={ type === 'link' ? 'active' : '' }
                                onClick={ () => this.onSelectType('link') }>
                                <SelectIcon active={ type === 'link' } />
                                <div className='item-content'>
                                    <span>链接</span>

                                    <div className='options'>
                                        <input type="text"
                                               placeholder='请输入跳转链接'
                                               ref={input => this.linkInput = input}
                                               value={this.state.inputLink}
                                               onChange={this.onInputLink} />
                                    </div>
                                </div>
                            </li>
                            <li className={ type === 'none' ? 'active' : '' }
                                onClick={ () => this.onSelectType('none') }>
                                <SelectIcon active={ type === 'none' } />

                                <div className='item-content'><span>不跳转</span></div>
                            </li>
                        </ul>
                    </section>
                </div>

                <section className='save-btn' onClick={ this.onSave }>
                    确定
                </section>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    uploadImage,
    getStsAuth,
    saveBanner,
}

module.exports = connect(mapStateToProps, mapActionToProps)(BannerEditor)
