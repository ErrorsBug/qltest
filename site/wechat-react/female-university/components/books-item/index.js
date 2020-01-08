import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import Picture from 'ql-react-picture'
import classnames from 'classnames'
import { AudioPlayer } from 'components/audio-player'
import PlayingAnimate from 'components/playing-animate'
import LearnInfo from '../learn-info'
import { locationTo } from 'components/util';
import { fetchMediaUrl } from '../../actions/common'
import { setUniversityCurrentCourse } from "../../actions/flag";
import { isQlchat } from 'components/envi'
import appSdk from 'components/app-sdk'
import RankStatus from '../rank-status' 
import CsItemCate from '../course-item/cs-item-cate'

const CourseItem = ({ handlePlayBtn, idx, title, keyA, keyB,keyC, curPlayIdx, loading, playStatus, courseId, teacher,label,desc,
        handleGoPage, isShowRank,
        id, isOne, topicId, headImgUrl, playUrl,isHideNum,isShowItemCate, ...otherProps  }) => {
    const flag = !loading && playStatus && Object.is(idx, curPlayIdx)
    const cls = classnames('play-btn', {
        'play': !flag,
        'loading': loading && Object.is(idx, curPlayIdx)
    })
    const rankCls = classnames({
        'one': idx === 0,
        'two': idx === 1,
        'three': idx === 2,
    })
    return (
        <div className="un-books-item on-log on-visible" 
            data-log-name={ title }
            data-log-region="un-books-item"
            data-log-pos={ topicId || courseId }
            data-log-index={ idx }
            onClick={ () => {
                handleGoPage(topicId || courseId)
                
            } }>
            <div className="un-library-pic">
                <div className="un-library-img">
                    <Picture src={ keyA || headImgUrl || '' } resize={{ w: 190, h: 240 }} />
                </div>
                { isShowRank && <RankStatus rankNum={ `NO.${ idx + 1 }` } className={ rankCls } /> }
                <div onClick={ (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePlayBtn(playUrl, idx, topicId || courseId);
                } } className={ cls }>
                    { flag && <PlayingAnimate className="play-line" /> }
                </div>
            </div>
            <div className="un-library-info">
                <div className="un-library-decs">
                    <h4 className={ isOne ? 'one' : 'two' } dangerouslySetInnerHTML={{__html:title }}></h4>
                    <p className={ `teacher ${isOne ? 'one' : 'two'}` } dangerouslySetInnerHTML={{__html: keyC || teacher }}></p>
                    <p className={ isOne ? 'two' : 'one' } dangerouslySetInnerHTML={{__html: keyB || desc }}></p>
                </div>
                {
                    isShowItemCate && <CsItemCate {...otherProps}/>
                }
                <LearnInfo 
                    id={ id } 
                    className={ isShowRank ? 'block' : '' }
                    region="un-books-join" 
                    topicId={ topicId || courseId } 
                    isHideNum={isHideNum}
                    { ...otherProps } />
            </div>
        </div>
    )
}

@autobind
export default class extends Component {
    state = {
        loading: false,                 // 播放加载
        playIdx: -1,                    // 当前播放下标
        playStatus: 'play',             // 播放状态
        topicId: '',                    // 当前播放的话题ID
    }
    audioPlayer = null;
    componentDidMount() {
        this.initAudio();
    }

    componentWillReceiveProps({ selectIdx }){
        if(selectIdx != this.props.selectIdx){
            if(!!this.audioPlayer){
                this.audioPlayer.pause();
            }
            this.unmountPage()
        }
    }
    componentWillUnmount(){
       if(!!this.audioPlayer){
            this.audioPlayer.destroy && this.audioPlayer.destroy();
            this.audioPlayer = null;
        }
        this.unmountPage();
    }
    unmountPage() {
        this.setState({
            playStatus: 'play',
            loading: false,
            playIdx: -1,
        })
    }
    // 初始化
    initAudio = () => {
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.on("ended", this.audioEnded);
        this.audioPlayer.on("pause", this.audioPause);
        this.audioPlayer.on("timeupdate", this.audioTimeupdate);
        this.audioPlayer.on("canplaythrough", this.audioCanPlayThrough);
        this.audioPlayer.on("waiting", this.audioWaiting);
    }
    //  监听播放
    audioTimeupdate() {
        let lastVisit = {};
        let tempVisit = {};
        if ( localStorage.getItem('localLastVisit')) {
            lastVisit = JSON.parse(localStorage.getItem('localLastVisit'))
        };
        tempVisit['visitTime'] = Date.now();
        tempVisit['currentTime'] = this.audioPlayer.currentTime;
        tempVisit['duration'] =  this.audioPlayer.duration 
        lastVisit[this.state.topicId] = tempVisit;
        //最多保留100个
        let lastVisitArr = Object.entries(lastVisit);
        lastVisitArr = lastVisitArr.sort((a, b) => {
            let rev = -1;
            a = a[1]['visitTime'];
            b = b[1]['visitTime'];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        
        })
        if (lastVisitArr.length > 100) {
            let key = lastVisitArr[lastVisitArr.length - 1][0];
            delete lastVisit[key]
        }
        localStorage.setItem('localLastVisit', JSON.stringify(lastVisit))
    }
    // 监听播放结束
    audioEnded(){
        this.setState({
            playStatus: 'play',
            playIdx: -1,
        })
    }
    // 暂停播放
    audioPause() {
        console.log('播放暂停')
    }
    // 播放加载中
    audioWaiting() {
        this.setState({
            loading: true
        })
    }
    // 开始播放
    audioCanPlayThrough() {
        setTimeout(() => {
            this.setState({
                loading: false
            })
        },500)
    }
    async handlePlayBtn(src, idx, topicId){
        const { loading, playIdx, playStatus } = this.state;
        let url = src;
        if(!src){
            const { audio = {} } = await fetchMediaUrl(topicId);
            url = audio && audio?.playUrl || ''
        } else {
            url = src;
        }
        if(!url) {
            window.toast("还没有上传音频哟")
            return false
        }
        if(loading) return false;
        let status = "";
        if(Object.is(playIdx, idx)){
            if(Object.is(playStatus, 'pause')){
                status = 'play';
                this.audioPlayer.pause();
            } else {
                status = 'pause';
                this.audioPlayer.resume(); // 恢复播放
            }
        } else {
            status = 'pause';
            this.audioPlayer.play(url);
            this.setCurrentCourse(topicId);
        }
        this.setState({
            playStatus: status,
            playIdx: idx,
            topicId: topicId
        })
    }

    setCurrentCourse(topicId){
        setUniversityCurrentCourse({
            businessId: topicId,
            businessType: 'topic',
            currentId: topicId,
        });
    }
    // 跳转链接
    handleGoPage(topicId) {
        if(isQlchat()){
            appSdk.linkTo(`dl/live/topic?topicId=${ topicId }`)
        } else {
            locationTo(`/topic/details-listening?topicId=${ topicId }&tracePage=liveCenter&isUnHome=Y`)
        }
    }
    renderBooks() {
        const { loading, playIdx, playStatus } = this.state;
        const { lists = [], ...otherProps } = this.props; 
        return (
            lists.map((item, index) => (
                <CourseItem 
                    { ...item }
                    key={ `${ item.id }-${index}` } 
                    loading={ loading }
                    idx={ index }
                    handleGoPage={ this.handleGoPage }
                    handlePlayBtn={ this.handlePlayBtn }
                    playStatus={ Object.is(playStatus, 'pause') }
                    curPlayIdx={ playIdx }
                    { ...otherProps } />
            )) 
        )
    }
    render() {
        return (this.renderBooks())
    }
}

