import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind, throttle } from 'core-decorators';

import LiveTopicItem from './topic-item';
import CategoryList from './category-list';
import SortBtn from './sort-btn';

@autobind
class MiniTopicList extends Component {

    state = {
        offset: 0,
        pageSize: 5,
        length: 5,
    }
    
    componentDidMount() {
        if (this.props.showNum) {
            this.setState({
                length:this.props.showNum,
            })
        }
    }

    /**
     * 点击换一换，修改offset
     */
    async changeHandler() {
        let {
            offset,
            length,
        } = this.state;

        offset += length;

        if (offset >= this.props.topicList.length) {
            if (this.props.noMore) {
                offset = offset - this.props.topicList.length;
            } else {
                await this.props.loadMoreTopic()
            }
        }

        this.setState({
            offset
        });
    }

    @throttle(1000)
    showMore() {
        this.setState({
            length: this.state.length + this.state.pageSize,
        })
    }

    renderItem(item, index) {
        let {
            power,
            sysTime,
            isShowStudyNum
        } = this.props;

        return (
            // 隐藏状态的话题不显示

            <LiveTopicItem key={ "live-new-topic-item-" + item.id }
                index = {index}
                topicId={ item.id }
                power={ power }
                title={ item.topic }
                logo={ item.backgroundUrl }
                startTime={ item.startTimeStamp }
                timeNow={ sysTime }
                authNum={ item.authNum }
                browseNum={ item.browseNum }
                chargeType={ item.type }
                topicStyle={ item.style }
                money={ item.money }
                status={ item.status }
                isRelay={ item.isRelay }
                hasCommunity={ item.communityStatus }
                displayStatus={ item.displayStatus }
                isShowStudyNum = {isShowStudyNum}
                openBottomMenu={ e => this.props.openTopicBottomMenu(e, item, index) }
                auditStatus={this.props.auditStatus}
            /> 
        )
    }

    /**
     * 生成从offset开始的length个
     */
    getItems() {
        let {
            offset,
            length,
        } = this.state;

        let totalLen = this.props.topicList.length;

        if (totalLen < length) {
            return this.props.topicList.map(this.renderItem)
        }

        let items = [];
        for(let i=0; i<length; i++) {
            if (offset + i < totalLen) {
                items.push(this.props.topicList[offset + i])
            } else {
                items.push(this.props.topicList[(offset + i) - totalLen])
            }
        }

        return items.map(this.renderItem)
    }

    render() {
        let {
            offset,
            length,
        } = this.state;

        let {
            topicList,
            power,
            sysTime,
            title,
            onLinkClick,
            onMore,
            onSort
        } = this.props;

        if(this.props.tags && this.props.tags.length <=0 && topicList && topicList.length <= 0) {
            return null;
        }


        return (
            <div>
                {
                    topicList &&
                        <div className="new-topic">
                            <span className="anchor"></span>
                            <div className="header flex flex-row jc-between flex-vcenter">
                                {
                                    this.props.power.allowMGLive &&
                                    <SortBtn 
                                        region="reorderTopic"
                                        onClick={onSort}
                                    />
                                }
                                <div className="text link on-log on-visible" data-log-region="single-lessons-more-right" onClick={() => {topicList && onLinkClick()}}>{ title }</div>
                            </div>

                            <CategoryList 
                                tags={this.props.tags}
                                type={"topic"}
                                allowMGLive={this.props.power.allowMGLive}
                                selectedTag={this.props.currentTag}
                                onSwitch={this.props.onSwitch}
                                onMore={onMore}
                                moreRegion="classifyTopicB"
                                categoryRegion="classifyTopic"
                            />

                            {
                                topicList && topicList.length <= 0 &&
                                <div className="empty-box">
                                    <p>这个分类下没有课程~</p>
                                </div>
                            }

                            {
                                this.getItems()
                            }

                            {
                                topicList.length > length ?
                                    <dd className="show-more" onClick={this.showMore }>展开 <span className="expand-icon"><img src={require('../img/expand.png')} alt=""/></span></dd>
                                :
                                <dd className="show-more on-log" data-log-region="single-lessons-more-bottom" onClick={onLinkClick}>查看全部 <span className="expand-icon-r"><img src={require('../img/expand.png')} alt=""/></span></dd>
                            }
                        </div>
                }
            </div>
        );
    }
}

MiniTopicList.propTypes = {
    title: PropTypes.string,
    topicList: PropTypes.array,
    power: PropTypes.object,
    sysTime: PropTypes.number,
    noMore: PropTypes.bool,

    onLinkClick: PropTypes.func,
    openTopicBottomMenu: PropTypes.func,
    loadMoreTopic: PropTypes.func,
};

export default MiniTopicList;
