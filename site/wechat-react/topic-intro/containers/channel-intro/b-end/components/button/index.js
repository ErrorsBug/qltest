import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
    locationTo,
    formatMoney,
} from 'components/util';

export const B_Button = ({ 
        children, 
        channelId, 
        sourceChannelId, 
        chargeConfigs, 
        isRelay, 
        isOrNotListen, 
        authStatus, 
        audioStatus, 
        percent, 
        handleTryListen 
    }) => {
    if (isRelay == 'N') {
        return (
            ''
            // <section className='button-container client-b'>
            //     {children}
            //     <a href={`/live/channel/addChannel.htm?channelId=${channelId}`} className='setting item'><i className='icon-setting' />编辑</a>
            // </section>
        );
    //是转载系列课
    } else {
        // 是白名单或者已购买
        if (isOrNotListen || authStatus == 'Y') {
            return (
                ''
                // <section className='button-container client-b'>
                //     <a href={`/live/channel/addChannel.htm?channelId=${channelId}`} className='setting item'><i className='icon-setting' />编辑</a>
                // </section>
            )
        } else {    // 没有购买或者非白名单显示试听按钮
            return (
                <section className='button-container client-b'>
                    {/* <a href={`/live/channel/addChannel.htm?channelId=${channelId}`} className="edit-btn"><div className="edit-icon"></div>编辑</a> */}
                    {
                        audioStatus == 'playing' ? 
                        <div className="listen" onClick={handleTryListen}>
                            <span className="icon-pause"></span>
                            <span>暂停试听</span>
                            <span className="percent">{percent + '%'}</span>
                        </div> :
                        audioStatus == 'pause' ?
                        <div className="listen" onClick={handleTryListen}>
                            <span className="icon-play"></span>
                            <span>开始试听</span>
                            <span className="percent">{percent + '%'}</span>
                        </div> :
                        <div className="listen" onClick={handleTryListen}>
                            <span className="icon-play"></span>
                            <span>开始试听</span>
                        </div>
                    }
                    <a href={`/live/channel/channelPage/${sourceChannelId}.htm?orderNow=Y`} className='buy-btn'>购买系列课</a>
                </section>
            )
        }
    }
};

const C_Button = ({
    children,
    onBuyBtnClick,
    onBuyFreeBtnClick,
    chargeStatus,
    discount,
    discountStatus,groupId,groupcreateId,
    chargeConfigs,
    channelId,
    isCouponLinkShow,
    channelSatus,
    vipInfo,
    onClickConsult,onClickPin,onClickPinPay,
    shareKey,
    isRelay,
    chargeType,

    isLiked,
    likeHandle,

    continuePlayClick,
    toLiveHandle,

    cutInfo,
    userId,
    domainUrlCut,
    cutAnimate,
    isShowCutButton,

    isBought,
}) => {
    if (chargeStatus || (vipInfo && (vipInfo.isVip === 'Y'|| vipInfo.isCustomVip === 'Y'))) {
        return (
            <section className='button-container client-c'>
                {children}
                <ConsultBtn isCouponLinkShow={isCouponLinkShow} isyuan={true} onClickConsult={onClickConsult} isBought={isBought} />
                <LikeBtn isLiked={isLiked} channelId={isLiked} likeHandle={likeHandle} isBought={isBought} />
                <LiveBtn toLiveHandle={toLiveHandle} isBought={isBought}/>
                <div onClick={continuePlayClick} className="charge-btn on-log" 
                    data-log-region="channel"
                    data-log-pos="bottom"
                    data-log-type="go-to-course"
                     data-log-status={isBought ? 'bought' : ''}
                >   
                    
                        <span className='text-box'>
                            进入课程
                            {
                                vipInfo && (vipInfo.isVip === 'Y'|| vipInfo.isCustomVip === 'Y') ?
                                    <i className='icon-customized-vip'></i> :
                                    null        
                            }      
                        </span>  
                       
                </div>
            </section>
        )
    } else if (chargeConfigs[0].amount == 0) {
        return (
            <section className='button-container client-c'>
                {children}
                <span className={isCouponLinkShow ? 'consult-btn right on-log' : 'consult-btn on-log'}
                      onClick={onClickConsult}
                      data-log-name="咨询"
                      data-log-region="consult-btn"
                      data-log-status={isBought ? 'bought' : ''}
                >
                    <img src={require('../../img/consult.png')} alt="" />
                    <span>咨询</span>
                </span>
                <LikeBtn isLiked={isLiked} channelId={isLiked} likeHandle={likeHandle} isBought={isBought}/>
                <LiveBtn toLiveHandle={toLiveHandle} isBought={isBought}/>
                <div onClick={() => onBuyFreeBtnClick(chargeConfigs[0].id)}
                     className="charge-btn on-log"
                     data-log-name="免费报名"
                     data-log-region="free-charge-btn"
                >免费报名</div>
            </section>
        );
    }else if(discountStatus=="P" || discountStatus == 'GP'){
        if(groupId&&groupcreateId!=groupId){
            return (
                <section className='button-container client-c'>
                    {children}
                    <ConsultBtn isCouponLinkShow={isCouponLinkShow} onClickConsult={onClickConsult} isBought={isBought} />
                    <LikeBtn isLiked={isLiked} channelId={isLiked} likeHandle={likeHandle} isBought={isBought}/>
                    <LiveBtn toLiveHandle={toLiveHandle} isBought={isBought}/>
                    <div className='charge-btn' onClick={onClickPinPay}>
                        一键拼课￥{chargeConfigs[0].discount}
                    </div>
                </section>
            );
        }else{
            return (
                <section className='button-container client-c'>
                    {children}
                    <ConsultBtn isCouponLinkShow={isCouponLinkShow} isyuan={true}  onClickConsult={onClickConsult} isBought={isBought} />
                    <LikeBtn isLiked={isLiked} channelId={isLiked} likeHandle={likeHandle} isBought={isBought}/>
                    <LiveBtn toLiveHandle={toLiveHandle} isBought={isBought}/>
                    <div onClick={onBuyBtnClick}
                         className="chargeyuan-btn on-log"
                         data-log-name="原价购买"
                         data-log-region="chargeyuan-btn"
                    >
                        <span className='old-money'>￥{chargeConfigs[0].amount}</span>{/*原价*/}
                        {
                            channelSatus && channelSatus.couponId && channelSatus.qlCouponMoney && isRelay !== 'Y'
                                ? <span className='coupon-money'>
                                    已优惠￥{channelSatus.qlCouponMoney > chargeConfigs[0].amount
                                        ? chargeConfigs[0].amount
                                        : channelSatus.qlCouponMoney
                                    }
                                </span>
                                : <span className='coupon-money'>原价购买</span>
                        }
                    </div>
                    {
	                    groupcreateId?
                            <div className='pin-btn' onClick={() => locationTo(`/topic/channel-group?channelId=${channelId}&groupId=${groupcreateId}&type=sponser`)}>查看拼课</div>
                        :
                            <div className='pin-btn on-log'
                                 onClick={onClickPin}
                                 data-log-name="一键开团"
                                 data-log-region="pin-btn"
                            >
			                    {
				                    discountStatus === 'P' ?
					                    '免费拼课'
                                        :
                                        <span> <div className="coupon-money"> ￥{discount} </div>一键开团  </span>
			                    }
                            </div>
                    }
                    {
                        isShowCutButton?
                        (
                            cutInfo.minimumAmount<=0?
                            <div className={`pin-btn ${cutAnimate?'cut':''}`} onClick={() => locationTo(`${domainUrlCut}activity/page/cut-price?businessType=CHANNEL&businessId=${channelId}&applyUserId=${userId}`)}>砍价免费听</div>
                            :
                            <div className={`pin-btn ${cutAnimate?'cut':''}`} onClick={() => locationTo(`${domainUrlCut}activity/page/cut-price?businessType=CHANNEL&businessId=${channelId}&applyUserId=${userId}`)}>
                                <span className='coupon-money'>￥{formatMoney(cutInfo.minimumAmount)}</span>
                                砍价超值购
                            </div>
                        )
                        :null

                    }
                </section>
            );
        }
    }else if(cutInfo.personNum>0&&isShowCutButton){//砍价功能入口及发起砍价按钮
        return (
            <section className='button-container client-c'>
                    {children}
                    <ConsultBtn isCouponLinkShow={isCouponLinkShow} isyuan={true}  onClickConsult={onClickConsult} isBought={isBought} />
                    <LikeBtn isLiked={isLiked} channelId={isLiked} likeHandle={likeHandle} isBought={isBought}/>
                    <LiveBtn toLiveHandle={toLiveHandle} isBought={isBought}/>
                    <div onClick={onBuyBtnClick}
                         className="chargeyuan-btn on-log"
                         data-log-name="原价购买"
                         data-log-region="chargeyuan-btn"
                    >
                        <span className='old-money'>￥{chargeConfigs[0].amount}</span>{/*原价*/}
                        {
                            channelSatus && channelSatus.couponId && channelSatus.qlCouponMoney && isRelay !== 'Y'
                                ? <span className='coupon-money'>
                                    已优惠￥{channelSatus.qlCouponMoney > chargeConfigs[0].amount
                                        ? chargeConfigs[0].amount
                                        : channelSatus.qlCouponMoney
                                    }
                                </span>
                                : <span className='coupon-money'>原价购买</span>
                        }
                    </div>
                    {//留意域名问题，域名后面有/,不需要加斜杠了
                        cutInfo.minimumAmount<=0?
                        <div className={`pin-btn ${cutAnimate?'cut':''}`} onClick={() => locationTo(`${domainUrlCut}activity/page/cut-price?businessType=CHANNEL&businessId=${channelId}&applyUserId=${userId}`)}>砍价免费听</div>
                        :
                        <div className={`pin-btn ${cutAnimate?'cut':''}`} onClick={() => locationTo(`${domainUrlCut}activity/page/cut-price?businessType=CHANNEL&businessId=${channelId}&applyUserId=${userId}`)}>
                            <span className='coupon-money'>￥{formatMoney(cutInfo.minimumAmount)}</span>
                            砍价超值购
                        </div>
                    }
                </section>
        );
    } else {
        return (
            <section className='button-container client-c'>
                {children}
                <ConsultBtn isCouponLinkShow={isCouponLinkShow} onClickConsult={onClickConsult} isBought={isBought} />
                <LikeBtn isLiked={isLiked} channelId={isLiked} likeHandle={likeHandle} isBought={isBought}/>
                <LiveBtn toLiveHandle={toLiveHandle} isBought={isBought}/>
                <div onClick={onBuyBtnClick}
                     className="charge-btn on-log"
                     data-log-name="购买系列课"
                     data-log-region="charge-btn"
                >
                    购买系列课
                    {
                        channelSatus && channelSatus.couponId && channelSatus.qlCouponMoney //&& isRelay !== 'Y'
                            ? <span className='coupon-money'>
                                （已优惠￥{channelSatus.qlCouponMoney > chargeConfigs[0].amount
                                    ? chargeConfigs[0].amount
                                    : channelSatus.qlCouponMoney
                                }）
                              </span>
                            : ''
                    }
                </div>
            </section>
        );
    }

};

const ConsultBtn=({ children, isCouponLinkShow,isyuan, onClickConsult, isBought }) => {
    return (
        <span className={isyuan ? 'consult-btn right on-log' : (isCouponLinkShow ? 'consult-btn right on-log' : 'consult-btn on-log')}
              onClick={onClickConsult}
              data-log-name="咨询"
              data-log-region="consult-btn"
              data-log-status={isBought ? 'bought' : ''}
        >
            <img src={require('../../img/consult-icon.png')} alt="" />
            <span>咨询</span>
        </span>
    );
};
const LikeBtn=({isLiked, channelId, likeHandle, isBought}) => {
    return (
        <span className="like-btm right on-log"
              onClick={likeHandle}
              data-log-name="收藏"
              data-log-region="like-btm"
              data-log-status={isBought ? 'bought' : ''}
        >
            {
                isLiked ? <img src={require('../../img/collected.png')} alt="" />
                :
                <img src={require('../../img/collect.png')} alt="" />
            }
            {
                isLiked ? <span>已收藏</span>
                :
                <span>收藏</span>
            }
            
        </span>
    )
}
const LiveBtn = ({toLiveHandle, isBought}) => {
    return (
        <span className="live-btn right on-log" onClick={toLiveHandle}
              data-log-name="直播间"
              data-log-region="live-btn"
              data-log-status={isBought ? 'bought' : ''}
        >
            <img src={require('../../img/to-live2.png')} alt="" />
            <span>直播间</span>
        </span>
    )
}

const Button = (props) => {
    return props.client === 'C' ?
        <C_Button {...props}>{props.children}</C_Button> 
        :
        <B_Button {...props}>{props.children}</B_Button>;
};

Button.propTypes = {
    client: PropTypes.oneOf(['B', 'C']),
    chargeType: PropTypes.string,
    chargeConfigs: PropTypes.array,
    vipInfo: PropTypes.any,
    channelId: PropTypes.number,
    onBuyBtnClick: PropTypes.func,
    chargeStatus: PropTypes.any,
    isCouponLinkShow: PropTypes.bool,
    channelSatus: PropTypes.any,
    onClickConsult: PropTypes.func.isRequired,
    onClickPin:PropTypes.func.isRequired,
    onClickPinPay:PropTypes.func.isRequired,
    domainUrlCut:PropTypes.string,
    cutAnimate: PropTypes.bool,
};

Button.defaultProps = {
    client: 'B',
}

export default Button;
