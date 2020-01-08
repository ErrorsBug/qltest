import * as React from 'react';
import styles from './style.scss';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { fetchHighBonusCourseList, fetchCourseList } from '../../../../actions/course';
import SectionHeader from "../../../../components/section-header";
import { updateNavCourseModule } from "../../../../actions/common";

import HighBonusItem from '../../../../components/course-list/components/high-bonus-item';

@autobind
class HighBonusBanner extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    state = {
        currentIndex: 1,
        fetchPage: 1,
        list: [],
        isNoneToFetch: false
    }

    componentDidMount() {
        // 高分成列表数据初始化
        this.fetchFirstList();
    }

    componentWillReceiveProps(nextProps) {
        // 用户传入liveId再初始化一次
        if (nextProps.liveId != this.props.liveId) {
            this.fetchFirstList(nextProps.liveId);
        }
    }

    fetchFirstList = async (liveId) => {
        const { fetchPage } = this.state;
        const result = await this.props.fetchHighBonusCourseList({
            type: 'all',
            liveId: liveId || '',
            page: {
                // page: liveId ? fetchPage-1 : fetchPage,
                page: fetchPage,
                size: 12
            }
        });
        if (result.courseList.length < 12) {
            this.setState({isNoneToFetch: true})
        } 
        this.setState({
            list: result.courseList,
            // fetchPage: liveId ? fetchPage : fetchPage+1// 
            fetchPage: fetchPage
        }, () => {
            window.highBonusCoursesCount = this.state.list.length;
        });
    }

    fetchNextList = async () => {
        if (this.state.isNoneToFetch && !liveId) return;
        const { list, fetchPage } = this.state;
        const result = await this.props.fetchHighBonusCourseList({
            type: 'all',
            liveId: this.props.liveId || '',
            page: {
                page: fetchPage,
                size: 12
            }
        });
        // 如果这次将课程列表都加载完了，下次就不请求了
        if (result.courseList.length < 12) {
            this.setState({isNoneToFetch: true})
        } 
        this.setState({
            list: list.concat(result.courseList),
            fetchPage: fetchPage+1
        }, () => {
            window.highBonusCoursesCount = this.state.list.length;
        });
    }
    
    turnPage = (pageCount) => {
        const { currentIndex, list, isNoneToFetch } = this.state;
        let index = currentIndex+pageCount;
        if (index < 1) index = Math.ceil(list.length/4);
        if (index > Math.ceil(list.length/4)) index = 1;
        this.setState({currentIndex: index});

        // 在翻到偶数currentIndex的时候，获取下一个fetchPage的数据
        if (currentIndex % 2 === 0 && !isNoneToFetch) {
            this.fetchNextList();
        }
    }

    // 转载成功的回调
    reprintCallback(courseIndex, response) {
        const relayChannelId = response.data.relayChannelId;
        let newList = [...this.state.list];
        newList[courseIndex].isRelay = 'Y';
        newList[courseIndex].relayChannelId = relayChannelId;
        this.setState({
            list: [...newList]
        });
    }

    render() {
        const { isExist, agentId } = this.props.agentInfo,
              { list, isNoneToFetch, currentIndex } = this.state,
              userIdentity = this.props.userIdentity,
              turnPageImg = require('./img/turn-page-btn.png'),
              showListLen = 4,
              // 显示4个item
              startIndex = (currentIndex - 1) * showListLen,
              currentList = list;
              
        return (
            <section  
                data-name="限时高分成课程"
                className={styles.highBonusBannerWrap + ' ' + (this.state.list.length === 0 ? styles.hide : '' + ' course-module ') }
            >
                {/* <div className={styles.headWrap}>
                    <h2>
                        <img src={require('./img/head1-left.png')} alt=""/>
                        限时高分成课程
                        <img src={require('./img/head1-right.png')} alt=""/>
                    </h2>
                </div> */}
                <SectionHeader
                    className={styles.headWrap}
                    title="限时高分成课程"
                    description="超高分成让利，限时分发"
                    id="限时高分成课程"
                ></SectionHeader>
                <div className={styles.highBonusBanner}> 
                    {   currentIndex > 1 ?
                        <div className={styles.prePage} onClick={() => this.turnPage(-1)}>
                            <img src={turnPageImg} />
                        </div> 
                        : ''
                    }
                    <div className={styles.highBonusList}>
                            {
                                currentList.map((item, index) => {
                                    return <HighBonusItem 
                                                index={index + startIndex}
                                                course={item} 
                                                key={`high-bonus-${index}`} 
                                                isExist={isExist} 
                                                userIdentity={userIdentity}
                                                setReprintInfo={this.props.setReprintInfo}
                                                setReprintModalShow={this.props.setReprintModalShow}
                                                agentId={agentId}
                                                liveId={this.props.liveId}
                                                setPromotionInfo={this.props.setPromotionInfo}
                                                setPromotionModalShow={this.props.setPromotionModalShow}
                                                setLoginModalShow={this.props.setLoginModalShow}
                                                reprintCallback={this.reprintCallback}
                                            />
                                })
                            }
                    </div>
                    {/* {
                        !isNoneToFetch || !(Math.ceil(list.length/4) === currentIndex)  ?
                        <div className={styles.nextPage} onClick={() => this.turnPage(1)}>
                            <img src={turnPageImg} />
                        </div>
                        : ''
                    } */}
                </div>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        moduleList: state.common.moduleList
    }
}

const mapActionToProps = {
    fetchHighBonusCourseList,
    fetchCourseList,
    updateNavCourseModule
}

export default connect(mapStateToProps, mapActionToProps)(HighBonusBanner)