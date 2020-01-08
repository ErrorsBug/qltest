import React, { Component, PureComponent } from 'react';
import ScrollToLoad from 'components/scrollToLoad';
import CommonTextarea from 'components/common-textarea';
import { formatDate, digitFormat, imgUrlFormat, htmlTransferGlobal, dangerHtml, replaceWrapWord, } from 'components/util';
import { getVal } from '../../../../../components/util';
import { limitScrollBoundary } from 'components/scroll-boundary-limit';
import XiumiEditorH5 from 'components/xiumi-editor-h5';
import Empty from 'components/empty-page';
import TopicAssembleContent from 'components/topic-assemble-content'

/**
 * 话题介绍
 * @param {*} props 
 */
const TopicIntro = props => {
    let { topicInfo, topicProfile, commentNum } = props;

    return <section
        className="intro-section"
        ref={el => (props.father.introScrollContainer = el)}
    >
        {/* <div className="topic-title">{topicInfo.topic}</div>
        <div className="topic-view-comment">
            <span><img src={require('./img/icon-view.png')} /> <span>{digitFormat(topicInfo.browseNum)} 人次</span></span>
            <span><img src={require('./img/icon-comment.png')} /> <span>{commentNum || 0} 评论</span></span>
        </div>
        <div className="time">{formatDate(topicInfo.startTime, 'yyyy-MM-dd hh:mm:ss')}</div> */}
        {
            props.topicDesc ? 
            <div className="intro-list">
                <XiumiEditorH5 content={props.topicDesc} />
            </div>
            :
            <div className="intro-list">
            {
                props.topicInfo.remark && <p className="remark">{props.topicInfo.remark}</p>
            }
            {
                !!topicProfile.length && topicProfile.map((item, index) => {
                        return <div key={`profileList-item-${item.id}`}>
                            {
                                item.url?
                                    <img
                                        className='intro-image'
                                        src={`${imgUrlFormat(item.url, '?x-oss-process=image/resize,w_800,limit_1')}`}
                                    />
                                :null
                            }
                            {
                                item.msg
                                    ? <pre><code>{htmlTransferGlobal(item.msg)}</code></pre>
                                    : null
                            }
                        </div>
                    })

            }    
        </div>   
        }
    </section>
}

/**
 * 系列课介绍
 * @param {*} props
 */
const ChannelIntro = props => {
    const { channelProfile } = props;


    if(props.channelDesc || (channelProfile.desc && channelProfile.desc.length)){
	    return <section className="intro-section" ref={el => (props.father.introScrollContainer = el)}>
	        {
	            props.channelDesc?
	            <XiumiEditorH5 content={props.channelDesc} /> :
	            channelProfile.desc.map((item, index) => {
	                switch (item.type) {
	                    case 'image':
	                        return <img className='desc-image'
	                            onLoad={onImageLoaded}
	                            key={`desc-item-${index}`}
	                            src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
	                    case 'text':
	                        return <p className="desc-text" key={`desc-item-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
	                }
	            })
	        }
	    </section>
    }else{
		return null;
    }

}


function onImageLoaded(e) {
    e = e || window.event;
    e.target.style.width = e.target.width >= 600 ? '100%' : (e.target.width*window.dpr + 'px');
}

class IntroDialog extends Component {

    state = {
        show: false,
    }

    componentDidUpdate(prevProps, prevState) {
        if (getVal(prevProps, 'topicProfile', []).length === 0 && getVal(this.props, 'topicProfile', []).length > 0) {
            this.fixImgSize();
        }
        if(this.introScrollContainer){
	        limitScrollBoundary(this.introScrollContainer);
        }
    }

    componentDidCatch(err, info){
    }

    componentDidMount(){
    }
    

    fixImgSize() {
        let imgs = document.querySelectorAll('.intro-image');

        Array.prototype.map.call(imgs, (item) => {
            if (item.complete) {
                
                item.style.width = item.width >= 800 ? '100%' : (item.width*window.dpr + 'px');
            }
        });
    }

    show = () => {
        this.setState({ show: true });
    }

    hide = () => {
        this.setState({ show: false });
    }

    render () {
        let { topicInfo, commentNum, profileList, channelProfile, isListenBook, topicManuscript } = this.props;

        return (
            <div className={ "intro-dialog-container " + ( this.state.show ? 'show' : '' ) } ref={el => (this.introDialogContainer = el)}>
                <aside className="bg" onClick={ this.hide }></aside>

                {
                    isListenBook && (
                        <main className={ `intro-content` }>
                            <header className="dialog-title">
                                文稿
                                <i className="icon_delete on-log"
                                    onClick={this.hide}
                                    data-log-name="关闭文稿按钮"
                                    data-log-region="close-manuscript-dialog"
                                ></i>
                            </header>
                            <div className="intro-section">
                                <TopicAssembleContent className="manuscript-content" data={topicManuscript} />
                            </div>
                        </main>
                    )
                }

                {
                    !isListenBook && (
                        <main className={ `intro-content ${this.props.isNewsTopic ? 'news-topic' : ''}` }>
                            { !this.props.isNewsTopic && (
                                <header className="dialog-title">
                                    {/*{*/}
                                        {/*topicInfo.channelId ? "系列课简介" : "课程简介"*/}
                                    {/*}*/}
                                    课程介绍
                                    <i className="icon_delete on-log"
                                        onClick={this.hide}
                                        data-log-name="关闭介绍按钮"
                                        data-log-region="close-intro-dialog"
                                    ></i>
                                </header>
                            )}
        
                            {
                                (this.props.topicDesc || topicInfo.remark || (this.props.topicProfile && this.props.topicProfile.length)) ?
                                    <TopicIntro father={this} {...this.props} />
                                    :
                                    (this.props.channelDesc || (this.props.channelProfile && this.props.channelProfile.desc && this.props.channelProfile.desc.length)) ?
                                    <ChannelIntro father={this} {...this.props} />
                                        :
                                        !this.props.noProfileData ?
                                        <div className="loading">{ isListenBook ? '拼命加载音频文稿中' : '拼命加载课程介绍中.' }<div className="dynamic-ellipsis">..</div></div>
                                            :
                                            <div className="c-flex-grow1">
                                                <Empty show={true} emptyMessage="讲师还没有添加课程介绍哦"/>
                                            </div>
                            }
                        </main>
                    )
                }
            </div>
        )
    }
}

export default IntroDialog;