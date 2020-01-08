import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XiumiEditorH5 from "components/xiumi-editor-h5";
import {
    replaceWrapWord,
    dangerHtml,
    imgUrlFormat,
    getVieoSrcFromIframe
} from 'components/util';

class Desc extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        tempList: [],
        toggleOpen: false,
        showVideoIframe: false
    }
    // 按分类获取简介内容
    getDescByCategory(category) {
        let desc = this.props.desc;
        if (desc) {
            return desc[category] || [];
        } else {
            return []
        }
    }
    delayVideoIframe() {
        setTimeout(() => {
            this.setState({
                showVideoIframe: true,
            })
        }, 3000);
    }
    componentDidMount() {
        this.delayVideoIframe();
    }
    render() {
        let { pcDescription, purchaseNotes } = this.props
        let descInfo = this.getDescByCategory('desc');
        let lectuerInfo = this.getDescByCategory('lectuerInfo');
        let fitPeopleInfo = this.getDescByCategory('suitable');
        let willGetInfo = this.getDescByCategory('gain');
        let videoInfo = this.getDescByCategory('videoDesc');

        return (
            <section className='notice-container'>
                <header>
                    <span className='verticle-line'></span>
                    课程介绍
                </header>
                
                <div className="desc-content">
                    {videoInfo.length ?
                        <div className="video-info intro-block">
                            <div className="head">视频简介</div>
                            <div className="content video-wrap">
                                {videoInfo.map((item, index) => {
                                    switch (item.type) {
                                        case 'video':
                                            return (
                                                this.state.showVideoIframe ? (
                                                        /(\.mp4)$/.test(item.content) ?
                                                        <video className='video-mp4' src={item.content} controls />
                                                        :
                                                        <div className="iframe-wrap" key={`iframe-wrap-${index}`}>
                                                            <div className="bd-tp"></div>
                                                            <div className="bd-rt"></div>
                                                            <div className="bd-bt"></div>
                                                            <div className="bd-lt"></div>
                                                            <iframe is frameBorder="0" width="100%" height="100%" id="imIf" name="imIf" src={getVieoSrcFromIframe(item.content.replace(/(http:\/\/)/, '//'))} allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" />
                                                        </div>
                                                ): (
                                                    <div className="iframe-tip" key={`iframe-wrap-${index}`}></div>
                                                )
                                            );
                                    }
                                })}
                            </div>
                            <div className="video-tip">建议在wifi环境下播放</div>
                        </div>
                    : null
                    }
                    <div className="head">简介</div>
                    <div>
                        {
                        pcDescription ? 
                        <XiumiEditorH5 content={pcDescription} />
                        :
                        <div>
                            {
                                descInfo.length ? 
                                descInfo.map((item, index) => {
                                    switch (item.type) {
                                        case 'image':
                                            return <img className='desc-image'
                                                key={`desc-item-${index}`}
                                                src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                                        case 'text':
                                            return <p className="desc-content-word" key={`desc-item-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                                    }
                                })
                                :
                                <div className="empty-content">
                                    暂无简介
                                </div>
                            }
                        </div>
                        }
                    </div>
                    {
                        lectuerInfo.length ?
                        <div>
                            <div className="head">关于讲师</div>
                            <div className="content">
                                {lectuerInfo.map((item, index) => {
                                    switch (item.type) {
                                        case 'image':
                                            return <img className='desc-image'
                                                onLoad={this.onImageLoaded}
                                                key={`desc-item-t-${index}`}
                                                src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                                        case 'text':
                                            return <p className="desc-content-word" key={`desc-item-t-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                                    }
                                })}
                            </div>
                        </div>
                        : null
                    }
                    {
                        fitPeopleInfo.length ?
                        <div>
                            <div className="head">适合人群</div>
                            <div className="content">
                                {fitPeopleInfo.map((item, index) => {
                                    switch (item.type) {
                                        case 'image':
                                            return <img className='desc-image'
                                                onLoad={this.onImageLoaded}
                                                key={`desc-item-t-${index}`}
                                                src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                                        case 'text':
                                            return <p className="desc-content-word" key={`desc-item-t-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                                    }
                                })}
                            </div>
                        </div>
                        : null
                    }
                    {
                        willGetInfo.length ?
                        <div>
                            <div className="head">你将获得</div>
                            <div className="content">
                                {willGetInfo.map((item, index) => {
                                    switch (item.type) {
                                        case 'image':
                                            return <img className='desc-image'
                                                onLoad={this.onImageLoaded}
                                                key={`desc-item-t-${index}`}
                                                src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                                        case 'text':
                                            return <p className="desc-content-word" key={`desc-item-t-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                                    }
                                })}
                            </div>
                        </div>
                        : null
                    }
                     <div className="note intro-block">
                        <div className="head">
                            购买须知
                        </div>
                        <div className="content">
                            {
                                purchaseNotes ?
                                    <p dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(purchaseNotes))} />
                                :
                                <p>
                                    1. 该课程为付费系列课程，按课程计划定期更新，每节课程可在开课时学习，也可反复回听 <br/>
                                    {
                                        this.props.isLiveAdmin === 'Y' ? '2. 购买课程后关注我们的服务号，可在菜单里进入听课' : '2. 购买课程后关注千聊公众号，可在菜单【已购买课程】里进入听课'
                                    }<br />
                                    3. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅 <br/>
                                    4. 该课程听课权益跟随支付购买微信账号ID，不支持更换（赠礼课程除外）<br/>
                                    5. 如有其它疑问，可点击左下角“咨询”按钮，与内容供应商沟通后再购买 <br/>
                                </p>
                            }
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


Desc.propTypes = {
    pcDescription: PropTypes.string,
};

export default Desc;
