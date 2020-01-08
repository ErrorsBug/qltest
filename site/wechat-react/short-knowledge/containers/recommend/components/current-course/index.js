import React, { Component } from 'react';
import { connect } from 'react-redux';

import TabView from 'components/tab-view/v2';
import ScrollView from 'components/scroll-view';
import Picture from 'ql-react-picture';

import { request } from 'common_actions/common';
import { digitFormat, locationTo } from 'components/util';
import { getUrlParams } from 'components/url-utils';

import "./style.scss";

class CurrentCourse extends Component {
    state = {
        taps: [
            {
                name: '系列课',
                businessType: 'channel',
            },
            {
                name: '话题',
                businessType: 'topic',
            },
            {
                name: '打卡',
                businessType: 'camp',
            },
            {
                name: '训练营',
                businessType: 'newCamp'
            }
        ],
        activeTabIndex: 0,
        checkedIndex: undefined,

        courseCount: 0,
        courseListMap: {
        },
        selectType: '',
        selectId: this.props.selectId||'',
    }

    componentDidMount() {
        

        request.post({
            url: '/api/wechat/transfer/h5/live/getCountCourseNum',
            body: {
                liveId: this.props.liveId,
            }
        }).then(res => {
            let courseCount = 0;
            Object.values(res.data).forEach(item => {
                courseCount += item || 0;
            })
            this.setState({courseCount})
        }).catch(err => {
        })
        
        let { selectId = '', selectType = 'channel' } = this.props
        this.setState({ selectId, selectType})

        let index = 0
        if(selectType == 'topic'){
            index = 1
        }else if(selectType == 'camp'){
            index = 2
        }

        this.onClickTap(index);
        
    }

    render() {
        const courseList = this.getCurCourseList();
        const tab = this.state.taps[this.state.activeTabIndex || 0];

        return (
            <div className="recomemnd-current-course">
                <div className="header">当前共有{this.state.courseCount}个课程，请选择1个课程推荐到视频页</div>

                <div className="taps-bar">
                {
                    this.state.taps.map((item,index)=>{
                        return <span key={`span-${index}`} className={`tap ${ index === this.state.activeTabIndex ? 'active' : '' }`}
                            onClick={()=>this.onClickTap(index)}
                        > {item.name} </span>
                    })
                }
                </div>
                

                <ScrollView
                    status={courseList.status}
                    onScrollBottom={() => this.fetchCourseList(true)}
                >
                {
                    courseList.data && courseList.data.map((item, index) => {
                        return <div key={index}
                            className={`course-item${this.state.selectId == item.businessId ? ' checked' : ''}`}
                            onClick={() => this.onClickCourse(item.businessId)}
                        >
                            <div className="check"></div>
                            <div className="head-img">
                                <div className="c-abs-pic-wrap"><Picture src={item.headImage} placeholder={true} resize={{w: 160, h: 100}}/></div>         
                            </div>
                            <div className="info">
                                <div className="name">{tab.businessType == 'newCamp' ? (item.periodName + ':' + item.channelName) : item.name}</div>
                                <div className="desc">{digitFormat(item.num)}次学习</div>
                            </div>
                        </div>
                    })
                }
                </ScrollView>

                <div className="footer">
                    <button className={`btn-submit`}
                        onClick={this.onClickSubmit}
                    >确认</button>
                </div>
            </div>
        )
    }

    getCurBusinessType() {
        const tab = this.state.taps[this.state.activeTabIndex];
        return tab && tab.businessType;
    }

    getCurCourseList() {
        return this.state.courseListMap[this.getCurBusinessType()] || {
            status: '',
            data: undefined,
            page: {
                size: 10,
            }
        }
    }

    fetchCourseList = (isContinue) => {
        const type = this.getCurBusinessType();
        const courseList = this.getCurCourseList();
        if (/pending|end/.test(courseList.status)) return;

        const page = {...courseList.page};
        page.page = page.page && isContinue ? page.page + 1 : 1;

        this.setState({
            courseListMap: {
                ...this.state.courseListMap,
                [type]: {
                    ...courseList,
                    status: 'pending',
                }
            }
        })

        request.post({
            url: '/api/wechat/transfer/h5/live/getCourseListForKnowledge',
            body: {
                liveId: this.props.liveId,
                businessType: type,
                page,
            }
        }).then(res => {
            const list = res.data.list || [];

            this.setState({
                courseListMap: {
                    ...this.state.courseListMap,
                    [type]: {
                        ...courseList,
                        status: list.length < page.size ? 'end' : 'success',
                        data: isContinue ? (courseList.data || []).concat(list) : list,
                        page,
                    }
                }
            })

        }).catch(err => {
            window.toast(err.message);

            this.setState({
                courseListMap: {
                    ...this.state.courseListMap,
                    [type]: {
                        ...courseList,
                        status: '',
                    }
                }
            })
        })
    }

    onClickSubmit = () => {
        const businessType = this.state.selectType;
        const businessId = this.state.selectId;

        window.loading(true);
        request.post({
            url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/setKnowledgeCourse',
            body: {
                businessType: businessType,
                businessId,
                knowledgeId: this.props.knowledgeId,
            }
        }).then(res => {
            window.toast('设置成功');
            const fallback = getUrlParams().fallback;
            if (fallback) {
                locationTo(fallback);
            } else {
                history.back();
            }
        }).catch(err => {
            window.toast(err.message);
        }).then(() => {
            window.loading(false);
        })
    }

    onClickTap = index => {
        this.setState({
            activeTabIndex: index
        }, () => {
            if (!this.getCurCourseList().data) this.fetchCourseList();
        })
    }

    onClickCourse = id => {
        // 取消选择
        if(id == this.state.selectId){
            this.setState({
                selectId: '',
                selectType: ''
            })
            return
        }
        this.setState({
            selectId: id,
            selectType: this.getCurBusinessType()
        })
    }
}



export default connect(state => {
    return state;
}, {
})(CurrentCourse)
