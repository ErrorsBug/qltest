import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Timer from 'components/timer';
import Progress from './progress'

@autobind
class GroupPost extends Component {

    state = {
	    isTimeOver: false
    };

	timeFinish(){
	    this.setState({
		    isTimeOver: true
        })
    }

    render(){
	    return (
		    this.props.groupInfo.groupStatus === 'ING'?
			    (
			        this.state.isTimeOver ?
                        <div className="group-post">
                            拼团已结束
                        </div>
					    :
                        <div className="group-post">
                            <div className="group-num">仅剩<var>{this.props.groupInfo.groupNum-this.props.groupInfo.joinNum}</var>个名额</div>
                            <div>剩余
                                <Timer durationtime={this.props.groupInfo.endTime - this.props.currentTime} onFinish={this.timeFinish}/>
                                结束</div>
                            <Progress
                                groupNum={this.props.groupInfo.groupNum}
                                joinNum={this.props.groupInfo.joinNum}
                            />
                            <div className="leader-name">团长：{this.props.leaderName}</div>
                        </div>

			    )
			    :
			    (
				    this.props.groupInfo.groupStatus === 'PASS'?
                        <div className="group-post">
                            拼团已拼满
                        </div>
					    :
                        <div className="group-post">
                            拼团已结束
                        </div>
			    )
	    )
    }
}


export default GroupPost;

