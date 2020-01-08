import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'components/timer';
import Progress from './progress'
// import {formateToDay,formatDate ,formatMoney } from 'components/util';

const GroupPost = (props) => {
    return (
        props.groupInfo.groupStatus=='ING'?
        (props.isTimeOver ?
            <div className="group-post">
                拼课已结束
            </div>
            :
            <div className="group-post">
                <div className="group-num">仅剩<var>{props.groupInfo.groupNum-props.groupInfo.joinNum}</var>个名额</div>
                <div>剩余 
                    <Timer durationtime={props.groupInfo.endTime - props.currentTime} onFinish={props.timeFinish}/> 
                    结束</div>
                <Progress
                    groupNum={props.groupInfo.groupNum}
                    joinNum={props.groupInfo.joinNum}
                />
                <div className="leader-name">团长：{props.leaderName}</div>
            </div>
            
        )
        :
        (
            props.groupInfo.groupStatus=='PASS'?
            <div className="group-post">
                拼课已拼满
            </div>
            :
            <div className="group-post">
                拼课已结束
            </div>
        )
            
        
    )



};

GroupPost.propTypes = {
    isTimeOver:PropTypes.bool,
    timeFinish:PropTypes.func,
};

export default GroupPost;

