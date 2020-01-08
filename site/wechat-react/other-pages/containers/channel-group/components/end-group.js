import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * 未购买，拼课已结束
 */
class EndGroup extends Component {
    
    state = {
        second: 5
    }

    componentDidMount() {
        // this.doTimer();
    }

    doTimer() {
        this.timer = setInterval(() => {
            if (this.state.second === 0) {
                clearInterval(this.timer);
                this.props.onFinish && this.props.onFinish();
            } else {
                this.setState({
                    second: this.state.second - 1
                });
            }
        }, 1000);
    }
    
    render() {
        return (
            <div>
                <div className="end-status-wrap">
                    <div className="progress-status-left">
                        <img src={require('../images/reject.png')}></img>
                        <span className="status-word">拼课已结束...</span>
                    </div>
                </div>

                <div className='btn-row'>
                    {/* <span className='red' onClick={ this.props.openGroup }>
                        {
                            this.props.discountStatus === 'GP' ?
                                `一键开团￥${this.props.groupDiscount}`
                                :
                                '一键免费开团'
                        }
                    </span> */}
                    <span className='red' onClick={ this.props.onChannelIntroClick }>查看课程</span> 
                </div>
            </div>
        );
    }
}

EndGroup.propTypes = {
    // 一键开团
    openGroup: PropTypes.func.isRequired,
};

export default EndGroup;