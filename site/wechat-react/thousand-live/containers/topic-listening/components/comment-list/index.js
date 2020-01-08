import React, { Component, PureComponent } from 'react';
import ScrollToLoad from 'components/scrollToLoad';
import CommonTextarea from 'components/common-textarea';
import { timeBefore, imgUrlFormat } from 'components/util';
import CreateLiveHelper from "components/create-live-helper";

const dangerHtml = (content) => {
    if (content) {
        content = content.replace(/\</g, (m) => "&lt;");
        content = content.replace(/\>/g, (m) => "&gt;");
        content = content.replace(/&lt;br\/&gt;/g, (m) => "<br/>");
    }

    return { __html: content }
};

const Comment = ({ createByHeadImgUrl, content, createByName, createTime }) => {
    return (
        <div className="comment">
            <div className="user-info">
                <img className="avatar" src={` ${imgUrlFormat(createByHeadImgUrl || "http://img.qlchat.com/qlLive/liveCommon/normalLogo.png",'?x-oss-process=image/resize,h_60,w_60,m_fill')}`} />
                <div className="text">
                    <div className="nickname">
                        {createByName}
                    </div>
                    <div className="time">{timeBefore(createTime, Date.now())}</div>
                </div>
            </div>
            <div className="content" dangerouslySetInnerHTML={ dangerHtml(content) }></div>
        </div>
    )
}

class CommentList extends Component {

    state = {
        show: false,
        showInput: false,
        value: '',
    }

    show = () => {
        console.log('show');
        this.setState({ show: true });
    }

    hide = () => {
        this.setState({ show: false });
    }

    onSend = () => {
        this.props.onSendComment(this.state.value);
        this.setState({
            value: '',
            showInput: false,
        })

    }

    onShowInput = () => {
        this.setState({ showInput: true });
    }

    onHideInput = (e) => {
        this.setState({ showInput: false });
    }

    handleInput = (e) => {
        this.setState({ value: e.currentTarget.value })
    }


    render () {
        let { data, commentNum } = this.props;
        return (
            <div className={ "listening-page-comment-list " + ( this.state.show ? 'show' : '' ) }>
                <aside className="bg" onClick={ this.hide }></aside>

                <main className="comment-main">
                    <div className="header">
                        评论&nbsp;
                        <span className="total-num">{commentNum}</span>
                        <span className="close-comment" onClick={ this.hide }>
                            <img src={ require('./img/close.png') }/>
                        </span>
                    </div>
                    <div className="comment-list-container">
                        <ScrollToLoad
                            toBottomHeight={300}
                            loadNext={this.props.loadNextComments}
                            noneOne={ this.props.noneOne }
                            notShowLoaded = {false}
                            noMore={this.props.noMore}
                            className='listening-page-comment-list-body'
                        >
                        {!(this.props.power.allowSpeak || this.props.power.allowMGLive)&&this.props.isLiveAdmin!=='Y'&&this.props.isShowQl&&<CreateLiveHelper chtype={`create-live_${this.props.topicStyle}`} getHasLive={this.props.getHasLive} isHasLive={this.props.isHasLive} />}
                            {
                                data.length > 0 ? 
                                    data.map((item, idx) => <Comment key={idx} {...item} />)
                                    : 
                                    <div className="no-comment">
                                        暂无评论～
                                    </div>
                            }
                        </ScrollToLoad>
                    </div>

                    <div className="comment-input-container" >
                        {
                            !this.state.showInput ?
                                <div className="comment-input on-log"
                                    onClick={this.onShowInput}
                                    data-log-name="发表评论"
                                    data-log-region="comment-input"
                                    data-log-pos="input-display"
                                >{ this.state.value || "发表评论"}</div>
                                :
                                <CommonTextarea
                                    className='comment-textarea'
                                    placeholder="发表评论"
                                    value={this.state.value}
                                    onChange={ this.handleInput }
                                    autoFocus={true}
                                />
                        }
                        <span className="btn-send" onClick={ this.onSend }>发送</span>
                    </div>
                </main>
            </div>
        )
    }
}

export default CommentList;