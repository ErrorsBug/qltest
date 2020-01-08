import React from 'react';
import PropTypes from 'prop-types';
import {
    locationTo,
    imgUrlFormat,
    formatMoney,
} from 'components/util';



const ShopList = (props) => {
    return (
        <ul className='shop-list-ul'>
            {
                props.shopList.map((channel,index)=>{
                    
                    return (
                        (props.isPushList&&channel.display)||(!props.isPushList)?
                        <li key={`shop-list-li${index}`} 
                            onClick={()=>{
                                let shareUrl = channel.url||(channel.businessType==="CHANNEL"?
                                window.location.origin + "/wechat/page/channel-intro?channelId="+channel.businessId+"&source=coral"
                                :
                                window.location.origin+'/topic/details?topicId='+channel.businessId+'&source=coral');
                                locationTo(shareUrl);
                            }}
                            className={`shopListItem-${props.tagId}-${index}`}
                        >
                            <div className="info-box on-log on-visible"
                                data-log-region="push-item"
                                data-log-pos={index}
                            >
                                <div className={`business-pic ${channel.flag}`}>
                                    <img src={imgUrlFormat(channel.businessImage || channel.backgroundUrl,"@148h_240w_1e_1c_2o")} alt=""/>
                                </div>
                                <div className="business-info">
                                    
                                    <div className="name elli-text">{channel.businessName}</div>
                                    <div className="live">{channel.liveName}</div>
                                    
                                        <div className="price"><span>售价：</span>￥{channel.isAuditionOpen !== 'Y'?formatMoney(channel.amount || channel.money,100):0}</div>
                                    
                                    
                                    
                                    
                                </div>
                            </div>
                            {
                                props.isRank&&index<10?<i className={index<=2?"rank-num1":"rank-num2"}>{index+1}</i>:null
                            }
                            <div className={`btn-box ${!props.identity ? 'shop-hide' : ''}`}>
                                {
                                    channel.audioStatus=='playing' ?
                                        <div className={props.weightShow?"pause-btn weightShow":"pause-btn"} onClick={(e)=>props.onListenAudioPause(e,index,"normal")}>暂停试听<var className="audio-percent">{Number(props.playedDuration/channel.totalSeconds*100).toFixed(0)}%</var></div>
                                            :
                                        (
                                            channel.audioStatus =='loading' ?
                                                <div className="audition-loading">正在加载</div>
                                                :
                                                <div className="audition-btn on-log" data-log-region="btn-listen-now" onClick={e => props.onListenAudioPlay(e,index,"normal")}>立即试听</div>
                                        )

                                }
                                <div className="push-income on-log" data-log-region="btn-expect-income">
                                    <span>预计收益：</span>￥{channel.isAuditionOpen !== 'Y'?formatMoney(Number((channel.percent || props.bachelorRecommendProfit) * (channel.amount || (channel.money||0))/100).toFixed(2),100):0}
                                </div>
                                {
                                    channel.shared || props.isPushList?
                                    <div className="sale-btn on-log" data-log-region="btn-push-now" onClick={e => {
                                        e.stopPropagation();
                                        props.showCoralPromoDialog(channel);
                                    }}>立即推广</div>
                                    :
                                    <div className="join-btn" onClick={e => {
                                        e.stopPropagation(); 
                                        props.setCoralPushJoin(channel,props.tagId,index);
                                    }}>加入推广</div>
                                }
                                

                            </div>
                        </li>
                        :null
                    )
                })
            }
                        
        </ul>
    );
};

ShopList.propTypes = {
    shopList: PropTypes.array.isRequired,
};

export default ShopList;
