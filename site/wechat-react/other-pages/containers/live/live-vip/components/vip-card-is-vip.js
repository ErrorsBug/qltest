import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { locationTo, imgUrlFormat } from 'components/util';

const VipCardIsVip = ({ headImgUrl, name, expiryTime, liveId, isOpenVip, shareKey}) => {
    return (
        <header className='vip-card-container'>
            <section className='vip-info'>
                <img src={ imgUrlFormat(headImgUrl, '@60w_60h_1e_1c_2o') } />

                <div className='vip-base-info'>
                    <span>
                        { name }
                        <img className='vip-badge' src={ require('../../img/vip-badge.png') } />
                    </span>
                    <small>有效期至{ dayjs(Number(expiryTime)).format('YYYY.MM.DD') }</small>
                </div>
            </section>

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

            <span className='vip-btn' onClick={ () => locationHandler(liveId, isOpenVip, shareKey) }>查看会员</span>
        </header>
    );
};

function locationHandler (liveId, isOpenVip, shareKey) {
    if (isOpenVip === 'Y') {
        // locationTo('/live/whisper/vip.htm?liveId=' + liveId + '&lshareKey=' + shareKey)
        locationTo('/wechat/page/live-vip-details?liveId=' + liveId + '&lshareKey=' + shareKey)
    } else {
        window.toast('该直播间未开启VIP服务');
    }
}

export default VipCardIsVip;