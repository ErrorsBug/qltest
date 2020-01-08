import React from 'react';
import PropTypes from 'prop-types';

const MarketTool = props => {

    return (
    <div className="marketing" id="marketing" onClick={props.marketFunc.bind(this)}>
        {
            props.isShowMarketList?
            <dl>
                <dt>营销工具设置</dt>
                {
                    props.channelInfo&&props.channelInfo.chargeType === 'absolutely'?
                    <dd className="marketing_ying">
                        <a href={`/wechat/page/channel-market-seting?channelId=${props.channelId}`}>
                        <i></i>
                            课程促销
                        {
                            props.marketsetInfo&&props.marketsetInfo.discountStatus === 'N'?
                            <span className="isset">未设置</span>
                            :
                            <span className="isset ted">已设置</span>
                        }
                        </a>
                    </dd>
                    :null
                }
                
                <dd className="marketing_bo">
                    <a href={`/wechat/page/channel-distribution-set/${props.channelId}`}>
                        <i></i>
                        分销推广
                        {
                            props.isOpenShare === 'Y'?
                            <span className="isset ted">已设置</span>
                            :
                            <span className="isset">未设置</span>
                        }
                    </a>
                </dd>
                <dd className="marketing_psw">
                    <a  href={`/live/channelCoupon/codeList.htm?channelId=${props.channelId}`}>
                        <i></i>
                        优惠码设置
                        {
                            props.couponsetInfo&&props.couponsetInfo.status === 'Y'?
                            <span className="isset ted">已设置</span>
                            :
                            <span className="isset">未设置</span>
                        }
                    </a>
                </dd>
            </dl>
            :null
        }
		
	</div>
    );
};

MarketTool.propTypes = {
    
};

MarketTool.defaultProps = {

}

export default MarketTool;
