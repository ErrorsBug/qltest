import React from 'react';
import PropTypes from 'prop-types';

import { formatDate, imgUrlFormat } from 'components/util'
import {
    logAndDirect,
    replaceEm,
 } from '../../common'

import elliHandler from '../list-common'

const CampList = props => {
    return (
        <section className="camp-section list-section on-visible" data-log-region="camp-list">
            <h1 className='camp-header'>
                打卡训练营
                {
                    props.showMore &&
                    <span
                        className="more on-log on-visible"
                        data-log-region="more-camp"
                        data-log-type="search-more"
                        data-log-name="camp"
                        onClick={() => { props.iWantMore('camp')}}
                    >更多</span>
                }
            </h1>
            <ul className="camps" id="camps">
                {
                    props.list.map((item, index) => {
                        // let hightLight = '所属系列课《' + elliHandler(item.name, true) + '》';
                        return (
                            <li
                                key={`camp-list-${index}`}
                                className="camp on-log"
                                data-log-region="camp-item"
                                data-log-business_id={item.id}
                                data-log-name={replaceEm(item.name)}
                                data-log-business_type="camp"
                                data-log-pos={index}
                                onClick={() => { logAndDirect('camp', item.id, props.keyword,props.ch, item.lshareKey) }}
                            >
                                <span>
                                    <img src={imgUrlFormat(item.headImage, '@240w_150h_1e_1c_20')} alt="" />
                                </span>
                                <section>
                                    <h2 className="multi-elli" dangerouslySetInnerHTML={{ __html: elliHandler(item.name) }}></h2>
                                    {/* { hightLight && <p><span dangerouslySetInnerHTML={{ __html: hightLight }}></span></p> } */}
                                    <p>
                                        <span>{item.authNum}次学习</span>
                                    </p>
                                </section>
                            </li>)
                    })
                }
            </ul>
        </section>
    );
};

CampList.propTypes = {

};

export default CampList;
