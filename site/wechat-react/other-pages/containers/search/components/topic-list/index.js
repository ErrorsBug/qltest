import React from 'react';
import PropTypes from 'prop-types';

import { formatDate, imgUrlFormat } from 'components/util'
import {
    logAndDirect,
    replaceEm,
 } from '../../common'

import elliHandler from '../list-common'

const TopicList = props => {
    return (
        <section className="topic-section list-section on-visible" data-log-region="topic-list">
            <h1 className='topic-header'>
                话题
                {
                    props.showMore &&
                    <span
                        className="more on-log on-visible"
                        data-log-region="more-topic"
                        data-log-type="search-more"
                        data-log-name="topic"
                        onClick={() => { props.iWantMore('topic')}}
                    >更多</span>
                }
            </h1>
            <ul className="topics" id="topics">
                {
                    props.list.map((item, index) => {
                        let hightLight;
                        if(/\<em\>/.test(item.liveName)){
                            hightLight = '所属直播间『' + elliHandler(item.liveName, true) + '』'
                        }
                        if(/\<em\>/.test(item.channelName)){
                            hightLight = '所属系列课《' + elliHandler(item.channelName, true) + '》'
                        }
                        if(/\<em\>/.test(item.speaker)){
                            hightLight = '主讲人：' + elliHandler(item.speaker, true)
                        }
                        return (
                            <li
                                key={`topic-list-${index}`}
                                className="topic on-log"
                                data-log-region="topic-item"
                                data-log-business_id={item.id}
                                data-log-name={replaceEm(item.topic)}
                                data-log-business_type="topic"
                                data-log-pos={index}
                                onClick={() => { logAndDirect('topic', item.id, props.keyword,props.ch, item.lshareKey,props.source) }}
                            >
                                <span>
                                    <img src={imgUrlFormat(item.backgroundUrl, '@240w_150h_1e_1c_20')} alt="" />
                                </span>
                                <section>
                                    <h2 className="multi-elli" dangerouslySetInnerHTML={{ __html: elliHandler(item.topic) }}></h2>
                                    { hightLight && <p><span dangerouslySetInnerHTML={{ __html: hightLight }}></span></p> }
                                    <p>
                                        <span>{item.browseNum}次学习</span>
                                    </p>
                                </section>
                            </li>)
                    })
                }
            </ul>
        </section>
    );
};

TopicList.propTypes = {

};

export default TopicList;
