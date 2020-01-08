import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'components/timer';
import Progress from './progress'

/**
 * 发起者 团长 团员
 */
const Sponser = (props) => {
    return (
        <div>
            <Progress
                groupNum={props.groupNum}
                joinNum={props.joinNum}
                status="pedding"
            />
            <div className='timer-container'>
                剩余时间
                <Timer durationtime={ props.second } onFinish={ props.onFinish } notSecond={true}></Timer>
            </div>

            

            <div className='btn-row'>
                <span className='red' onClick={ props.onShareClick }>发送好友一起拼
                    {/* {
                        props.platformShareProfit ?
                            ` (赚￥${props.platformShareProfit})`
                        :props.channelShareProfit ?
		                    ` (赚￥${props.channelShareProfit})`
                            :
                            (
	                            props.coralProfit ?
		                            ` (赚￥${props.coralProfit})`
		                            :
		                            props.autoShareProfit &&
		                            ` (赚￥${props.autoShareProfit})`
                            )
                    } */}
                </span>
                {/* {
                    props.groupType === 'charge' && (props.shareTime > 0 || Date.now() - props.createTime > 5 * 60 * 1000 ) &&
                    <span className='green-empty' onClick={ props.onToChannelBtnClick }>进入听课</span>
                } */}
            </div>

           
        </div>
    );
};

Sponser.propTypes = {
    // 倒计时回调
    onFinish: PropTypes.func.isRequired,

    // 一共多少人
	groupNum: PropTypes.number.isRequired,

    // 多少人参加了
	joinNum: PropTypes.number.isRequired,

    // 还差多少人
    peopleNum: PropTypes.number.isRequired,

    // 剩余多少秒
    second: PropTypes.number.isRequired,

    // 邀请好友的按钮点击事件
    onShareClick: PropTypes.func.isRequired,

    // 进入听课
	onToChannelBtnClick: PropTypes.func
};

export default Sponser
