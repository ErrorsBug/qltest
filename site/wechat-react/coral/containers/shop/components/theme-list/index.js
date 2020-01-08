import React from 'react';
import PropTypes from 'prop-types';
import {
    locationTo,
    imgUrlFormat,
    formatMoney,
} from 'components/util';



const ThemeList = (props) => {
    return (
        <ul className={`theme-list-ul ${props.stylemodule}`}>
            {
                props.shopList.map((item,index)=>{
                    item.businessImage = item.picture;
                    item.amount = (item.discountStatus?item.discount:item.money);
                    return (
                        item.displayStatus=="Y"?
                        <li key={`shop-list-li${index}`} 
                            onClick={()=>{
                                let shareUrl='';
                                shareUrl = item.url||(item.businessType==="CHANNEL"?
                                window.location.origin + "/live/channel/channelPage/"+item.businessId+".htm"
                                :
                                window.location.origin+'/topic/details?topicId='+item.businessId);
                                locationTo(shareUrl);
                            }}
                            // className={`shopListItem-${index}`}
                        >
                            <div className="info-box">
                                <div className={`business-pic`}>
                                    <img src={imgUrlFormat(item.picture,"@148h_240w_1e_1c_2o")} alt=""/>
                                </div>
                                <div className="business-info">
                                    
                                    <div className="name elli-text">{item.businessName}</div>
                                    {
                                        item.isAuditionOpen !=='Y'?
                                        <div className="price">
                                            {
                                                item.discountStatus=='P'||item.discountStatus=='GP'?
                                                <span><var className="price-type">拼</var>￥{formatMoney(item.discount,100)}</span>
                                                :
                                                (
                                                    item.discountStatus=='Y'?
                                                    <span><var className="price-type">惠</var>￥{formatMoney(item.discount,100)}</span>
                                                    :
                                                    null
                                                )
                                            }
                                            
                                            <span className={item.discountStatus ==="N"||!item.discountStatus?"push-income":"push-income delete"}> ￥{formatMoney(item.money,100)} </span> 
                                        </div>
                                        :
                                        <div className="price">                                        
                                            <span className="push-income"> ￥0 </span>
                                        </div>
                                    }
                                    
                                    {
                                        props.isCoralJoin?
                                        <div className="btn-push" 
                                            style={{background:props.buttonColor}}
                                            onClick={e => {
                                                e.stopPropagation();
                                                props.showCoralPromoDialog(item);
                                            }}>{props.buttonText||'分享赚'}<i className="icon-gang"></i>￥{item.isAuditionOpen !=='Y'?((item.discountStatus?item.discount:item.money)*item.percent/10000).toFixed(2):0}
                                        </div>
                                        :
                                        <div 
                                            className="btn-join on-log"
                                            data-log-name={"购买按钮-位次" + (index+1)}
                                            data-log-region="special-list"
                                            data-log-pos={index + 1} 
                                            style={{background:props.buttonColor}}
                                        >{props.pButtonText||'立即参与'}</div>
                                    }
                                    
                                </div>
                            </div>
                        </li>
                        :null
                    )
                })
            }
                        
        </ul>
    );
};

ThemeList.propTypes = {
    shopList: PropTypes.array.isRequired,
};

export default ThemeList;
