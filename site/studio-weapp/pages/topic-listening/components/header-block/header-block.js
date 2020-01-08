import {
    imgUrlFormat, getVal, formatSecondToTimeStr,
} from '../../../../comp/util';
import { api } from '../../../../config';
import request from '../../../../comp/request';
// import { AudioPlayer } from '../../../../comp/audio-player';

Component({
    properties: {
        topicInfo: {
            type: Object,
            value: {},
        },
        userInfo: {
            type: Object,
            value: {},
        },
        topicId: {
            type: String,
            value: '',
        },
        liveId: {
            type: String,
            value: '',
        },
        playTimeStr: {
            type: String,
            value:'00:00',
        },
        durationStr: {
            type: String,
            value: '00:00',
        },
        ratio: {
            type: Number,
            value: 0,
        },
        status: {
            type: String,
            value: 'init',
        }
    },
    data: {
        playBtnAnimation: {},
    },
    ready() {
        console.log('this.data.topicId', this.data.topicId)
    },
    methods: {
        /* 音频进度条拖动事件s */
        onSliderChange(e) {
            this.triggerEvent('onSliderChange', { value: e.detail.value})
        },
        /* 音频播放按钮点击事件 */
        onPlayClick() {
            this.playBtnAnimationTrigger()
            this.triggerEvent('onPlayClick', {})
        },
        /* 播放按钮动画 */
        playBtnAnimationTrigger() {
            const animation = wx.createAnimation({
                duration: 180,
                timingFunction: 'linear',
            })
            animation.scale(1.1, 1.1).step().scale(1, 1).step()

            this.setData({
                playBtnAnimation: animation.export()
            })
        },
        /* 去往详情页 */
        onRedirectClick() {
            this.triggerEvent('onRedirectClick', {})
        },
    }
})
