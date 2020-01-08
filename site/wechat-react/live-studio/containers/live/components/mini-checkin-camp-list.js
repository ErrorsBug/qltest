import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind, throttle } from 'core-decorators';
import { Link } from 'react-router';
import CheckinCampCard from '../../checkin-camp-list/components/checkin-camp-card';
import CategoryList from './category-list';
import SortBtn from './sort-btn';

@autobind
class MiniCheckinCampList extends Component {

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
        } = this.props;
        return (
            <CheckinCampCard
                key={`camp-${index}`}
                index = {index}
                camp={item}
                sysTime={sysTime}
                clientRole={power.allowMGLive ? 'B' : 'C'}
                displayBottomActionSheet={this.props.openCheckinCampBottomMenu}
                isShowAuthNum={this.props.isShowAuthNum}
                isShowAffairCount={this.props.isShowAffairCount}
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

        let totalLen = this.props.checkinCampList.length;

        if (totalLen < length) {
            return this.props.checkinCampList.map(this.renderItem)
        }

        let items = [];
        for(let i=0; i<length; i++) {
            if (offset + i < totalLen) {
                items.push(this.props.checkinCampList[offset + i])
            } else {
                items.push(this.props.checkinCampList[(offset + i) - totalLen])
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
            checkinCampList,
            power,
            sysTime,
            onLinkClick,
            onMore,
            onSort
        } = this.props;

        if(this.props.tags && this.props.tags.length <=0 && checkinCampList && checkinCampList.length <= 0) {
            return null;
        }


        return (
            <div>
                {
                    checkinCampList  &&
                        <div className="new-channel checkin-camp-list">
                            <span className="anchor"></span>
                            <div className="header flex flex-row jc-between flex-vcenter">
                                {
                                    this.props.power.allowMGLive &&
                                    <SortBtn 
                                        region="reorderOldCamp"
                                        onClick={onSort}
                                    />
                                }
                                {
                                    checkinCampList ?
                                    <Link to={`/wechat/page/live-studio/checkin-camp-list/${this.props.liveId}`}>
                                        <div className="text link on-log on-visible" data-log-region="checkin-camp-more-right">{title}</div>
                                    </Link>
                                    :
                                    <div className="text">{title}</div>
                                }
                            </div>
                            <CategoryList 
                                tags={this.props.tags}
                                type={"checkinCamp"}
                                allowMGLive={this.props.power.allowMGLive}
                                selectedTag={this.props.currentTag}
                                onSwitch={this.props.onSwitch}
                                onMore={onMore}
                                moreRegion="classifyOldCampB"
                                categoryRegion="classifyOldCamp"
                            />

                            {
                                checkinCampList && checkinCampList.length <= 0 &&
                                <div className="empty-box">
                                    <p>这个分类下没有课程~</p>
                                </div>
                            }

                            {
                                this.getItems()
                            }

                            {
                                checkinCampList.length > length ?
                                    <dd className="show-more" onClick={ this.showMore }>展开<span className="expand-icon"><img src={require('../img/expand.png')} alt=""/></span></dd>
                                :
                                <Link to={`/wechat/page/live-studio/checkin-camp-list/${this.props.liveId}`}>
                                    <dd className="show-more on-log" data-log-region="checkin-camp-more-bottom">查看全部 <span className="expand-icon-r"><img src={require('../img/expand.png')} alt=""/></span></dd>
                                </Link>
                            }
                        </div>
                }
            </div>
        );
    }
}

MiniCheckinCampList.propTypes = {
    title: PropTypes.string,
    checkinCampList: PropTypes.array,
    power: PropTypes.object,
    sysTime: PropTypes.number,
    openCheckinCampBottomMenu: PropTypes.func,
};

export default MiniCheckinCampList;