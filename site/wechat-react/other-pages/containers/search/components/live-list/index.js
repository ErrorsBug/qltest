import React from 'react';
import PropTypes from 'prop-types';

import {
    logAndDirect,
    replaceEm,
 } from '../../common'
import { imgUrlFormat } from 'components/util'

const LiveList = props => {
    return (
        <section className="live-section list-section on-visible" data-log-region="live-list">
            <h1 className='live-header'>
                直播间
                {
                    props.showMore &&
                    <span
                        className="more on-log on-visible"
                        data-log-region="more-live"
                        data-log-type="search-more"
                        data-log-name="live"
                        onClick={() => { props.iWantMore('live') }}
                    >更多</span>
                }
            </h1>
            <ul className="lives">
                {
                    props.list.map((item, index) => {
                        return (
                            <li
                                className="live on-log"
                                key={`channel-list-${index}`}
                                data-log-region="live-item"
                                data-log-business_id={item.id}
                                data-log-name={replaceEm(item.name)}
                                data-log-business_type="live"
                                data-log-pos={index}
                                onClick={() => { logAndDirect('live', item.id, props.keyword,props.ch, item.lshareKey) }}
                            >
                                <span>
                                    <img src={imgUrlFormat(item.logo, '@110w_110h_1e_1c_20')} alt="" />
                                </span>
                                <section>
                                    <h2 className="elli" dangerouslySetInnerHTML={{ __html: item.name }}></h2>
                                    {
                                        item.isAuthor
                                            ? <p><span className='tag-authority'></span></p>
                                            : <p>
                                                {item.followNum}人关注
                                              </p>
                                    }
                                </section>
                            </li>
                        )
                    })
                }
            </ul>
        </section>
    );
};

LiveList.propTypes = {

};

export default LiveList;
