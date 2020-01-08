import React from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import DiscoveryTopTabBar from './discovery-top-tab-bar';
import ScrollView from 'components/scroll-view';
import TabBar from 'components/tabbar';
import NewUserGift, { getNewUserGiftData } from 'components/new-user-gift';
import Picture from 'ql-react-picture';

import { locationTo, timeBefore, getCookie } from 'components/util';
import { collectVisible } from 'components/collect-visible';
import {
    fetchIsMineNew,
} from '../../actions/recommend';
import {
    cleanCommentRedDot,
    getUserCommentList,
} from 'common_actions/messages';

import { request, isFunctionWhite } from 'common_actions/common';




class Messages extends React.Component {
    state = {
        activeTabIndex: 0,

        courseEvalUnreadDate: false,

        isShowNewUserGift: false,
        isWhite: false,
        isLoading: true
    }

    componentDidMount() {
        this.hadnleWhiteList()
        Promise.all([
            this.getCommentList(),
        ]).then(([res0, res1]) => {

            // 标记单页应用内是否首次获取数据，若列表为空，跳到动态页
            if (!window.hasFirstGetMessages
                && (res0.data && !res0.data.length)
            ) {
                this.setState({activeTabIndex: 0});
                window.hasFirstGetMessages = true;
            }
        })

        getNewUserGiftData().then(res => this.setState(res));
        
        typeof _qla === 'undefined' || _qla.bindVisibleScroll('co-scroll-view');
    }
    // 处理白名单
    hadnleWhiteList = async () => {
        const { isWhite } = await isFunctionWhite(getCookie("userId"), "ufw");
        this.setState({
            isWhite: isWhite && Object.is(isWhite, 'Y'),
            isLoading: false
        })
    }

    render() {
        const { commentList } = this.props;

        let scrollStatus = commentList.status;
        // 评论为end，评价不为end时，不显示列表状态
        if (scrollStatus === 'end') {
            scrollStatus = undefined;
        }

        return <Page title="发现" className='p-messages'>
            <DiscoveryTopTabBar activeIndex={this.state.activeTabIndex}/>
            
            <ScrollView
                className={ !this.state.isWhite ? 'p-messages-btn' : '' }
                onScrollBottom={() => this.getCommentList(true)}
                status={scrollStatus}
                isEmpty={commentList.data && !commentList.data.length}
                emptyComp="没有任何消息哦"
            >

                {
                    commentList.data && commentList.data.length > 0 &&
                    <div>
                        {commentList.data.map((item, index) => {
                            return <div key={index}
                                className="message-item on-log on-visible"
                                data-log-region="message-item"
                                data-log-pos={index}
                                onClick={() => this.onClickMessageItem(item)}
                            >
                                <div className="img">
                                    <div className="c-abs-pic-wrap">
                                        <Picture src={item.topicLogo} placeholder={true} resize={{w:'160',h:'101'}} />
                                    </div>
                                </div>
                                <div className="info">
                                    <div className="main">
                                        <div className="title">{item.content}</div>
                                        <div className="time">{timeBefore(item.replyTime)}</div>
                                    </div>
                                    <div className="desc">
                                        <div className="content">
                                            {
                                                /creater/.test(item.replyCommentPo.createRole) &&
                                                <span className="teacher">(老师) </span>
                                            }
                                            {item.replyCommentPo.createByName} 回复：{item.replyCommentPo.content}
                                        </div>
                                        {
                                            item.isNew === 'Y' &&
                                            <div className="mark"></div>
                                        }
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                }
            </ScrollView>

            {
                this.state.isShowNewUserGift &&
                <NewUserGift
                    courseList={this.state.newUserGiftCourseList}
                    onClose={() => this.setState({isShowNewUserGift: false})}
                    expiresDay={this.state.newUserGiftExpiresDay}
                />
            }
            { !this.state.isLoading && !this.state.isWhite && (
                <TabBar
                    activeTab={"timeline"}
                    isMineNew={false}
                    isMineNewSession={"N"}
                />
            ) }
            
        </Page>
    }


    getCommentList = async isContinue => {
        return this.props.getUserCommentList(isContinue)
            .then(res => {
                res && collectVisible();
                return res;
            });
    }

    onClickMessageItem = comment => {
        if (comment.isNew === 'Y') {
            this.props.cleanCommentRedDot('cCommentList', [comment.id]);
        }
        locationTo(`/wechat/page/comment/cend-comment-details?id=${comment.id}&topicId=${comment.topicId}`);
    }

}


function mapStateToProps (state) {
    return {
        isMineNew: state.recommend.isMineNew,
        commentList: state.messages.commentList,
    }
}

const mapActionToProps = {
    fetchIsMineNew,
    cleanCommentRedDot,
    getUserCommentList,
}


module.exports = connect(mapStateToProps, mapActionToProps)(Messages);
