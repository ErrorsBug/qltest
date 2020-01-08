import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'

import {
    imgUrlFormat,
    digitFormat,
    formatMoney,
    locationTo
} from 'components/util'

const Channels = props => {
    return (<ul className='channels'>
        {
            props.list.map((item, index) => {
                return <Item
                    key={`channel-list-${index}`}
                    index={index}
                    className='channel-item'
                    data={item}
                    config={props.config}
                />
            })
        }
    </ul>
    );
};

const Item = props => {
    const {
        id,	// String	系列课id
        name,	// String	系列课名称
        createTime,	// timestamp	创建时间
        chargeType,	// String	收费类型：absolutely = 固定收费，flexible = 灵活按月
        headImage,	// String	频道头像
        planCount,	// int	话题数量
        weight,	// int	权重
        displayStatus,	// String	系列课是否显示，Y为显示，N为不显示
        learningNum,	// int	多少人正在学
        amount,	// decimal	价格
        discount, // 折扣价
        discountStatus, // 折扣类型
    } = props.data

    const {
        isShowTime,	// String	是否展示学习次数 Y:是 N:否
        isShowPrice,	// String	是否展示价格 Y:是, N: 否
        isShowTopicNum,	// String	是否显示课程数量 Y:是, N: 否
        refId,	// Array	勾选的系列课id组成的数组 [‘123456’, ’234553’]
    } = props.config

    return <li
        className='channel-item'
        data-log-region="channel_list"
        data-log-pos={props.index}
        data-log-name={name}
        data-log-business_id={id}
    >
        <div
            className="cover"
            onClick={()=>{locationTo(`/live/channel/channelPage/${id}.htm`)}}
        
        >
            <img src={`${imgUrlFormat(headImage, '?x-oss-process=image/resize,m_fill,limit_0,h_500,w_800')}`} alt=""/>
            <div className="shadow"></div>
            <div className="title">{name}</div>
        </div>
        <section className='info-section'>
            <div className="course-info">
                {
                    isShowTopicNum === 'Y' &&
                    <span className='course-num'>共{planCount}节课</span>
                }
                {
                    isShowTopicNum === 'Y' &&
                    isShowTime === 'Y' &&
                    <span className="seperator">|</span>
                }
                {
                    isShowTime === 'Y' &&
                    <span>{digitFormat(learningNum)}人在学</span>
                }
            </div>
            
            {
                isShowPrice == 'Y' && 
                <div className="charge-info">
                    {
                        (discountStatus == "P" || discountStatus === 'GP' || discountStatus === 'Y') ? 
                        <del>¥{amount}</del>
                        :null    
                    }

                    {
                        discountStatus === 'Y' &&
                        <span className="icon-discount-sale"></span>
                    }
                    {
                        discountStatus === 'P' &&
                        <span className="icon-discount-party"></span>
                    }

                    {
                        (discountStatus == "P" || discountStatus === 'GP') ? 
                            <span className='discount-party'>¥{discount}</span>
                            : discountStatus === 'Y' ?
                            <span className='discount-sale'>¥{discount}</span>
                            :
                            amount == 0?    
                            <span className='discount-party'>免费</span>
                            :        
                            <span className='price'>¥{amount}</span>
                    }

                </div>
                ||null
            }
        </section>
    </li>
}

Channels.propTypes = {
    list: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired,
};

export default Channels;