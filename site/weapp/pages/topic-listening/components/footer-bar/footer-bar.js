import {
    imgUrlFormat, timeBefore, normalFilter, getVal,
} from '../../../../comp/util';
import { api } from '../../../../config';
import request from '../../../../comp/request';

/* 一个简单的评论列表展示组件 */
Component({
    properties: {
        liveId: {
            type: String,
            value: '',
        },
        topicId: {
            type: String,
            value: '',
        },
    },
    data: {
        value: '',
        valid: false,
        textareaHidden: true,
        inputFocus: false,
    },

    attached() {
    },

    methods: {
        onFakeInputClick() {
            this.setData({
                textareaHidden: false,
                inputFocus: true,
            })
        },
        onTextareaWrapClick() {
            this.setData({
                textareaHidden: true,
                inputFocus: false,
            })
        },
        catchTextareaSectionClick() {
            console.log('catched')
        },
        /* 评论框输入事件 */
        onInputChange(e) {
            let { value, valid } = this.data
            value = e.detail.value
            valid = value.length > 0 && value.length <= 200

            this.setData({ value, valid })
        },
        sendComment() {
            let { value, liveId, topicId } = this.data

            value = value.trim()
            /* 很简单的验证，就不封装什么validation方法了 */
            if (value.length <= 0) {
                wx.showToast({ title: '请输入评论内容'})
                return
            }
            if (value.length > 200) {
                wx.showToast({ title: '评论最多200字'})
                return
            }

            /* 请求时展示loading，可以提示用户发送状态也可以防止重复点击 */
            wx.showToast({
                icon: 'loading',
                title: '正在发送',
                mask: true,
            })
            request({
                url: api.addComment,
                method: 'POST',
                data: {
                    liveId: liveId,
                    topicId: topicId,
                    type: 'text',
                    content: normalFilter(value),
                    isQuestion: 'N',
                }
            }).then(res => {
                wx.hideToast()
                if (getVal(res, 'data.state.code') === 0) {
                    wx.showToast({
                        icon: 'success',
                        title: '发送成功',
                        duration: 2000
                    })
                    this.triggerEvent('prependComment', { comment: getVal(res, 'data.data.liveCommentView') })
                    this.setData({ value: '' })
                } else {
                    wx.showModal({
                        title: getVal(res, 'data.state.msg'),
                    })
                }
            }).catch(e => {
                wx.hideToast()
                console.error(e)
            })
        },
        redirectToThousanLive() {
            wx.redirectTo({ url: `/pages/thousand-live/thousand-live?topicId=${this.data.topicId}&fromDetail=Y` })
        },
    }
})