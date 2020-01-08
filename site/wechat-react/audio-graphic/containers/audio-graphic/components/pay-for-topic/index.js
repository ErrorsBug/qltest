import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';
import { locationTo, formatMoney } from 'components/util';

class PayForTopic extends Component {

    jump() {
        locationTo(
            `/live/channel/channelPage/${this.props.topicInfo.channelId}.htm?shareKey=${this.props.shareKey || ''}`,
            `/pages/channel-index/channel-index?channelId=${this.props.topicInfo.channelId}&shareKey=${this.props.shareKey || ''}`
        )
    }

    render() {
        return (
            <MiddleDialog
            show={this.props.show}
            theme='empty'
            bghide
            close={true}
            titleTheme={'white'}
            className="pay-for-topic-dialog"
            onClose={this.props.onClose}
        >
        {
            this.props.channelInfo ?
                <div className='main'>
                    <div className="msg">
                        你还没有购买本课程，<br/>
                        购买后可完整收听本课程并进行评论   
                    </div>
                    <div className="btn-pay-channel" onClick={ this.jump.bind(this) }>购买系列课</div>    
                        
                    {
                        (this.props.topicInfo.isSingleBuy == 'Y' && this.props.channelInfo.chargeConfigs[0].amount !== 0)?
                                <div className="btn-pay-topic" onClick={() => { this.props.onClose(); this.props.payForTopic();}}>单买：￥{formatMoney(this.props.topicInfo.money)}</div>
                        :null
                    }
                </div>
            :
                <div className="main">
                    <div className="msg">该课属于打卡训练营，请先参与打卡</div>
                    <div className="btn-pay-topic" onClick={() => { this.props.onClose(); locationTo(`/wechat/page/camp-detail?campId=${this.props.topicInfo.campId}`)}}>参与打卡</div>
                </div>

        }
        </MiddleDialog>
            
        );
    }
}

PayForTopic.propTypes = {

};

export default PayForTopic;