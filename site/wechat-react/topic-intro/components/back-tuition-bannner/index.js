import React, { Component } from 'react';
import PropTypes from 'prop-types';


class BackTuition extends Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    componentDidMount(){
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 50);
    }

    render(){
        let {missionDetail} = this.props
        return (
            <div className="back-tuition-banner on-visible on-log" data-log-region="returnFee" data-log-pos="1" onClick = {this.props.openBackTuitionDialog}>
                <div className="icon"></div>
                <div className="back-tuition">
                    <div className="how-much-money">你有学费待返还￥{missionDetail.returnMoney || 0}</div>
                    <div className="how-many-people">邀请{missionDetail.inviteTotal}人立返，你已邀请{missionDetail.inviteNum}人 ></div>
                </div>
                <div className="receive">立即领取<i className="icon_enter"></i></div>
            </div>
        )
    }
}

BackTuition.propTypes = {
    // 基础数据
    missionDetail: PropTypes.object.isRequired,
    // 打开弹窗
    openBackTuitionDialog: PropTypes.func.isRequired
};

export default BackTuition