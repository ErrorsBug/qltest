import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SpeakMsgContainer from './speak-msg-container';
import { locationTo } from 'components/util';

class WhisperItem extends Component {

    get answerRole () {
        switch (this.props.answerRole) {
            case 'guest':
                return '嘉宾';
            case 'compere':
                return '特邀主持人';
            case 'topicCreater':
                return '主持人';
            default:
                return '神秘人';
        }
    }

    onLink() {
        locationTo(`/live/whisper/question.htm?questionId=${this.props.commentId}`);
    }

    render() {
        return (
            <SpeakMsgContainer
                {...this.props}
            >
                <main className='whisper-item-container on-log'
                    onClick={ this.onLink.bind(this) }
                    data-log-region="speak-list"
                    data-log-pos="whisper-msg"
                    data-log-business_id={this.props.commentId}
                    >
                    <p>{ this.answerRole }{ this.props.speakCreateByName }回复了</p>
                    <p>{ this.props.content }</p>

                    <span className='listen-reply'>点击听回答</span>
                </main>
            </SpeakMsgContainer>
        );
    }
}

WhisperItem.propTypes = {

};

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {

}

export default connect(mapStateToProps, mapActionToProps)(WhisperItem);
