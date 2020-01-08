import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { formatMoney, locationTo, imgUrlFormat } from '../../../components/util';

@autobind
export default class extends PureComponent {
    render() {
        const {  className,
                id,
                userId,
                status,
                money,
                desc,
                helpNum,
                cardDate,
                cardTime,
                createTime,
                updateTime,
                userName,
                userHeadImg,
                helpHeadImg=[],
                job } = this.props;

        const time =(new Date() ).getTime() 
        const date= Math.ceil((time-cardDate)/(1000*60*60*24))
        return (
            <div className={ `flag-item-box ${ className }` } onClick={this.props.onClick}>
                {
                    status=='success'||status=='pay'?
                    <div className="fi-status success"></div>
                    :status=='process'&&job=='mine'?
                    <div className="fi-status process"></div>
                    :status=='join'&&job=='mine'?
                    <div className="fi-status begin"></div>
                    :status=='fail'&&job=='mine'?
                    <div className="fi-status finish"></div>
                    :''
                }
                <div className="fi-head">
                    <div className="fi-avator">
                        <img src={imgUrlFormat(userHeadImg || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_120,w_120','/0')}/>
                    </div>
                    <div className="fi-right-path"> 
                        <div className="fi-name">{userName}</div>
                        <div className="fi-money">{status=='success'||status=='pay'?'已获奖':status=='join'&&job=='mine'?'待领取奖学金':'奖学金'}: ￥{formatMoney(money > 1500 ? money:1500)}</div>
                    </div>
                </div>
                <div className="fi-content">{desc}</div>
                {
                    <div className="fi-bottom">
                        { 
                             helpHeadImg&&helpHeadImg.map((item, index) => (
                                index<3&&<i className={ `icon${index}` } key={ index } style={{ zIndex: 4-index }}><img src={imgUrlFormat(item.userHeadImg|| item || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')}/></i>
                            )) 
                        }
                        {
                            helpHeadImg?.length>=3&&<i className="apply-user-more"></i>
                        }
                        

                        <span>{helpNum||0}位见证人  
                            {
                                job=='mine'&&helpNum<3?
                                `| 还差${3-(helpNum||0)}位哦`
                                :date>0?
                                `| 已坚持${date}天`  
                                :''
                            }
                         </span>
                    </div>
                }
                
            </div>
        )
    }
}