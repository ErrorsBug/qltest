import React, { Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Page from 'components/page';

import ScrollView from 'components/scroll-view';
import { debounce } from 'lodash';
import Picture from 'ql-react-picture';
import { locationTo, getVal, getLocalStorage, setLocalStorage } from 'components/util';
import { request } from 'common_actions/common';
import detect from 'components/detect';
import { share } from "components/wx-utils";
import { initShareKnowledge } from '../../components/common';
import Video from './video';
import CollectVisible from 'components/collect-visible';
import animation from 'components/animation';


let mainOrigin = 'https://m.qlchat.com';
const readCacheCleanHour = 3;





class PageContainer extends React.Component {
    state = {
        originSk: undefined,
        skList: {
            status: '',
            data: undefined,
            minSize: 10,
        },
        skMap: {}, // 存放所有短知识对象
        curSkIndex: undefined,
    }

    componentDidMount() {
        this.getMainDomain();
        this.getRulesCache();
        this.getSkList(true).then(() => {
            // 首页渲染滚定位到第二条
            if (!(this.state.originSk && this.state.skList.data && this.state.skList.data.length > 0)) {
                this.onScrollHandler();
                return;
            }
            const wrap = document.getElementsByClassName('hot-recommend-sv')[0];
            if (!wrap) return;
            const skItem = document.getElementsByClassName('sk-item')[0];
            if (!skItem) return;
            wrap.scrollTop = skItem.clientHeight;
        });
        this.initSharePage();
    }

    render() {
        const { originSk, skList, skMap, curSkIndex } = this.state;

        let allSk = originSk ? [originSk] : [];
        skList && skList.data && (allSk = allSk.concat(skList.data));

        return (
            <Page title="热门推荐" className="p-sk-hr">
                <ScrollView
                    className="hot-recommend-sv"
                    onNativeScroll={this.onScroll}
                    onScrollBottom={() => this.getSkList()}
                    status={skList.status}
                >
                    <div>
                    {
                        allSk.map((id, index) => {
                            return <SkItem
                                key={index}
                                data={skMap[id]}
                                isCur={curSkIndex == index}
                                onClickLike={this.onClickLike}
                                onClickShare={this.onClickShare}
                                initSharePage={this.initSharePage}
                            />
                        })
                    }
                    </div>
                    {skList.status === 'end' && <div style={{paddingTop: '80%'}}></div>}
                </ScrollView>
            </Page>
        )
    }

    getSkList = async (isFirstPage) => {
        if (/pending|end/.test(this.state.skList.status)) return;

        this.setState({
            skList: {
                ...this.state.skList,
                status: 'pending',
            }
        })

        await (isFirstPage
            ?
            Promise.all([
                this.getOriginSk(), // 头部插入源端短知识
                this._getSkList()
            ])
            :
            this._getSkList()
        )
            .then(() => {
                const list = [],
                    skMap = {...this.state.skMap};

                // 键值分离
                this._getSkListBuffer.forEach(item => {
                    list.push(item.id)
                    if (!skMap[item.id]) {
                        skMap[item.id] = item;
                    }
                })
                this._getSkListBuffer = [];

                this.setState({
                    skList: {
                        ...this.state.skList,
                        status: 'success',
                        data: (this.state.skList.data || []).concat(list),
                    },
                    skMap,
                }, () => {
                    this.getLikesStatus(list);

                    if (list.length < this.state.skList.minSize) {
                        this.skListRules = this.getInitRules();
                    }

                    this.saveRulesCache();
                })
            }).catch(err => console.error(err))
    }

    rulesCacheLsKey = "QL_SK_HOT_RECOMMEND_RULES_CACHE"

    getRulesCache = () => {
        this.skListRules = this.getInitRules();
        const cache = getLocalStorage(this.rulesCacheLsKey);
        if (!cache) return;

        const cleanDate = new Date();
        cleanDate.setHours(readCacheCleanHour);
        cleanDate.setMinutes(0);
        cleanDate.setSeconds(0);
        if (Date.now() > cleanDate.getTime() && (cache.createTime || 0) < cleanDate.getTime()) return;

        console.log(cache)
        // 只取status page createTime
        for (let i = 1; i <= 3; i ++) {
            if (cache[i].status === 'end') {
                this.skListRules[i].status = 'end';
            }
            if (cache[i].page.page) {
                this.skListRules[i].page.page = cache[i].page.page;
            }
        }
        if (cache.createTime) {
            this.skListRules.createTime = cache.createTime;
        }
    }

    saveRulesCache = () => {
        // 记录当前页数，下次加载页面从后面开始
        const cache = JSON.parse(JSON.stringify(this.skListRules));
        setLocalStorage(this.rulesCacheLsKey, cache);
    }

    getInitRules = () => {
        return {
            1: {
                status: '',
                page: {
                    size: 10,
                }
            },
            2: {
                status: '',
                page: {
                    size: 10,
                },
            },
            3: {
                status: '',
                page: {
                    size: 10,
                },
            },
            createTime: Date.now(),
        }
    }

    skListRules = {}

    /**
     * 列表结构：
     * 1.查询热门推荐的50个列表
     * 2.查询最近3天创建的按照热门分数排序的列表
     * 3.随机查询
     */
    _getSkListBuffer = []
    _getSkList = async (env = {
        rule1ErrTimes: 0,
        rule2ErrTimes: 0,
        rule3ErrTimes: 0,
    }) => {
        const rules = this.skListRules;

        if (rules[1].status !== 'end') {
            const page = {...rules[1].page};
            page.page = page.page ? page.page + 1 : 1;
            console.log('rule', 1, page)
            this._requestSkListRule1 || (this._requestSkListRule1 = this.requestSkList({
                rule: 1,
            }))
            await this._requestSkListRule1.then(res => {
                let list = res.data.list || [];
                // 前端分页
                const start = page.size * (page.page - 1);
                list = list.slice(start, start + page.size);
                if (list.length < page.size) rules[1].status = 'end';
                list = this.skListReadFilter(list);
                console.log('valid num', list.length)
                this._getSkListBuffer = this._getSkListBuffer.concat(list);
                rules[1].page = page;
            }).catch(err => {
                console.error(err);
                env.rule1ErrTimes++;
                env.rule1ErrTimes > 1 && (rules[1].status = 'end');
            })

        } else if (rules[2].status !== 'end') {
            const page = {...rules[2].page};
            page.page = page.page ? page.page + 1 : 1;
            console.log('rule', 2, page)
            await this.requestSkList({
                rule: 2,
                page,
            }).then(res => {
                let list = res.data.list || [];
                if (list.length < page.size) rules[2].status = 'end';
                list = this.skListReadFilter(list);
                console.log('valid num', list.length)
                this._getSkListBuffer = this._getSkListBuffer.concat(list);
                rules[2].page = page;
            }).catch(err => {
                console.error(err);
                env.rule2ErrTimes++;
                env.rule2ErrTimes > 1 && (rules[2].status = 'end');
            })

        } else if (rules[3].status !== 'end') {
            const page = {...rules[3].page};
            page.page = page.page ? page.page + 1 : 1;
            console.log('rule', 3, page)
            await this.requestSkList({
                rule: 3,
                page,
            }).then(res => {
                let list = res.data.list || [];
                if (list.length < page.size) rules[3].status = 'end';
                list = this.skListReadFilter(list);
                console.log('valid num', list.length)
                this._getSkListBuffer = this._getSkListBuffer.concat(list);
                rules[3].page = page;
            }).catch(err => {
                console.error(err);
                env.rule3ErrTimes++;
                env.rule3ErrTimes > 1 && (rules[3].status = 'end');
            })
        } else {
            return;
        }

        if (this._getSkListBuffer.length < this.state.skList.minSize) {
            return this._getSkList(env)
        }

        return;
    }   

    skListReadFilter = (list) => {
        if (list instanceof Array) {
            // const ignore = this.readCache.map;
            const ignore = this.props.location.query.knowledgeId;
            return list.filter(item => item.id != ignore)
        }
        return list;
    }

    getOriginSk = () => {
        return request.post({
            url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/getKnowledgeById',
            body: {
                id: this.props.location.query.knowledgeId,
                bOrC: 'C',
            }
        }).then(res => {
            if (res.data.dto) {
                const sk = res.data.dto;
                const skMap = {...this.state.skMap};
                skMap[sk.id] = sk;
                this.setState({
                    originSk: sk.id,
                    skMap,
                })
            }
        }).catch(err => {
            console.error(err);
        })
    }

    requestSkList(body) {
        // const target = new Date()
        // target.setHours(target.getHours() < readCacheCleanHour ? readCacheCleanHour : 24 + readCacheCleanHour)
        // target.setMinutes(0)
        // target.setSeconds(0)

        return request.post({
            url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/getHotKnowledgeList',
            body,
            // localCache: (target - Date.now()) / 1000, // 定时清空请求缓存
        })
    }

    onClickLike = data => {
        const cur = !data.likes;

        // 先修改，再请求；请求回调后再处理
        this.updateSkLike(data.id, cur);

        if (data._likeStatus !== 'pending') {
            this.getSk(data.id)._likeStatus = 'pending';
            Promise.all([
                cur
                ?
                request.post({
                    url: '/api/wechat/transfer/interactApi/interact/likes',
                    body: {
                        type: 'knowledge',
                        topicId: data.id,
                        speakId: data.id,
                    }
                })
                :
                request.post({
                    url: '/api/wechat/transfer/interactApi/interact/cancelLikes',
                    body: {
                        type: 'knowledge',
                        businessId: data.id,
                    }
                }),
                requestStatNum(data.id, 'likeNum', cur ? 'add' : 'reduce')
            ]).then(res => {
                // 请求完不一样就再请求
                if (this.getSk(data.id).likes != cur) {
                    this.onClickLike(data);
                } 
            }).catch(err => {
                console.error(err);
                // 请求失败的话还原
                if (this.getSk(data.id).likes == cur) {
                    this.updateSkLike(data.id, !cur);
                } 
            })
        }
    }

    updateSkLike = (id, bool) => {
        const data = typeof id === 'object' ? id : this.state.skMap[id];
        if (bool) {
            this.updateSk(data.id, {
                likes: true,
                likeNum: (data.likeNum || 0) + 1,
            })
        } else {
            this.updateSk(data.id, {
                likes: false,
                likeNum: (data.likeNum || 0) - 1,
            })
        }
    }

    getLikesStatus = (list) => {
        request.post({
            url: '/api/wechat/transfer/interactApi/interact/likesList',
            body: {
                speakIds: list.join(',')
            }
        }).then(res => {
            const skMap = {...this.state.skMap};
            res.data.speaks.forEach(item => {
                skMap[item.speakId].likes = item.likes;
            })
            this.setState({
                skMap
            })
        })
    }

    getSk = (id) => {
        return this.state.skMap[id];
    }

    updateSk = (id, obj) => {
        const skMap = {...this.state.skMap};
        if (skMap[id]) {
            skMap[id] = {
                ...skMap[id],
                ...obj,
            }
        }
        this.setState({
            skMap,
        })
    }

    onClickShare = (data, onSuccess) => {
        initShareKnowledge(data, {
            successFn: () => {
                this.addShareNum(data);

                requestStatNum(data.id, 'shareTime', 'add')
                    .catch(err => {});

                onSuccess && onSuccess();

                typeof _qla !== 'undefined' && _qla('event',{
                    category: 'ShortVideoShare',
                    business_id: data.id,
                })

                window.toast('分享成功');
            },
        });
    }

    initSharePage = () => {
        share({
            title: '刷有趣视频，每天涨知识！',
            desc: '千聊知识短视频，推荐给你',
            imgUrl: 'https://img.qlchat.com/qlLive/liveComment/9H6H3YHR-3ZIE-JQJ4-1556258288065-4POQXV522PFC.png',
            successFn: () => {
                window.toast('分享成功');
            },
        })
    }

    addShareNum = (id) => {
        const data = typeof id === 'object' ? id : this.state.skMap[id];
        this.updateSk(data.id, {
            shareNum: (data.shareNum || 0) + 1,
        })
    }

    onScroll = e => {
        this.onScrollHandler(e.target);
    }
    
    onScrollHandler = debounce((wrap = document.getElementsByClassName('hot-recommend-sv')[0]) => {
        // 切换当前激活的短知识
        
        const skItem = document.getElementsByClassName('sk-item')[0];
        if (!skItem) return;
        const itemH = skItem.clientHeight;

        const scrollTop = wrap.scrollTop - itemH * 0.125;
        const curIndex = Math.ceil(scrollTop / itemH);

        if (curIndex != this.state.curSkIndex) {
            this.setState({
                curSkIndex: curIndex,
            })
        }
    }, 100)

    getMainDomain = () => {
        request.post({
            url: '/api/wechat/transfer/h5/domain/getActivityDomainUrl',
            body: {
                type: 'main',
            }
        }).then(res => {
            mainOrigin = res.data.domainUrl.replace(/\/$/, '')
            this.forceUpdate();
        }).catch(err => console.error(err))
    }
}



export default connect(state => {
    return state;
}, {
})(PageContainer)







class SkItem extends React.PureComponent {
    state = {
        isShowSider: false,
        isShowShare: false,
        status: '',
    }

    componentWillUpdate() {
        this._isCur = this.props.isCur;
    }

    componentDidUpdate() {
        // 监听从激活状态切换到非激活
        if (this.props.isCur != this._isCur) {
            if (!this.props.isCur) {
                this.onInactive();
            }
        }
    }

    onInactive() {
        this.setState({
            isShowSider: false,
        })
        this.hasClickContentOnce = false;
        this.onCloseShare();
    }

    render () {
        const { data, isCur } = this.props;
        const isShowVideo = !this.notSupportPlayInline && isCur;
        
        return <div
            className={`sk-item${isCur ? ' current' : ''}`}
            ref={r => this.ref = r}
        >
            <div className="header" onClick={this.goToSk}>
                <div className="title">{data.name}</div>
            </div>
            <div className="content"
                onClick={this.onClickContent}
            >   
                {
                    isShowVideo
                        ?
                        <Video
                            autoPlay
                            // controls
                            src={getVal(data, 'resourceList.0.mediaMap.video.0.playUrl')}
                            listeners={this.listeners}
                        ></Video>
                        :
                        <React.Fragment>
                            {
                                !!data.coverImage &&
                                <Picture className="cover-img" src={data.coverImage} resize={{w: 750, h: 468}}>33</Picture>
                            }
                            <div className="btn-play"></div>
                        </React.Fragment>
                }
                {
                    isShowVideo && this.state.status === 'waiting' &&
                    <div className="icon-loading"></div>
                }
                {
                    this.state.isShowSider &&
                    <CollectVisible>
                        <div className="sider on-log on-visible"
                            data-log-region="short-knowledge"
                            data-log-pos="tips"
                            onClick={this.onClickSider}>
                            <i></i><p>全屏观看</p><p>有彩蛋哦</p>
                        </div>
                    </CollectVisible>
                }
            </div>

            <div className="info">
                <div className="live-info on-log"
                    data-log-region="short-knowledge"
                    data-log-pos="photo"
                    onClick={this.onClickLive}>
                    <div className="live-img">
                        {!!data.liveHeadImage && <Picture src={data.liveHeadImage} resize={{w: 56, h: 56}}/>}
                    </div>
                    <div className="live-name">{data.liveName}</div>
                </div>
                <div className="stat-num share-num on-log"
                    data-log-region="short-knowledge"
                    data-log-pos="share"
                    onClick={this.onClickShare}>{data.shareNum || 0}</div>
                <div className={`stat-num like-num on-log${data.likes ? ' likes' : ''}`}
                    data-log-region="short-knowledge"
                    data-log-pos="like"
                    onClick={() => this.props.onClickLike(data)}>{data.likeNum || 0}</div>
            </div>

            {
                !isCur &&
                <div className="mask"
                    onClick={this.onClickMask}
                ></div>
            }
            
            {
                isCur && this.state.isShowShare &&
                <div className={`share-tips ${this.state.isShowShare}`}
                    onClick={this.onCloseShare}
                ></div>
            }
        </div>
    }

    listeners = {
        timeupdate: e => {
            if (!this.props.isCur) return;
            if (this.props.data.goodsStatus !== 'Y') return;
            const currentTime = e.target.currentTime;
            if (currentTime > 15) {
                this.showSider();
            }
        },
        ended: e => {
            if (!this.props.isCur) return;
            if (this.props.data.goodsStatus !== 'Y') return;
            this.showSider();
        },
        firstPlaying: e => {
            requestStatNum(this.props.data.id, 'playNum')
        },
        playing: e => {
            this.state.status !== 'playing' && this.setState({
                status: 'playing'
            })
        },
        waiting: e => {
            this.state.status !== 'waiting' && this.setState({
                status: 'waiting'
            })
        },
    }

    hasClickContentOnce = false // 未播放情况下点击过一次content
    onClickContent = () => {
        if (this.props.data.type !== 'ppt' && !this.hasClickContentOnce && !this.state.status) {
            this.hasClickContentOnce = true;
            try {
                this.ref.getElementsByTagName('video')[0].play();
            } catch (e) {}
            return;
        }

        let platform = 'normal';
        if (detect.os.ios) {
            platform = 'ios';
        } else if (detect.os.android) {
            platform = 'android';
        }

        typeof _qla !== 'undefined' && _qla.click({
            region: 'short-knowledge',
            pos: 'fullScreen_' + platform,
        });
        this.goToSk();
    }
    
    onClickMask = () => {
        const wrap = document.querySelector('.hot-recommend-sv');

        animation.add({
            startValue: wrap.scrollTop,
            endValue: this.ref.offsetTop,
            duration: 300,
            easing: 'easeInOutQuad',
            step: (v) => {
                wrap.scrollTop = v;
            }
        })
    }

    onClickShare = e => {
        if (this.state.isShowShare) return this.onCloseShare();

        const itemEl = this.ref;
        const wrap = document.querySelector('.hot-recommend-sv');
        const topSpace = itemEl.offsetTop - wrap.scrollTop;
        const bottomSpace = document.body.clientHeight - topSpace - itemEl.clientHeight;
        this.setState({
            isShowShare: topSpace > bottomSpace ? 'top' : 'bottom',
        })
        this.props.onClickShare(this.props.data, this.onCloseShare);
    }

    onCloseShare = () => {
        if (!this.state.isShowShare) return;
        this.setState({isShowShare: false});
        this.props.initSharePage();
    }

    onClickSider = (e) => {
        e.stopPropagation();
        this.goToSk();
    }

    goToSk = () => {
        locationTo(`/wechat/page/short-knowledge/video-show?knowledgeId=${this.props.data.id}&liveId=${this.props.data.liveId}`);
    }

    onClickLive = () => {
        locationTo(`${mainOrigin}/wechat/page/short-knowledge/video-list?liveId=${this.props.data.liveId}`);
    }

    showSider = () => {
        !this.state.isShowSider && this.setState({
            isShowSider: true,
        })
    }

    get notSupportPlayInline() {
        return this.props.data.type === 'ppt'
        // || !!detect.os.android
    }
}







function requestStatNum(knowledgeId, type, status) {
    return request.post({
        url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/statShortKnowledge',
        body: {
            knowledgeId,
            type,
            status,
        }
    })
}