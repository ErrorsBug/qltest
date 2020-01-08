import { imgUrlFormat,formatSecondToTimeStr } from '../../../../../../comp/util'
import { getLastTopicPlayInfo,getHisTopicPlayInfo } from '../../../../../../comp/play-history'
import { AudioPlayer } from '../../../../../../comp/audio-player';

Component({
    properties: {
	    hideAudioBox: {
		    type: Boolean,
		    observer: "animate"
	    }
    },
    data: {
        bg: '',
        title: '',
        topicId: '',
        time: 0,
        visible: true,
        leftTransformDeg: 135,
        rightTransformDeg: 135,
        allTime: 0,//音频时长
        progressTime: 0,//当前进度
        playStatus: false,
        img:{
            play: __inline('/pages/index/components/recommend-b/components/audio-box/img/play.png'),
            pause: __inline('/pages/index/components/recommend-b/components/audio-box/img/pause.png'),
        },
        hideAnimationData: null,
        showAnimationData: null,
        end: false,
    },
    detached() {
        clearInterval(this.interval)
        clearInterval(this.computInterval)
        clearTimeout(this.naviTimeout)
    },
    attached() {
        this.player = wx.getBackgroundAudioManager()
        this.checkHistory()
        /* 先获取一次状态，然后每两秒获取一次状态 */
        this.getState()
        this.interval = setInterval(() => {
            this.checkHistory()
            this.getState()
        }, 2000);
        this.computInterval = setInterval(()=>{
            this.data.playStatus && this.setProgressbar(this.data.progressTime, this.data.allTime);
        },1000)
    },
    ready(){
        this.hideAudioBox()
        this.showAudioBox()
    },
    methods: {        
        // 播放条隐藏动画
        hideAudioBox(){
            let data= wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            }).opacity(0).bottom('-20rpx').step().export()
            this.setData({hideAnimationData: data})
        },        
        // 播放条出现动画
        showAudioBox(){
            let data= wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            }).opacity(1).bottom('120rpx').step().export()
            this.setData({showAnimationData: data})
        },
        checkHistory() {
            const playInfo = getLastTopicPlayInfo() 
            let bg, title, topicId;
            if (playInfo) {
                bg = imgUrlFormat(playInfo.backgroundImgUrl, "?x-oss-process=image/resize,m_fill,limit_0,h_68,w_68")
                title = playInfo.title
                topicId = playInfo.topicId
                
                this.setData({ bg, title, topicId, visible: true })
            } else {
                this.setData({ visible: false })
            }
        },
        getState() {
            const { playStatus } = this.data
            if (this.player.duration && !this.player.paused) {
                this.setData({
                    playStatus: true,
                    end: false,
                })
                wx.getStorage({
                    key: 'audioList',
                    success: (result)=>{
                        this.ifPlayComplete(result.data,this.player.duration,this.player.currentTime,this.player.src)
                        let playedTime = this.fetchPlayedtime(result.data,this.player.currentTime,this.player.src)
                        this.fetchProgress(result.data, playedTime)
                    } 
                })
            }else {
                this.setData({playStatus: false})
            }
        },
        /**判断是否播放完成 */
        ifPlayComplete(data,duration,currentTime,src){
            let content = data[data.length-1].content
            src = src.replace(/.mp3|.aac|.m4a|.mar/,'')
            //音频播放到最后一个且当前播放时间点在最后一个音频时长的最后两秒内
            if(content == src && this.data.playStatus && (duration - currentTime < 2)){
                this.setData({
                    end: true,
                })
            }
        },
        /*获取已经播放完的时长*/
        fetchPlayedtime(list,current,src){
            let playedTime = 0
            src = src.replace(/.mp3|.aac|.m4a|.mar/,'')
            for (let i=0,len=list.length;i<len;i++){
                if(list[i].content == src) {
                    playedTime += Number(current)
                    break;
                }else {
                    playedTime += Number(list[i].second)
                }
            }
            return playedTime;
        },
        /*获取播放进度和总时长 */
        fetchProgress(list, playedTime){
            //音频id，已经播放的时长
            let {audioId,diffTime = 3} = getLastTopicPlayInfo();
            // 音频总时长
            let duration = 0;
            list.forEach((item,index)=>{
                duration += Number(item.second)
            })
            // 开课时长小于两个钟，显示正在直播
            if (0 < diffTime && diffTime < 2){
                this.setData({time: '正在直播'})
            }else if(diffTime >= 2) {
                this.setData({time: formatSecondToTimeStr(duration)})
            }else {
                this.setData({time: '未开始'})
            }

            this.setData({
                allTime: duration,
                progressTime: playedTime
            })
        },
        /* 音频播放按钮点击事件 */
        onPlayClick(e) {
            let {playStatus} = this.data
            if(playStatus) {
                this.player.pause();
                this.setData({playStatus: false})
            }else {
                this.player.play();
                this.setData({playStatus: true})
            }

        },
        setProgressbar(progressTime, allTime){
            //如果播放完了，将进度设为100%
            if (this.data.end){
                progressTime = allTime
            }
            //确保已经从缓存拿到总时长
            if(allTime > 0){
                let deg = 0;
                let {leftTransformDeg,rightTransformDeg} = this.data;
                //当进度小于一半时，左边的进度完全隐藏，只进行右边的进度
                if (progressTime <= allTime/2){
                    deg = 135 + (progressTime / allTime * 360);
                    this.setData({
                        rightTransformDeg: deg,
                        leftTransformDeg: 135,
                    })
                }else{
                    // 即使播放完了，progressTime一定是小于allTime的，这里没办法容忍了6s的误差。。
                    // if (progressTime + 6 > allTime) {
                    //     this.setData({
                    //         end: true,
                    //         rightTransformDeg: 315,
                    //         leftTransformDeg: 315,
                    //     })
                    // }else {
                        //当进度大于一半时，右边的进度完全显示，只进行左边的进度
                        deg = 135 + ((progressTime-allTime/2) / allTime * 360);
                        this.setData({
                            rightTransformDeg: 315,
                            leftTransformDeg: deg,
                        })
                    // }
                }
            }
        },
        viewCourse() {
            if (this.navigateLock) { return }
            this.navigateLock = true
            wx.navigateTo({
                url: '/pages/thousand-live/thousand-live?topicId=' + this.data.topicId
            })
            this.naviTimeout = setTimeout(() => {
                this.navigateLock = false
            }, 1000)
        },
    }
})
