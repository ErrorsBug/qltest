/**
 * 
 * 
 *  原逻辑已删除，代暂留以后再删
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */



import React from 'react';
import { render } from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ScoreStar, { CourseEvalText } from 'components/score-star';
import { collectVisible } from 'components/collect-visible';
import { request } from 'common_actions/common';
import { showPhonAuthGuide, showWinPhoneAuth } from 'components/phone-auth';


const hasST = typeof sessionStorage !== 'undefined';
const hasLS = typeof localStorage !== 'undefined';


/**
 * 记录学习标记，返回上一页时判断是否弹出评价窗
 */
const studyMarkKey = 'COURSE_EVAL_STUDY_MARK';

export function setStudyMark(conf) {
    if (hasST) {
        sessionStorage.setItem(studyMarkKey, JSON.stringify(conf));
    }
}

export function getStudyMark() {
    if (hasST) {
        try {
            return JSON.parse(sessionStorage.getItem(studyMarkKey));
        } catch (e) {}
    }
}

// 删除未评价单课的学习标记
export function removeStudyMark() {
    if (hasST) {
        sessionStorage.removeItem(studyMarkKey);
    }
}



/**
 * 记录‘稍后评价’操作，当遇到该配置下的课程后系列课下课程，不再弹窗
 */
const noLongerPopKey = 'COURSE_EVAL_NO_LONGER_POP';

export function addNoLongerPop(conf) {
    if (!conf) return;
    if (hasLS) {
        let confs = getNoLongerPop();

        // 已存在则不插入
        if (confs.some(item => item.topicId == conf.topicId || item.channelId == conf.channelId)) return;

        confs.push(conf);
        if (confs.length > 30) {
            confs = confs.splice(confs.length - 30);
        }
        localStorage.setItem(noLongerPopKey, JSON.stringify(confs));
    }
}

// 是否已在不再弹窗列表里
export function ifNoLongerPop(conf) {
    if (!conf) return true;
    let confs = getNoLongerPop();
    return confs.some(item => item.topicId == conf.topicId || item.channelId == conf.channelId);
}

function getNoLongerPop() {
    let result;
    if (hasLS) {
        try {
            result = JSON.parse(localStorage.getItem(noLongerPopKey));
        } catch (e) {}
    }
    result instanceof Array || (result = []);
    return result;
}




/**
 * A页面判断是否显示课程评价弹窗
 */
export function judgeShow() {
    const mark = getStudyMark();

    if (mark && mark.topicId) {
        removeStudyMark();

        let routes;
        if (hasST) {
            try {
                routes = JSON.parse(sessionStorage.getItem('ROUTE_HISTORY'));
            } catch (e) {}
        }
        routes instanceof Array || (routes = []);
        const preUrl = routes[routes.length - 2];
        console.log(preUrl, 'preUrl')
        const reg = /topic\/details|page\/topic-simple-video/;
        
        // 上一页为极简、上课，且本页不为极简、上课，弹窗
        if (preUrl && reg.test(preUrl) && !reg.test(location.pathname)) {
            show({
                ...mark,
                countDown: 5,
                isPageA: true,
            });
        }
    }
}



// 弹出窗口
let instance;

export function show(conf) {
    if (typeof document === 'undefined') return;

    if (instance) return instance.show(conf);

    let container = document.getElementsByClassName('co-win-course-eval-container')[0];
    if (!container) return;

    instance = render(<WinCourseEval {...conf} />, container);
}


class WinCourseEval extends React.PureComponent {
    state = {
        isShow: false,
        score: 0,
        content: '',
        countDown: undefined,

        userInfo: undefined,
    }

    maxStrLen = 200
    timer = null

    componentDidMount() {
        this.show();
    }

    show = (conf = this.props) => {
        this.conf = {...conf};
        clearTimeout(this.timer);
        this.setState({
            isShow: true,
            score: 0,
            content: '',
            countDown: undefined,
        })
    }

    onEnter = () => {
        if (this.conf.countDown > 0) {
            this.startCountDown(this.conf.countDown);
        }
        collectVisible(800);
    }

    render() {
        let lenStr = this.state.content.length;
        if (lenStr >= this.maxStrLen) {
            lenStr = '最多200字哦亲';
        } else {
            lenStr = `${lenStr}/${this.maxStrLen}字`;
        }

        const pos = this.conf && (this.conf.isPageA ? 'A' : 'ended');

        return <TransitionGroup>
            {
                this.state.isShow &&
                <CSSTransition
                    classNames="co-win-course-eval"
                    timeout={{enter: 500, exit: 300}}
                    onEnter={this.onEnter}
                    onExit={this.onExit}
                >
                    <div className="co-win-course-eval">
                        <div className="win">
                            <div className="win-title">对课程还满意吗</div>
                            <div className="course-title"><p>已学课程：{this.conf.title}</p></div>
                            <div className="score-star">
                                <ScoreStar className="on-log on-visible"
                                    attrs={{
                                        'data-log-region': "win-course-eval-score",
                                        'data-log-pos': pos,
                                    }}
                                    score={this.state.score} isEditing={true} onEdit={this.onEditScore}/>
                                <div className={`btn-publish on-log on-visible${this.state.score > 0 && this.state.content.trim() ? '' : ' disabled'}`} 
                                    data-log-region="win-course-eval-publish"
                                    data-log-pos={pos}
                                    onClick={this.onClickPublish}>发布</div>
                            </div>

                            <div className="desc">
                                {
                                    this.state.score === 0 ?
                                    <div className="empty-str">给课程打个分吧~</div> :
                                    <div>
                                        {`${this.state.score}分 `}
                                        <CourseEvalText score={this.state.score} />
                                    </div>
                                }
                            </div>
                            
                            <div className="content-wrap" ref={r => this.contentWrap = r}>
                                <div className="textarea-wrap on-log on-visible"
                                    data-log-region="win-course-eval-content"
                                    data-log-pos={pos}
                                    onClick={this.onClickTextarea}>
                                    <textarea
                                        ref={r => this.ta = r}
                                        value={this.state.content}
                                        onChange={this.onChangeContent}
                                        placeholder="本节课的内容、讲师等方面给你留下了怎样的印象？是否值得推荐给朋友听？说说你的听课心得吧~"
                                    ></textarea>
                                    <div className="str-len">
                                    {lenStr}</div>
                                </div>
                            </div>

                            {
                                this.state.countDown >= 0 &&
                                <div className="eval-later on-log on-visible"
                                    data-log-region="win-course-eval-later"
                                    data-log-pos={this.conf.hasNext ? `${pos}-next` : pos}
                                    onClick={this.onClickEvalLater}
                                >稍后评价（{this.state.countDown}s{this.conf.hasNext ? '后自动播放下一课' : ''}）</div>
                            }
                        </div>
                    </div>
                </CSSTransition>
            }
        </TransitionGroup>
    }

    onClickPublish = async () => {
        if (!this.state.userInfo) {
            await request.post({
                url: '/api/wechat/transfer/h5/user/get',
            }).then(res => {
                return res.data.user;
            }).catch(err => undefined)
            .then(res => {
                this.setState({userInfo: res})
            })
        }

        if (this.state.userInfo && this.state.userInfo.isBind === 'N') {
            if (await showPhonAuthGuide() && await showWinPhoneAuth({needPassword: true})) {
                this.setState({
                    userInfo: {
                        ...this.state.userInfo,
                        isBind: 'Y',
                    }
                })
            } else {
                return;
            }
        }

        if (!(this.state.score > 0)) return window.toast('请给课程打分');
        if (!this.state.content.trim()) return window.toast('请填写课程评价');

        request({
            url: '/api/wechat/evaluation/add',
            method: 'POST',
            body: {
                topicId: this.conf.topicId,
                score: this.state.score,
                content: this.state.content,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            window.toast('发布成功');
        }).catch(err => {
            console.error(err);
            window.toast('发布失败');
        }).then(() => {
            this.close();
            setTimeout(() => {
                this.conf.countDownCallback && this.conf.countDownCallback();
                this.conf = null;
            }, 1500)
        })
    }

    startCountDown = count => {
        if (!count) {
            this.setState({
                countDown: count
            })
            this.conf.countDownCallback && this.conf.countDownCallback();
            return this.close();
        }
        this.setState({
            countDown: count
        }, () => {
            this.timer = setTimeout(() => {
                this.startCountDown(count - 1);
            }, 1000)
        })
    }

    stopCountDown = () => {
        if (this.state.countDown > 0) {
            clearTimeout(this.timer);
            this.setState({
                countDown: undefined,
            })
        }
    }

    onClickEvalLater = () => {
        addNoLongerPop({
            topicId: this.conf.topicId,
            channelId: this.conf.channelId,
        })
        this.close();
    }

    onChangeContent = e => {
        let val = e.target.value;
        val = val.replace(/\r\n|\n|\r/, ' ');
        if (val.length > 200) {
            val = val.slice(0, 200);
        }
        this.setState({
            content: val,
        })
    }

    onEditScore = s => {
        this.setState({
            score: s
        })
        this.stopCountDown();
    }

    onClickTextarea = () => {
        this.ta && this.ta.focus();
        this.stopCountDown();
        setTimeout(() => {
            this.contentWrap && this.contentWrap.scrollIntoView();
        }, 800);
    }

    close = () => {
        this.setState({
            isShow: false,
        })
    }

    onExit = () => {
        console.log(11111)
    }
}




