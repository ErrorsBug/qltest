import React from 'react';

import { formatMoney, formatDate, imgUrlFormat} from '../util'

/*  returnMoney: 返现金额 
    inviteNum:邀请人数
    missionStatus: N = 不是拉人返现,  Y = 是拉人返现,进行中, SUCCESS:返现成功, FAIL:失败 
*/
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

const ProfitList = props => {
    return (
        <ul className="co-profit-list">
            {
                props.list.map((item, index) => {
                    const logoUrl = item.headUrl ? item.headUrl : 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png'
                    return <li key={`profit-item-${index}`}>
                        <div className="profit-item-left">
                            <img className="profit-item-img" src={imgUrlFormat(item.headUrl, '@324w_200h_1e_1c_2o')} alt=""/>
                            <section>
                                <h1>{item.userName}</h1>
                                <p>
                                    支付了<var>￥{item.amount}</var>
                                    {
                                        item.source == 'iap' ?
                                        <span className="ios-plan">
                                            订单来自IOS APP
                                            <i className="ios-icon"></i>
                                        </span>
                                        : null
                                    }
                                </p>
                                
                                <time>{formatDate(item.createTime,'yyyy-MM-dd hh:mm:ss')}</time>
                            </section>
                        </div>
                        
                        <div className="profit-item-right">
                            <span className="str_1">+{item.money}</span>
                            {pullMan(item)}
                        </div>
                    </li>
                })
            }
        </ul>
    );
};

ProfitList.propTypes = {
    
};

export default ProfitList;