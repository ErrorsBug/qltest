import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import TrainingCard from './components/training-card';
import TrainingActionSheet from './components/training-bottom-action';
import LiveChannelItem from '../live/components/channel-item';
import ChannelActionSheet from '../live/components/channel-bottom-actionsheet';

import ScrollView from 'components/scroll-view';
import { request } from 'common_actions/common';
import animation from 'components/animation';
import Protal from 'components/protal';
import { getUrlParams } from 'components/url-utils';
import CategoryList from '../live/components/category-list';


class TagCourseList extends React.PureComponent {
    static defaultProps = {
        clientRole: 'C', // 用户身份
        isLiveIndex: false, // 是否直播间首页模块
    }

    state = {
        tagList: [{
            id: 0,
            name: '训练营',
        }],
        curTagIndex: 0,

        courseListMap: {
        },

        showBottomActionSheet: false,
        curOperateCourse: undefined,
    }

    componentDidMount() {
        this.urlParams = getUrlParams()
        this.fetchTagList();
        this.fetchCourseList();
    }

    render() {
        if (this.props.isLiveIndex) {
            // 总分类没有数据，则不渲染
            const allCourseList = this.getCourseList(0);
            if (allCourseList.data && !allCourseList.data.length) return null;

            if (this.props.children) {
                return this.props.children(this.renderEntity())
            }
        }

        return this.renderEntity()
    }

    renderEntity() {
        const { tagList } = this.state;
        const { power } = this.props;
        const courseList = this.getCourseList();

        return <Fragment>
            <div className="ls-tag-course-list">
                {
                    !this.props.isLiveIndex && tagList.length <= 1 ? null :
                    <div className="tag-list" ref={r => this.refTagList = r}>
                        {
                            tagList.map((item, index) => {
                                return (
                                    <div 
                                        key={index}
                                        className={`tag-item on-log${index == this.state.curTagIndex ? ' current' : ''}`}
                                        onClick={() => this.onClickTag(index)}
                                        data-log-region={this.props.tagItemRegion}
                                        data-log-pos={index}
                                    >
                                        {item.name}
                                    </div>
                                )
                            })
                        }
                    </div>
                }
                <ScrollView
                    className="course-list-wrap"
                    status={this.props.isLiveIndex ? undefined : courseList.status}
                    onScrollBottom={() => !this.props.isLiveIndex && this.fetchCourseList(true)}
                >
                    {
                        courseList.data && courseList.data.map((item, index) => {
                            if (this.props.businessType === 'channel')
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
                                <TrainingCard
                                    key={index}
                                    camp={item}
                                    sysTime={this.props.sysTime}
                                    index={index}
                                    isShowAuthNum='Y'
                                    isShowAffairCount='Y'
                                    clientRole={this.props.clientRole}
                                    displayBottomActionSheet={this.onClickCourseOperate} 
                                />
                            )
                        })
                    }
                </ScrollView>

                {
                    this.state.showBottomActionSheet &&
                    <Protal>
                        {
                            this.props.businessType === 'channel'
                                ?
                                <ChannelActionSheet
                                    show={true}
                                    liveId={this.liveId}
                                    hideActionSheet={() => this.setState({showBottomActionSheet: false})}
                                    activeChannel={this.state.curOperateCourse}
                                    onCourseDisplayChange={this.onCourseDisplayChange}
                                    onChannelDelete={this.deleteCourse}
                                    onChangeTag={this.onChangeTag}
                                />
                                :
                                <TrainingActionSheet
                                    show={true}
                                    activeCamp={this.state.curOperateCourse}
                                    hideActionSheet={() => this.setState({showBottomActionSheet: false})}
                                    onCampDelete={this.deleteCourse}
                                    onCampDisplayChange={this.onCourseDisplayChange}
                                    notShowPoint={true}
                                    liveId={this.liveId}
                                    onChangeTag={this.onChangeTag}
                                />
                        }
                    </Protal>
                }
            </div>
        </Fragment>
    }
    
    onClickCourseOperate = async course => {
        if (course.tagId === undefined) {
            window.loading(true);
            await request.post({
                url: '/api/wechat/transfer/h5/businessTag/getTagId',
                body: {
                    businessType: this.props.businessType,
                    businessId: course.id,
                }
            }).then(res => {
                course.tagId = res.data.tagId || 0;
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                window.loading(false);
            })
        }
        this.setState({
            showBottomActionSheet: true,
            curOperateCourse: course,
        })
    }

    updateCourse = (id, obj) => {
        const courseListMap = {...this.state.courseListMap};
        for (let i in courseListMap) {
            let matchIndex;
            if (courseListMap[i] && courseListMap[i].data && courseListMap[i].data.find((item, index) => {
                if (item.id == id) {
                    matchIndex = index;
                    return true;
                }
            })) {
                courseListMap[i] = {...courseListMap[i]};
                courseListMap[i].data = [...courseListMap[i].data];
                courseListMap[i].data[matchIndex] = {
                    ...courseListMap[i].data[matchIndex],
                    ...obj,
                }
            }
        }
        this.setState({
            courseListMap,
        })
    }

    deleteCourse = () => {
        // 删除非激活tagList数据
        if (0 != this.getCurTag().id) {
            delete this.state.courseListMap[0];
        }
        this.refreshPage();
    }

    // 切换tag
    onClickTag = (index) => {
        this.setState({
            curTagIndex: index,
        }, () => {
            if (this.refTagList) {
                const curEl = this.refTagList.children[index];
                if (curEl) {
                    const endValue = curEl.offsetLeft + curEl.clientWidth / 2 - this.refTagList.clientWidth / 2;
                    animation.add({
                        startValue: this.refTagList.scrollLeft,
                        endValue,
                        duration: 200,
                        step: (v) => {
                            this.refTagList && (this.refTagList.scrollLeft = v);
                        }
                    })
                }
            }

            // 全部的数据 缓存
            // 子分类的数据 每次切换都请求
            if (!this.getCourseList().data || index > 0) {
                this.fetchCourseList(false);
            }
        })
    }

    _fetchCourseListSeq = 0;
    fetchCourseList = async (isContinue, isRefresh) => {
        const courseList = this.getCourseList();
        if (/pending|end/.test(courseList.status) && !isRefresh) return;

        const page = {...courseList.page};
        page.page = isContinue && page.page ? page.page + 1 : 1;

        const tag = this.getCurTag();
        this.setCourseList(tag.id, {
            status: 'pending'
        })

        this._fetchCourseListSeq++;
        const _fetchCourseListSeq = this._fetchCourseListSeq;

        return (
            this.props.businessType === 'channel'
            ?
            request.post({
                url: '/api/wechat/transfer/h5/channel/getChannels',
                body: {
                    liveId: this.liveId,
                    isCamp: "N",
                    page,
                    displayStatus: this.props.clientRole == 'B' ? undefined : 'Y',
                    tagId: tag.id,
                }
            })
            :
            request.post({
                url: '/api/wechat/transfer/h5/camp/new/listCamp',
                body: {
                    liveId: this.liveId,
                    page,
                    // status: this.props.clientRole == 'B' ? '' : 'Y',
					status: 'Y',	// 只展示显示的训练营
                    tagId: tag.id,
                }
            })
        )
        .then(res => {
            // 如果tag已经切换了，就不使用请求结果了
            if (_fetchCourseListSeq !== this._fetchCourseListSeq) return;
            
            let list;
            if (this.props.businessType === 'channel') {
                list = res.data.liveChannels || [];
            } else {
                list = res.data.dataList || [];
            }

            if (tag.id > 0) list.forEach(item => item.tagId = tag.id);
            this.setCourseList(tag.id, {
                status: list.length < page.size ? 'end' : 'success',
                data: isContinue ? (courseList.data || []).concat(list) : list,
                page,
            })
        }).catch(err => {
            console.error(err);
            this.setCourseList(tag.id, {
                status: ''
            })
        })
    }

    setCourseList = (id, obj) => {
        this.setState({
            courseListMap: {
                ...this.state.courseListMap,
                [id]: {
                    ...this.state.courseListMap[id],
                    ...obj,
                }
            }
        })
    }

    getCourseList = (tagId) => {
        if (tagId === undefined) tagId = this.getCurTag().id;
        return this.state.courseListMap[tagId] || this.getInitCourseList();
    }

    getCurTag = () => {
        return this.state.tagList[this.state.curTagIndex || 0];
    }

    getInitCourseList = () => {
        return {
            status: '',
            data: undefined,
            page: {
                size: this.props.pageSize || 10,
            }
        }
    }

    // 改变标签的话，改变前后的列表都要刷新
    onChangeTag = tagId => {
        const curTagId = this.getCurTag().id;
        const oldTagId = this.state.curOperateCourse.tagId;

        // 删除非激活tagList数据
        if (oldTagId != curTagId) {
            delete this.state.courseListMap[oldTagId];
        }
        if (tagId != curTagId) {
            delete this.state.courseListMap[tagId];
        }

        this.refreshPage();
    }

    // 重新获取分类列表及当前分类数据
    refreshPage = () => {
        window.loading(true);
        this.fetchTagList().then(() => {
            this.fetchCourseList(false, true).then(() => {
                window.loading(false);
            });
        });
    }

    get liveId(){
        return this.props.liveId;
    }

    onCourseDisplayChange = (status) => {
        if (status === 'Y') {
            if (this.props.businessType === 'channel') {
                this.updateCourse(this.state.curOperateCourse.id, {
                    displayStatus: status,
                });
            } else {
                this.updateCourse(this.state.curOperateCourse.id, {
                    status
                });
            }
        } else {
            // 隐藏竟然还会取消掉当前分类
            if (0 != this.getCurTag().id) {
                delete this.state.courseListMap[0];
            }
            this.refreshPage();
        }
    }

    fetchTagList = () => {
        return request.post({
            url: '/api/wechat/transfer/h5/businessTag/tagList',
            body: {
                liveId: this.liveId,
                businessType: this.props.businessType,
                // type: 'all',
            }
        }).then(res => {
            const list = res.data.tagList || [];
            const tagList = [getTotalTag(this.props.businessType)].concat(list)
            let curTagIndex = this.state.curTagIndex;

            // curTagIndex不存在时的处理
            if (!tagList[curTagIndex]) {
                curTagIndex--;
            }
            this.setState({
                tagList,
                curTagIndex,
            })
        }).catch(err => {
            window.toast('获取分类失败');
            console.error(err);
        })
    }
}

const mapStateToProps = (state) => {
    return {
        sysTime: state.common.sysTime,
    }
}

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(TagCourseList);





function getTotalTag(businessType) {
    if (businessType === 'channel') {
        return {
            id: 0,
            name: '系列课',
        }
    } else {
        return {
            id: 0,
            name: '训练营',
        }
    }
}