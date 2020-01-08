import React from 'react';
import PropTypes from 'prop-types';
import { locationTo, imgUrlFormat } from 'components/util';

const VipCardMgr = ({ liveId, isOpenVip }) => {
    return (
        <header className='vip-card-container'>
            <span className='vip-title'>会员特权</span>
            
            <p className='vip-desc'>开启直播间VIP，更好为学员服务</p>

            <section className='icon-group-container'>
                <div className='icon-group'>
                    <img src={ require('../../img/vip-icon-v.png') } />
                    <span>尊贵标识</span>
                </div>

                <div className='icon-group'>
                    <img src={ require('../../img/vip-icon-lession.png') } />
                    <span>付费课程</span>
                </div>

                <div className='icon-group'>
                    <img src={ require('../../img/vip-icon-service.png') } />
                    <span>专属服务</span>
                </div>
            </section>

            {
                isOpenVip === 'Y' ?
                    <span className='vip-btn' onClick={ () => locationTo('/wechat/page/live-vip-details?liveId=' + liveId) }>设置会员</span>
                    :
                    <span className='vip-btn' onClick={ () => locationTo('/wechat/page/live-vip-setting?liveId=' + liveId) }>开启会员</span>
            }

            
        </header>
    );
};

export default VipCardMgr;