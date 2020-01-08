import React from 'react';
import PropTypes from 'prop-types';
import { locationTo, imgUrlFormat } from 'components/util';

const VipCardNoVip = ({ liveId, isOpenVip, shareKey }) => {
    return (
        <header className='vip-card-container'>
            <span className='vip-title'>会员特权</span>
            
            <p className='vip-desc'>立即开通，获得会员专享</p>

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

            <span className='vip-btn' onClick={ () => locationHandler (liveId, isOpenVip, shareKey) }>开通会员</span>
        </header>
    );
};

function locationHandler (liveId, isOpenVip, shareKey) {
    if (isOpenVip === 'Y') {
        locationTo('/wechat/page/live-vip-details?liveId=' + liveId + '&lshareKey=' + shareKey)
    } else {
        window.toast('该直播间未开启VIP服务');
    }
}


VipCardNoVip.propTypes = {
    onClick: PropTypes.func,
};

export default VipCardNoVip;