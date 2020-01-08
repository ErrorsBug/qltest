import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind, throttle } from 'core-decorators';

import LiveTopicItem from './topic-item';
import CategoryList from './category-list';

import TrainingCard from '../../checkin-camp-list/components/training-card';
import SortBtn from './sort-btn';

@autobind
class MiniTrainingList extends Component {

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

        if (offset >= this.props.trainingList.length) {
            if (this.props.noMore) {
                offset = offset - this.props.trainingList.length;
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
            isShowStudyNum,
            openTrainingBottomMenu
        } = this.props;
        if (item.businessType === 'channel')
        return <LiveChannelItem
            key={index}
            index = {index}
            channelId={item.id}
            isCamp={ item.isCamp }
            power={power}
            title={item.name}
            // sysTime={ sysTime }
            logo={item.headImage}
            // signupEndTime={ item.signupEndTime || 0}
            hasPeriod={ item.hasPeriod }
            courseNum={item.topicCount}
            courseTotal={item.planCount}
            learnNum={item.learningNum}
            joinCamp={ item.joinCamp }
            hasCommunity={ item.communityStatus }
            chargeConfigs={item.chargeConfigs}
            hide={item.displayStatus == "N"}
            isShowStudyNum = {item.isShowStudyNum}    
            isShowTopicNum = {item.isShowTopicNum}   
            openBottomMenu={e => {e.stopPropagation(); this.onClickCourseOperate(item)}}
            isRelay={item.isRelay}
            auditStatus={this.urlParams.auditStatus}
        />

        return (
            // 隐藏状态的话题不显示
            <TrainingCard
                key={index}
                camp={item}
                sysTime={this.props.sysTime}
                index={index}
                isShowAuthNum='Y'
                isShowAffairCount='Y'
                clientRole={this.props.clientRole}
                displayBottomActionSheet={openTrainingBottomMenu} 
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

        let totalLen = this.props.trainingList.length;

        if (totalLen < length) {
            return this.props.trainingList.map(this.renderItem)
        }

        let items = [];
        for(let i=0; i<length; i++) {
            if (offset + i < totalLen) {
                items.push(this.props.trainingList[offset + i])
            } else {
                items.push(this.props.trainingList[(offset + i) - totalLen])
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
            trainingList,
            power,
            sysTime,
            title,
            onLinkClick,
            onMore,
            onSort
        } = this.props;

        if(this.props.tags && this.props.tags.length <=0 && trainingList && trainingList.length <= 0) {
            return null;
        }

        return (
            <div>
                {
                    trainingList &&
                        <div className="new-channel training-list">
                            <span className="anchor"></span>    
                            <div className="header flex flex-row jc-between flex-vcenter">
                                {
                                    this.props.power.allowMGLive &&
                                    <SortBtn 
                                        region="reorderCamp"
                                        onClick={onSort}
                                    />
                                }
                                <div className="text link on-log on-visible" data-log-region="camp-lessons-more-right" onClick={() => {trainingList && onLinkClick()}}>{ title }</div>
                            </div>

                            <CategoryList 
                                tags={this.props.tags}
                                type={"training"}
                                allowMGLive={this.props.power.allowMGLive}
                                selectedTag={this.props.currentTag}
                                onSwitch={this.props.onSwitch}
                                onMore={onMore}
                                moreRegion="classifyCampB"
                                categoryRegion="classifyCamp"
                            />

                            {
                                trainingList && trainingList.length <= 0 &&
                                <div className="empty-box">
                                    <p>这个分类下没有课程~</p>
                                </div>
                            }

                            {
                                this.getItems()
                            }

                            {
                                trainingList.length > length ?
                                    <dd className="show-more" onClick={this.showMore }>展开 <span className="expand-icon"><img src={require('../img/expand.png')} alt=""/></span></dd>
                                :
                                <dd className="show-more on-log" data-log-region="camp-lessons-more-bottom" onClick={onLinkClick}>查看全部 <span className="expand-icon-r"><img src={require('../img/expand.png')} alt=""/></span></dd>
                            }
                        </div>
                }
            </div>
        );
    }
}


export default MiniTrainingList;
