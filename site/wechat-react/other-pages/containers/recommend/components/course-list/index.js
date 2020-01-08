import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney, locationTo, digitFormat } from 'components/util';
import { fillParams } from 'components/url-utils';
import HotLives from '../hot-lives'
import { CategoryZoningStyle, Category3 } from '../category-zoning-style'
import NewCourseItem from 'components/common-course-item/new-course';

const CourseList = ({
    items=[],
    tagId,
    hotLiveIndex = 5,
    hotLives,
    showRefreshBtn,
    onRefreshBtnClick,
    categoryList,
    name,
    playing,
    bsId,
    type,
    auditionPause,
    playStatus,
    selctId
}) => {
    // console.log(items);
    if (hotLiveIndex > items.length) {
        hotLiveIndex = items.length;
    }

    let renderItems = [];
    // 刷新按钮展示位置
    let refreshBtnIndex = 10;

    // 打点pos 为了将配置的样式列表项和普通列表项 index 连贯起来
    let posIndex = -1

    // 品类专区可配置不同样式的头部
    const category = categoryList.filter(item => item.id === tagId)[0]

    if (category.style) {
        let count = 0
        // 匹配样式获取截取数量
        switch (category.style) {
            case 'style_1':
                count = 5
                break;
            case 'style_2':
                count = 1
                break;
            case 'style_3':
                return (
                    <Category3 
                        key="category-style-3" 
                        data={ items }
                        onClick={ handleCourseItemClick }
                        playing={ playing }
                        auditionPause={ auditionPause }
                        playStatus={ playStatus }
                        bsId={ bsId }
                        type={ type }
                        selctId={ selctId }
                        tagId= { tagId }
                    />
                )
            default:
                break
        }
        if (count > 0) {
            const data = items.splice(0, count)
            renderItems.push(
                <CategoryZoningStyle 
                    key="category-zoning-style" 
                    data={ data }
                    onClick={ handleCourseItemClick }
                    type={ category.style }
                    tagId= { tagId }
                />
            )
            posIndex += count + 1
        }
    }

    for(let i = 0, len = items.length; i < len; i++) {
        // 在对应位置插入热门直播间列表
        if (hotLiveIndex && hotLives && hotLives.length && i === hotLiveIndex) {
            renderItems.push(<HotLives key="hot-lives" tagId={tagId} hotLives = {hotLives}/>);
        }

        // 在对应位置插入刷新按钮
        if (i === refreshBtnIndex && showRefreshBtn) {
            renderItems.push(<RefreshBtn key="refresh-btn" tagId={tagId} onRefreshBtnClick={onRefreshBtnClick}/>);
        }

        let item = items[i];

        let options;
        if (name) {
            options = {
                name,
                pos: i,
            }
        }

        // 插入课程
        renderItems.push(
            <NewCourseItem
                key={`course-item-${item.id}`}
                data={item}
                className="on-visible on-log"
                onClick={e => handleCourseItemClick(item, options)}
                data-log-region="topic_list"
                data-log-pos= { posIndex + i }
                data-log-tag_id={tagId}
                data-log-business_id={item.businessId}
                data-log-name={item.businessName}
                playing={ playing }
                idx={ i }
                selctId={ selctId }
                auditionPause={ auditionPause }
                playStatus={ playStatus }
                bsId={ bsId }
                type={ type }
                isFlag={ true }
                data-log-business_type={item.type}
            />
        );
    }

    return (
        <div className="course-list">
            {
                renderItems
            }
        </div>
    );
};

CourseList.propTypes = {
    // 课程列表
    items: PropTypes.array.isRequired
};

/**
 * 刷新按钮组件
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */
const RefreshBtn = (props) => {
    return (
        <div className="refresh-btn on-log"
            data-log-region="topic_list"
            data-log-name={'refresh-btn'}
            data-log-tag_id={props.tagId}
            onClick={props.onRefreshBtnClick}>
            <div>你习惯看到这里，点击更新</div>
        </div>
    )
};

/**
 * 列表item点击事件处理
 * @param {*} e
 * @param {*} props
 * @param {*} url
 */
function handleCourseItemClick (props, options = {}) {
    // if(!!props.auditionTopicId){
    //     let url =''
    //     // if (Object.is(props.style, 'video')) {
    //     //     url = `/wechat/page/topic-simple-video?topicId=${props.auditionTopicId}`
    //     // } else {
    //     //     url = `/topic/details-listening?topicId=${props.auditionTopicId}`
    //     // }
    //     url = `/topic/details?topicId=${props.auditionTopicId}`
    //     locationTo(url);
    // } else 
    {
        if (window.__wxjs_environment === 'miniprogram') {
            let url = props.type === 'channel'
                ?
                `/pages/channel-index/channel-index?channelId=${props.businessId}&name=jingxuan`
                :
                `/pages/intro-topic/intro-topic?topicId=${props.businessId}&name=jingxuan`;
    
            wx.miniProgram.navigateTo({ url });
        } else {
            let url = props.url;
    
            if (!url) {
                url = props.type === 'channel'
                    ?
                    `/live/channel/channelPage/${props.businessId}.htm`
                    :
                    `/topic/${props.businessId}.htm?pro_cl=center`;
            }
    
            url = fillParams({
                name: options.name,
                pos: options.pos
            }, url);
            
            locationTo(url);
        }
    }
    
}


export default CourseList;
