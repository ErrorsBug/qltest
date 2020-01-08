import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind, throttle } from 'core-decorators';
import LiveChannelItem from './channel-item';
import CategoryList from './category-list';
import SortBtn from './sort-btn';

@autobind
class MiniChannelList extends Component {

    state = {
        offset: 0,
        pageSize: 5,
        length: 5,
    }

    componentDidMount() {
        if (this.props.showNum) {
            this.setState({
                length: this.props.showNum,
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

        if (offset >= this.props.channelList.length) {
            if (this.props.noMore) {
                offset = offset - this.props.channelList.length;
            } else {
                await this.props.loadMoreChannel()
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
            isShowTopicNum
        } = this.props;
        return (
            <LiveChannelItem key={"live-new-channel-item-" + item.id}
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
                isShowStudyNum = {isShowStudyNum}    
                isShowTopicNum = {isShowTopicNum}   
                openBottomMenu={e => this.props.openChannelBottomMenu(e, item, index)}
                isRelay={item.isRelay}
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

        let totalLen = this.props.channelList.length;

        if (totalLen < length) {
            return this.props.channelList.map(this.renderItem)
        }

        let items = [];
        for(let i=0; i<length; i++) {
            if (offset + i < totalLen) {
                items.push(this.props.channelList[offset + i])
            } else {
                items.push(this.props.channelList[(offset + i) - totalLen])
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
            title,
            channelList,
            power,
            sysTime,
            onLinkClick,
            onMore,
            onSort
        } = this.props;

        if(this.props.tags && this.props.tags.length <=0 && channelList && channelList.length <= 0) {
            return null;
        }

        return (
            <div>
                {
                    channelList &&
                        <div className="new-channel channel-list">
                            <span className="anchor"></span>
                            <div className="header flex flex-row jc-between flex-vcenter">
                                {
                                    this.props.power.allowMGLive &&
                                    <SortBtn 
                                        region="reorderChannel"
                                        onClick={onSort}
                                    />
                                }
                                <div className="text link on-log on-visible" data-log-region="series-lessons-more-right" onClick={() => {channelList && onLinkClick()}}>{title}</div>
                            </div>
                            <CategoryList 
                                tags={this.props.tags}
                                type={"channel"}
                                allowMGLive={this.props.power.allowMGLive}
                                selectedTag={this.props.currentTag}
                                onSwitch={this.props.onSwitch}
                                onMore={onMore}
                                moreRegion="classifyChannelB"
                                categoryRegion="classifyChannel"
                            />
                            
                            {
                                channelList && channelList.length <= 0 &&
                                <div className="empty-box">
                                    <p>这个分类下没有课程~</p>
                                </div>
                            }

                            {
                                this.getItems()
                            }

                            {
                                channelList.length > length ?
                                    <dd className="show-more" onClick={ this.showMore }>展开<span className="expand-icon"><img src={require('../img/expand.png')} alt=""/></span></dd>
                                    :
                                    <dd className="show-more on-log" data-log-region="series-lessons-more-bottom" onClick={onLinkClick}>查看全部 <span className="expand-icon-r"><img src={require('../img/expand.png')} alt=""/></span></dd>
                            }
                        </div>
                }
            </div>
        );
    }
}

MiniChannelList.propTypes = {
    title: PropTypes.string,
    channelList: PropTypes.array,
    power: PropTypes.object,
    sysTime: PropTypes.number,
    noMore: PropTypes.bool,

    onLinkClick: PropTypes.func,
    openChannelBottomMenu: PropTypes.func,
    loadMoreChannel: PropTypes.func,
};

export default MiniChannelList;
