import React from 'react';
import PropTypes from 'prop-types';

import { formatDate, formatMoney} from 'components/util'

function Checklist(props) {
    const { profitMap, records } = props
    const path = '..\/img\/'
    return (
        <ul className='checklist'>
            {
                props.records.map((item, index) => {
                    const { createTime, isBeRelay, isRelay, money, name, profitType, totalAmount } = item
                    const { icon, prefix } = profitMap[profitType] || {};
                    return <li key={index.toString(10)}>
                        <img src={icon} alt="" />
                        <section>
                            <main>
                                <h1>
                                    <b>{prefix || '未知类型'}</b> - {name}
                                    {
                                        // isBeRelay === 'Y' &&
                                        // <span className="tag-relay">
                                        //     转播
                                        // </span>
                                    }
                                </h1>
                                <var>{money>=0?"+":null}{formatMoney(money)}</var>
                            </main>
                            <footer>
                                <time>{formatDate(createTime, 'yyyy-MM-dd hh:mm:ss')}</time>
                                {/* 因为平台分销，对不上帐，需要隐藏 */}
                                {/* <span>总收益：{formatMoney(totalAmount)}</span> */}
                            </footer>
                        </section>
                    </li>
                })
            }
        </ul>
    );
};

Checklist.propTypes = {
    records: PropTypes.array.isRequired,
};

export default Checklist;