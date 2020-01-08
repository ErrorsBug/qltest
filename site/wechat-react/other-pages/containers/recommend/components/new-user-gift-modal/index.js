import React, { Component } from 'react';

import { locationTo } from 'components/util';
import { fillParams } from 'components/url-utils';

const NewUserGiftModal = (props) => {
    const {
        imageUrl,     // 图片地址
        linkUrl,      // 跳转链接
    } = props

    return <div className='co-recommend-modal'>
        <div className='bg' onClick={props.hide}></div>
        <main>
            <span className="on-log" onClick={props.hide} data-log-region="closeGiftPopup"></span>
            <div
                onClick={e => {
                    let url = fillParams({
                        ch: 'popup',
                    }, linkUrl);

                    locationTo(url);
                }}
                className='image-container on-log on-visible'
                data-log-region="newUserGiftPopup"
            >
                <img src={props.imageUrl} alt="" />
            </div>
        </main>
    </div>
}

export default NewUserGiftModal
