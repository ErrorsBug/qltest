import React from 'react';
import PropTypes from 'prop-types';

import {
    logAndDirect,
    replaceEm,
 } from '../../common'
import { imgUrlFormat } from 'components/util'
import elliHandler from '../list-common'

const ChannelList = props => {
    return (
        <section className="channel-section list-section on-visible" data-log-region="channel-list">
            <h1 className='channel-header'>
                系列课
                {
                    props.showMore &&
                    <span
                        className="more on-log on-visible"
                        data-log-region="more-channel"
                        data-log-type="search-more"
                        data-log-name="channel"
                        onClick={() => { props.iWantMore('channel')}}
                    >更多</span>
                }
            </h1>
            <ul className="channels">
                {
                    props.list.map((item, index) => {
                        return (
                            <li
                                className="channel on-log"
                                key={`channel-list-${index}`}
                                data-log-region="channel-item"
                                data-log-business_id={item.id}
                                data-log-name={replaceEm(item.name)}
                                data-log-business_type="channel"
                                data-log-pos={index}
                                onClick={() => { logAndDirect('channel', item.id, props.keyword, props.ch, item.lshareKey,props.source) }}
                            >
                                <span>
                                    <img src={imgUrlFormat(item.headImage, '@240w_150h_1e_1c_20')} alt="" />
                                </span>
                                <section>
                                    <h2 className="multi-elli" dangerouslySetInnerHTML={{ __html: elliHandler(item.name) }}></h2>
                                    <p>
                                        {item.subscribeNum}次学习
                                    </p>
                                </section>
                            </li>
                        )
                    })
                }
            </ul>
        </section>
    );
};

ChannelList.propTypes = {

};

export default ChannelList
