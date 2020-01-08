import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Progress from './progress'

/**
 * 未购买，拼课已满
 */
class FullGroup extends Component {
    
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
        console.log(333, this.props.groupResult)
        return (
            <div>
                {/* <Progress
                    groupNum={this.props.groupNum}
                    joinNum={this.props.joinNum}
                    status="fail"
                /> */}
                <div className="end-status-wrap">
                    <div className="progress-status-left">
                        <img src={require('../images/reject.png')}></img>
                        <span className="status-word">拼课已结束...</span>
                    </div>
                </div>
                <div className='btn-row'>
                    {
                        this.props.groupResult === 'SUCCESS' ?
                            <span className='green-empty' onClick={ this.props.onToChannelBtnClick }>进入课程</span>
                            :
                            // <span className='red' onClick={ this.props.openGroup }>
                            //     {
                            //         this.props.discountStatus === 'GP' ?
                            //             `一键开团￥${this.props.groupDiscount}`
                            //             :
                            //             '一键免费开团'
                            //     }
                            // </span>
                            <span className='red' onClick={ this.props.onClick }>查看课程</span>
                    }
                </div>
            </div>
        );
    }
}

FullGroup.propTypes = {
	// 一键开团
	openGroup: PropTypes.func.isRequired,
    // 跳转系列课主页
	onToChannelBtnClick: PropTypes.func.isRequired
};

export default FullGroup;
