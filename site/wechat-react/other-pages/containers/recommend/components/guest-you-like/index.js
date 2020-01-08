import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Picture from 'ql-react-picture';
import { collectVisible } from 'components/collect-visible';
import CourseItem from 'components/common-course-item';

import { locationTo, digitFormat, formatMoney } from 'components/util';
import { fillParams } from 'components/url-utils';
import { request } from 'common_actions/common';


const markHash = '#guestyoulike';


@withRouter
class GuestYouLike extends React.PureComponent {
    state = {
        courseList: {
            status: '',
            data: undefined,
            page: {
                size: 30,
            },
        },
        displaySize: 3,
        displayOffset: 0, // 当前显示的displaySize个课程所在的课程数组的偏移
    }

    async componentDidMount() {
        // 设置完标签回来，清空缓存重新请求
        if (typeof localStorage !== 'undefined') {
            try {
                if (localStorage.getItem('CLEAN_RECOMMEND_GYL') > 0) {
                    localStorage.removeItem('CLEAN_RECOMMEND_GYL');
                    this.refreshCache = true;
                }
            } catch (e) {}
        }

        await this.getCourse();

        const listData = this.state.courseList.data;
        if (listData && listData.length) {
            // 随机索引
            this.setState({
                displayOffset: Math.floor(Math.random() * listData.length)
            }, () => {
                // 如果选择完标签返回，定位到本模块
                if (typeof location !== 'undefined' && location.hash === markHash) {
                    this.props.router.replace(location.pathname + location.search);

                    const dom = document.querySelector('.rec-guest-you-like');
                    dom && dom.scrollIntoView();
                }

                collectVisible();
            })
        }
    }

    requestBuffer = [];

    requestCourse = page => {
        return request({
            url: '/api/wechat/transfer/h5/live/center/popularCourse',
            method: 'POST',
            localCache: 24*60*60,
            refreshCache: this.refreshCache,
            body: {
                page
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            let list = res.data.courseList || [];
            let status = list.length < page.size ? 'end' : 'success';

            list = list.filter(item => item.displayStatus === 'Y');
            this.requestBuffer = this.requestBuffer.concat(list);

            // 如果本次请求结果过滤后长度不足displaySize，再请求
            // 20181026 改为只请求一次数据，30条，并缓存一天
            if (status !== 'end' && (this.requestBuffer.length < this.state.displaySize || this.requestBuffer.length < page.size)) {
                page.page++;
                return this.requestCourse(page);
            }
            // !
            status = 'end';

            const totalList = page.page === 1 ? this.requestBuffer : (this.state.courseList.data || []).concat(this.requestBuffer);

            this.requestBuffer = [];

            totalList.forEach((item, index) => item._index = index);

            this.setState({
                courseList: {
                    ...this.state.courseList,
                    status,
                    data: totalList,
                    page,
                }
            })
        }).catch(err => {
            console.error(err);

            this.requestBuffer = [];
            this.setState({
                courseList: {
                    ...this.state.courseList,
                    status: '',
                }
            })
        })
    }

    getCourse = async isContinue => {
        if (/pending|end/.test(this.state.courseList.status)) return;

        const page = {...this.state.courseList.page};
        page.page = isContinue ? page.page + 1 : 1;

        this.setState({
            courseList: {
                ...this.state.courseList,
                status: 'pending',
            }
        })

        await this.requestCourse(page);
    }

    render() {
        const listData = this.state.courseList.data;

        if (!listData || !listData.length) return false;

        // 循环截取总数据量的displaySize
        const displayData = listData && (listData.length > this.state.displaySize ? listData.concat(listData).splice(this.state.displayOffset, this.state.displaySize) : listData);

        return <div className="rec-guest-you-like">
            <div className="block-header">
                <span className="title">猜你喜欢
                    <span className="learning-preference on-log on-visible"
                        data-log-region="gyl-set-user-tag"
                        data-log-status='A'
                        onClick={this.onClickSetTags}
                    >
                        <span className="icon"></span>
                        点我设置学习偏好
                    </span>
                </span>
                <div className="more-btn on-log"
                    data-log-region="gyl-view-more"
                    onClick={this.onClickViewMore}
                ><span>更多<i className="check-more-icon"></i></span></div>
            </div>

            {/* <div className="course-list-wrap">
                <div className="course-list"> */}
                    {
                        displayData && displayData.map((data, index) => {
                            return <CourseItem 
                                className="on-log on-visible"
                                key={index}
                                data={data}
                                data-log-region="gyl-course-item"
                                data-log-pos={data._index}
                                data-log-status='A'
                                isFlag={ true }
                                onClick={() => this.onClickCourseItem(data)}
                            />
                            return <div key={`${this.state.displayOffset}${data._index}`} className="course-item on-log on-visible"
                                data-log-region="gyl-course-item"
                                data-log-pos={data._index}
                                data-log-status='A'
                                onClick={() => this.onClickCourseItem(data)}
                            >
                                <div className="avatar">
                                    <Picture src={data.headImage}
                                             placeholder={true}
                                             resize={{
                                                 w: 160,
                                                 h: 100
                                             }}
                                    />
                                </div>
                                <div className="info">
                                    <div className="title">{data.businessName}</div>
                                    <div className="desc">
                                        <span>
                                            {
                                                data.learningNum ? `${digitFormat(data.learningNum)}次学习 | ` : '0次学习 | '
                                            }
                                            {
                                                data.businessType === 'channel' ? `${data.planCount || data.topicNum || 0}课` : `单课`
                                            }
                                        </span>
                                        {
                                            true ||
                                            <span className="price">
                                                {
                                                    data.money > 0
                                                    ?
                                                    (
                                                        data.discount == -1
                                                        ?
                                                        <span className="current">￥{formatMoney(data.money)}</span>
                                                        :
                                                        <span>
                                                            <span className="origin">¥{formatMoney(data.money)}</span>
                                                            <span className="current">¥{formatMoney(data.discount)}</span>
                                                        </span>
                                                    )
                                                    :
                                                    <span className="free">免费</span>
                                                }
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        })
                    }
                {/* </div>
            </div> */}

            {
                !!(listData && listData.length > 3) &&
                <div className="refresh on-log on-visible"
                    data-log-region="gyl-refresh"
                    onClick={this.onClickRefresh}
                >
                    换一换<i className={`icon_refresh${this.state.courseList.status === 'pending' ? ' loading' : ''}`}></i>
                </div>
            }
        </div>
    }

    onClickSetTags = () => {
        this.props.router.replace(location.pathname + location.search + markHash);
        locationTo('/wechat/page/recommend/user-like');
    }

    onClickCourseItem = data => {
        let url = '';
        if(!!data.auditionTopicId){
            url = `/topic/details?topicId=${data.auditionTopicId}`
        } else{
             url = fillParams({
                wcl: 'promotion_recommend'
            }, data.url)
        }
        
        locationTo(url);
    }

    onClickViewMore = () => {
        locationTo(`/wechat/page/recommend/view-more?regionCode=guestYouLike`);
    }

    onClickRefresh = async () => {
        const courseList = this.state.courseList;
        if (courseList.status === 'pending' || !courseList.data || !courseList.data.length) return;

        // 数据量不够且还没加载完时，继续请求
        if (courseList.status !== 'end' && this.state.displayOffset + this.state.displaySize * 2 > courseList.data.length) {
            await this.getCourse(true);
        }

        const len = this.state.courseList.data.length;
        const newOffset = this.state.displayOffset + this.state.displaySize;
        this.setState({
            displayOffset: newOffset > len - 1 ? newOffset - len : newOffset,
        })

        collectVisible();
    }
}


export default connect(state => {
    return {
    }
})(GuestYouLike)