import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney, locationTo, digitFormat } from 'components/util';
import appSdk from 'components/app-sdk'
import { isQlchat } from 'components/envi'
import { fillParams } from 'components/url-utils';
import CommonCourseItem from 'components/common-course-item';
// import ScrollToLoad from 'components/scrollToLoad';

const CourseList = ({ items=[], tagId }) => {
    // console.log(items);
    return (
        <div className='course-list'>
            {
                items.map((item, index) => (
                    <CommonCourseItem
                        key={`course-item-${index}`}
                        data={item}
                        className="on-visible on-log"
                        onClick={e => handleCourseItemClick(item)}
                        data-log-region="topic_list"
                        data-log-pos={index}
                        data-log-business_id={item.businessId}
                        data-log-name={item.businessName}
                        data-log-business_type={item.type}
                    />
                ))
            }
        </div>
    );
};

CourseList.propTypes = {
    // 课程列表
    items: PropTypes.array.isRequired
};

/**
 * 列表item点击事件处理
 * @param {*} e 
 * @param {*} props 
 * @param {*} url 
 */
function handleCourseItemClick (props) {
    if (window.__wxjs_environment === 'miniprogram') {
        let url = props.type === 'channel' 
            ?
            `/pages/channel-index/channel-index?channelId=${props.businessId}`
            :
            `/pages/intro-topic/intro-topic?topicId=${props.businessId}`;
        
        wx.miniProgram.navigateTo({ url });
    } else {
        if (isQlchat()) {
            let url = props.type === 'channel'
                ? `dl/live/channel/homepage?channelId=${props.businessId}`
                : `dl/live/topic?topicId=${props.businessId}`
            props.url
                ? appSdk.linkTo(url, props.url)
                : appSdk.linkTo(url)
        } else {
            if (!props.url) {
                let url = props.type === 'channel' ?
                    `/live/channel/channelPage/${props.businessId}.htm` : `/topic/${props.businessId}.htm?pro_cl=center`;
                locationTo(url);
            } else {
                locationTo(props.url);
            }
        }
    }
}



export default CourseList;
