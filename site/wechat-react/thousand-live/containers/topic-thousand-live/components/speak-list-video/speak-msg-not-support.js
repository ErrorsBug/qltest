import React from 'react';
import SpeakMsgContainer from './speak-msg-container';

class NotSupportMsg extends React.PureComponent {

    render() {
        return (
            <SpeakMsgContainer
                {...this.props}
            >
                <div className="no-support msg-text">
                    <pre className="div-p">
                        不支持的消息类型
                    </pre>
                </div>
            </SpeakMsgContainer>
        );
    }
}

export default NotSupportMsg;