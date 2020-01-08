import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM, { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { getVal, normalFilter } from 'components/util';
import CommonTextarea from 'components/common-textarea';
import { autobind } from 'core-decorators';
import { campCheckInListModel } from '../../../../model/';
import BottomRecorder from '../../../bottom-recorder';

const { 
    requestCommentCheckInNews,
} = campCheckInListModel

@autobind
export class CommentInput extends Component {
    static propTypes = {
        isShow: PropTypes.bool,
        parentUserId: PropTypes.string,
        userId: PropTypes.string,
        affairId: PropTypes.number,
        placeholder: PropTypes.string,
        onBlur: PropTypes.func,
        liveId: PropTypes.string,
    }

    state = {
        content: '',
        showAudioCommentBottom: false,
        audioList: [],
    }

    onChange(e) {
        this.setState({ content: e.target.value })
    }

    onBlur(e) {
        setTimeout(()=>{
            this.setState({
                showAudioCommentBottom: false,
                content:'',
            });
            this.props.onBlur();
        
        }, 200);
        
    }

    handleClick() {
        const { parentUserId, userId, affairId, liveId } = this.props;
        const { content } = this.state;
        if (content.trim().length == 0) {
            window.toast('评论内容不能为空');
            this.setState({ content: '' })
            return false;
        }
        requestCommentCheckInNews({
            comment:{ parentUserId, userId, content:normalFilter(content), contentType: 'text'},
            affairId,
            liveId,
        });

        this.setState({ content: ''});
        this.onBlur();
    }

    showAudioCommentBottom(){
        this.setState({
            showAudioCommentBottom: true,
        });
    }

   // pc录音发送处理
   pcSendRecHandle(audioItem) {
        const { parentUserId, userId, affairId, liveId } = this.props;
        let { url, second } = audioItem;
        const newAudio = { 
            parentUserId, 
            userId,  
            duration: second, 
            content: url, 
            contentType: 'audio',
        }
        console.info(newAudio);

        requestCommentCheckInNews({
            comment: newAudio,
            affairId,
            liveId,
        });

        this.setState({
            audioList: [newAudio],
        })
        this.onBlur();
        return {
            state: {
                code:0
            }
        }
    }

    // 微信录音处理
    wxUploadHandle(audioItem) {
        const { parentUserId, userId, affairId, liveId } = this.props;
        let { recLocalId, second, serverId } = audioItem;
        

        if (serverId) {
            const newAudio = { 
                parentUserId, 
                userId,  
                duration: second,
                audioId: serverId,
                recLocalId,
                contentType: 'audio',
            }
            console.info(newAudio);
            
            requestCommentCheckInNews({
                comment: newAudio,
                affairId,
                liveId,
            });
            this.setState({
                audioList: [newAudio],
            })
            this.onBlur();
            return {
                state: {
                    code:0
                }
            }
        }
    }

    render() {
        
        if (!this.props.isShow || !window) return null;
        
        const portalBody = document.querySelector(".portal-low");
        if (!portalBody) return null
        return (
            
            ReactDOM.createPortal(  
                this.state.showAudioCommentBottom?
                <BottomRecorder
                    show={this.state.showAudioCommentBottom}    
                    pcSendRecHandle = {this.pcSendRecHandle}
                    wxUploadHandle = {this.wxUploadHandle}
                    onClose={this.onBlur}
                />
                :     
                <div className="check-in-item-comment">
                    <div className="comment-bg" onClick={this.onBlur}></div>
                    <div className="comment-input-container">
                        <div className="btn-audio-comment" onClick={this.showAudioCommentBottom}></div>
                        <div className="stretch-area">
                            <pre className="fake-content">{this.state.content}</pre>
                            <CommonTextarea 
                                className = "comment-input"
                                placeholder = {this.props.placeholder}
                                value={this.state.content}
                                // onFocus = {this.inputFocus}
                                // onBlur = {this.onBlur}
                                onChange = {this.onChange}
                                autoFocus = {true}
                            />
                        </div>
                        <div className="req-comment" onClick={this.handleClick}>发送</div>
                    </div>
                </div> ,
            portalBody)
        )
        
    }
}

const mapStateToProps = (state) => ({
    userId: getVal(state, 'campUserInfo.userId'),
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentInput)
