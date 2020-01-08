import React from 'react';
import PropTypes from 'prop-types';
import {
    locationTo,
    imgUrlFormat,
    formatMoney,
} from 'components/util';



const RankList = (props) => {

    return (
        <div className="rank-section">
            <div className="section-title rank-title">
                <span>排行榜</span>
                <span className="rank-more" onClick={()=>locationTo("/wechat/page/coral/shop/rank-list")}>更多<i className="icon_enter"></i></span>
            </div>
            <div className="list-box">
                <ul>
                    {
                        props.rankCourseList.map((item,index)=>{
                            return (
                                <li 
                                    className="on-log"
                                    data-log-name={'排行榜-第' + (index + 1)  + '名'}
                                    data-log-region="sh-rink"
                                    data-log-pos={'rink' + (index+1)}
                                    key={`rank-list-${index}`} 
                                    onClick={()=>locationTo(item.url)}
                                >
                                    <i className={index<=2?"rank-num1":"rank-num2"}>{index+1}</i>
                                    <div className="pic">
                                        <img src={`${item.businessImage}@148h_240w_1e_1c_2o`} />
                                    </div>
                                    <div className="info">
                                        <div className="name elli-text">{item.businessName}</div>
                                        <div className="money">售价:￥{item.isAuditionOpen !=='Y'?formatMoney(item.money):0} </div>
                                        <div className="income"><i className="zhuan">赚</i> ￥{item.isAuditionOpen !=='Y'?formatMoney(item.money * ((item.percent || props.bachelorRecommendProfit) / 100)):0}</div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            
        </div>
        
    );
};

RankList.propTypes = {
	rankCourseList: PropTypes.array.isRequired,
};

export default RankList;
