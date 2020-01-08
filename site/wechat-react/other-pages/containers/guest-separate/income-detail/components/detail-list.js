import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate,formatMoney } from 'components/util';

const pullMan = (item) => {
    switch(item.missionStatus) {
        case 'N': 
            return null;
        case 'Y':
            return <div className="pull-type pull-y">预返学费冻结中￥{formatMoney(item.returnMoney, 1)}</div>
        case 'SUCCESS':
            return <div className="pull-type pull-y">邀{item.inviteNum}人返学费￥{formatMoney(item.returnMoney, 1)}</div>
        case 'FAIL':
            return <div className="pull-type pull-fail">用户返学费失败 +￥{formatMoney(item.returnMoney, 1)}</div>
    }
}
class DetailList extends Component {

    membershipSourceTag(source){
        if(!source) return null
        if(source.toLowerCase() === 'member_send_course'){
            return (
                <div className="membership-tag">会员赠课</div>
            )
        }else if(source.toLowerCase().match('member')){
	        return (
                <div className="membership-tag">会员购课</div>
	        )
        }
    }

    render() {
        const listData=this.props.item.map((val,index)=>{
            return <div className="detail-li" key={`detail-li-${index}`}>
                    {
                        this.props.businessType=="channel"?
                        <span className={`${val.type==="CHANNEL"?"picbox channel":"picbox gift"}`}></span>
                        :
                        <span className={`${val.type==="TOPIC"?"picbox channel":"picbox gift"}`}></span>
                    }
                    {
                        this.props.businessType=="channel"?
                        <span className="type">
                            {val.type==="CHANNEL"?"系列课入场券":"系列课赠礼"}
                            {this.membershipSourceTag(val.source)}
                        </span>
                        :
                        (
                            this.props.businessType=="camp"?
                            <span className="type">
                                {val.type==="CAMP"?"训练营入场券":"训练营赠礼"}
	                            {this.membershipSourceTag(val.source)}
                            </span>
                            :
                            <span className="type">
                                {val.type==="TOPIC"?"课程入场券":"课程赠礼"}
	                            {this.membershipSourceTag(val.source)}
                            </span>
                        )
                    }
                    
                    
                    <span className="percent">当前比例：<var>{val.sharePercent}%</var></span>
                    <span className="time">{formatDate(val.createTime,"yyyy-MM-dd hh:mm:ss")}</span>
                    <span className="money">+ {formatMoney(val.money)}</span>
                    <span className="buyer">购买者 {val.consumerName}</span>
                    {
                        pullMan(val)
                    }
                </div>;  
        });
        return (
            <div>
                {listData}
            </div>
        );
    }
}

DetailList.propTypes = {

};

export default DetailList;