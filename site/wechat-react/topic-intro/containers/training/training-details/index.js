import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

import Page from 'components/page';
import {autobind} from 'core-decorators';
import {share} from 'components/wx-utils';

import StudentTask from './components/student-task';
import {campAnswerlikes} from '../../../actions/channel-intro'
import {getAnswer, getLoadCamp, getUserHomeworkCount} from '../../../actions/training'
import {locationTo} from '../../../../components/util';

import {userBindKaiFang,} from 'actions/recommend';

function mapStateToProps(state) {
    return {
    }
}

const mapActionToProps = {
    campAnswerlikes,
    getLoadCamp,
    getAnswer,
    getUserHomeworkCount,
    userBindKaiFang
};

@autobind
class TrainingDetails extends Component {
    state = {
        list: [],
        campInfo: '',
        isShowGuide: false,
        finishedHomeworkCount: 0 
    }

    componentDidMount() {
        this.initData()
        this.userBindKaiFang();
    }

    // 初始化绑定三方
	async userBindKaiFang() {
		const kfAppId = this.props.location.query.kfAppId;
		const kfOpenId = this.props.location.query.kfOpenId;
		if (kfAppId && kfOpenId) {
			// 绑定分销关系
			this.props.userBindKaiFang(kfAppId, kfOpenId);
		} 
	}

    async initData () {
        const workId = this.props.location.query.workId || '';
        const by = this.props.location.query.by || '';
        const campId = this.props.location.query.campId || '';

        const answerData = await this.props.getAnswer({
            page: {
                page: 1,
                size: 20
            },
            workId,
            studentId: by
        })
        const campData = await this.props.getLoadCamp(campId)
        if (answerData && answerData.list && campData) {
            // 请求作业数
            let finishedHomeworkCount = 0
            if (answerData.list.length > 0) {
                let res = await this.props.getUserHomeworkCount({
                    periodId: answerData.list[0].periodId
                })
                finishedHomeworkCount = res.data.finishedHomeworkCount
            }
            this.setState({
                list: answerData.list,
                campInfo: campData.campPo,
                finishedHomeworkCount
            })
        }
        
        this.initShare()
        this.initGuide()
    }

    initGuide () {
        try {
            let routes = typeof sessionStorage !== 'undefined' && JSON.parse(sessionStorage.getItem('ROUTE_HISTORY'));
            routes instanceof Array || (routes = []);
            const preUrl = routes[routes.length - 2];
            const reg = /page\/learn-record/;
            const reg2 = /page\/homework\/details/;
            
            if (preUrl && (reg.test(preUrl) || reg2.test(preUrl))) {
                this.setState({
                    isShowGuide: true
                })
            }
        } catch (e) {}
    }
	
	initShare() {
        const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/training-details?campId=${this.props.location.query.campId}&workId=${this.props.location.query.workId}&by=${this.props.location.query.by}`
		share({
			title: `这是我在【${this.state.campInfo.name}】完成第${this.state.finishedHomeworkCount}次作业。大家一起来看看`,
			desc: "学习使我快乐，实操才能进步",
			imgUrl: window.location.protocol + require("../img/share-logo.png"),
			shareUrl
		});
	}

    // 点赞
    async toggleFabulous(answer, index) {

        const tempList = [...this.state.list]
        const _answer = { ...answer }

        _answer.liked = answer.liked === 'Y' ? 'N' : 'Y'

        const res = await this.props.campAnswerlikes({
            status: _answer.liked,
            answerId: _answer.id
        })

        if (res.state && res.state.code === 0) {
            if (_answer.liked === 'Y') {
                _answer.upvoteCount += 1
            } else {
                _answer.upvoteCount -= 1
            }

            tempList[index] = { ..._answer }

            this.setState({
                list: tempList
            })
        }
    }
    
	/************************* 视频地址转换 *****************************/
    // 待加载视频列表
    lazyVideos = [];

    getChildContext () {
        return {
            lazyVideo: {
                push: this.pushVideoToLazyVideos,
                remove: this.removeVideoToLazyVideos,
            }
        }
	}
	
    pushVideoToLazyVideos (item) {
        setTimeout(() => {
            if (!this.refs.detailsScroll) {
                this.lazyVideos.push(item);
                return;
            }
    
            if (!this.isVideoFetch(findDOMNode(this.refs.detailsScroll), item)) {
                this.lazyVideos.push(item);
            }
        }, 0);
	}
	
    removeVideoToLazyVideos (id) {
        this.lazyVideos = this.lazyVideos.filter(item => item.id != id);
	}

    isVideoFetch(target, item) {
        const st = target.scrollTop;
        const height = target.clientHeight;
        const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;

        if (pos < height + st) {
            item.init()
            return true;
        } else {
            return false;
        }
	}
    /************************* 视频地址转换 *****************************/

    render() {
        const {campInfo, list} = this.state
        
        return campInfo ? (
            <Page title={`【作业墙】${campInfo.name}`} className='training-details'>

                <div className="container" ref="detailsScroll">

					<div className="camp-intro-wrap">
						<div className="banner"><img src={campInfo.headImage + '?x-oss-process=image/resize,m_fill,h_156,w_250'}/></div>
						<div className="main">
							<div className="title">请为我的作业点赞</div>
							<div className="desc elli-text">我正在参加训练营《{campInfo.name}》</div>
						</div>
					</div>

					<div className="homework-intro-wrap">
						<h1>今日作业</h1>
						{
							list && list.length > 0 && list[0] && list[0].homeworkTitle &&
							<p className="elli-text">{list[0].homeworkTitle}</p>
						}
					</div>

                    {
                        list.length > 0 && (
                            <StudentTask
                                data={list}
                                toggleFabulous={this.toggleFabulous}
                                showComment={this.handleShowComment}
                            />
                        )
                    }

                    {/*<div className="qr-code">*/}
                    {/*    <img src={`http://qr.topscan.com/api.php?text=${encodeURIComponent(window.location.origin + "/wechat/page/live/" + this.state.campInfo.liveId)}`} className="qr-img" />*/}
                    {/*    <p className="tips">长按二维码识别</p>*/}
                    {/*</div>*/}
                </div>

                <div className="footer">
                    <p className="tips">已有<span>{campInfo.authNum}</span>人<br />在训练营不断提升自己</p>
                    <div className="go-intro" onClick={() => locationTo(`/wechat/page/training-intro?campId=${campInfo.id}`)}>去看看</div>
                </div>

                {
                    this.state.isShowGuide && (
                        <div className="guide" onClick={() => this.setState({isShowGuide: false})}>
                            <div className="guide-bg"></div>
                        </div>
                    )
                }
            </Page>
        ) : null
    }
}

TrainingDetails.childContextTypes = {
	lazyVideo: PropTypes.object
};
module.exports = connect(mapStateToProps, mapActionToProps)(TrainingDetails);