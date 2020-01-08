import React, { Component } from 'react';

import { locationTo } from 'components/util';
import { fillParams } from 'components/url-utils';

const recommendModal = (props) => {
    const {
        id,           // 记录id
        name,         // 标题
        imageUrl,     // 图片地址
        linkUrl,      // 跳转链接
        platform,     // 平台:app,h5
        type,         // 类型A:全部，B：B端，C：端
        status,       // 状态Y：有效，N:无效，O：过期
        createTime,   // 创建时间
        startTime,    // 开始时间
        endTime,      // 结束时间
    } = props

    const id_match = /\d+/.exec(linkUrl)
    const business_id = id_match ? id_match[0] : ''
    const type_match = /topic|channel/.exec(linkUrl)
    const entity_type = type_match ? type_match[0] : ''

    return <div className='co-recommend-modal'>
        <div className='bg' onClick={props.hide}></div>
        <main>
            <span onClick={props.hide} className="on-log" log-region="popup-close"
                data-log-business_id={business_id}
                data-log-id={id}
                data-log-name={name}
                data-log-business_type={entity_type}
                data-log-status={status}
                data-log-platform={platform}
            ></span>
            <div
                onClick={e => {
                    let url = fillParams({
                        ch: 'popup',
                    }, linkUrl);

                    locationTo(url);
                }}
                className='image-container on-log on-visible'
                data-log-region="popup"
                data-log-business_id={business_id}
                data-log-id={id}
                data-log-name={name}
                data-log-business_type={entity_type}
                data-log-status={status}
                data-log-platform={platform}
            >
                <img src={props.imageUrl} alt="" />
            </div>
        </main>
    </div>
}

export default recommendModal
