import React, { Component } from 'react';
import  { digitFormat } from 'components/util';

class InvitationData extends Component {
    render() {
        return (
            <div 
                className="invitation-data"
            >
                {
                    this.props.invitationList.length > 0 ?
                    this.props.invitationList.map((item, idx) => {
                        return (
                            <div className="list-con" key={idx}>
                                <div className="head-name">
                                    <img className='head-img' src={item.headUrl + "?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100"} alt="" />
                                    <div className="name">{item.name}</div>
                                </div>
                                <ul className="invite-data">
                                    <li>
                                        <span className="num">{digitFormat(item.inviteNum,10000)}</span>
                                        <span className="prefix">邀请数</span>
                                    </li>    
                                    <li>
                                        <span className="num">{digitFormat(item.applyNum,10000)}</span>
                                        <span className="prefix">成交</span>
                                    </li>    
                                    <li>
                                        <span className="num">{item.inviteNum == 0 ? 0 : parseFloat((item.applyNum / item.inviteNum * 100).toFixed(2))}%</span>
                                        <span className="prefix">转化率</span>
                                    </li>    
                                </ul>
                            </div>
                        )
                    })
                    : 
                    <div className="no-inviter">
                        <div className="no-inviter-img"></div>
                        <div className="no-inviter-text">暂时没有邀请者</div>
                    </div>
                }
            </div>
        );
    }
}

export default InvitationData;