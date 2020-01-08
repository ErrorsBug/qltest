import React, { Component } from 'react';
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@autobind
class ReprintBtn extends Component {

    state = {
        /** 
         * 转载区显示状态 
         * bar - 条状
         * btn - 按钮状
         * */
        viewState: 'bar',
    }

    componentDidMount() {
        this.startTimer()
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    timer = null

    startTimer() {
        this.timer = setTimeout(() => {
            this.setState({ viewState: 'btn' })
        }, 4 * 1000);
    }

    gotoKnowmall() {
        const { channelId, liveId } = this.props
        location.href = `/wechat/page/live-studio/media-market?selectedChannelId=${channelId}`
    }

    render() {
        const { viewState } = this.state
        return (
            <div>
                {
                    viewState === 'btn' &&
                    <ReactCSSTransitionGroup
                        transitionName="channel-reprint-animation-btn"
                        transitionEnterTimeout={350}
                        transitionLeaveTimeout={350}>
                        <div className='comp-channel-reprint-btn on-log'
                             onClick={this.gotoKnowmall}
                             data-log-name="转载"
                             data-log-region="comp-channel-reprint-btn"
                        >
                            转载
                        </div>
                    </ReactCSSTransitionGroup>
                }
                {
                    viewState === 'bar' &&
                    <ReactCSSTransitionGroup
                        transitionName="channel-reprint-animation-bar"
                        transitionEnterTimeout={350}
                        transitionLeaveTimeout={350}>
                        <div className='comp-channel-reprint-bar' onClick={this.gotoKnowmall}>
                            该课支持转载售卖，每单赚{this.props.profit}起
                        </div>
                    </ReactCSSTransitionGroup>

                }
            </div>
        );
    }
}

ReprintBtn.propTypes = {
    profit: PropTypes.number.isRequired,
    channelId: PropTypes.number.isRequired,
    liveId: PropTypes.string.isRequired,
};

export default ReprintBtn;