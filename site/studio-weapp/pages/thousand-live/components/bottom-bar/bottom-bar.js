import request from '../../../../comp/request';
import { normalFilter } from '../../../../comp/util';
import { api } from '../../../../config';

var app = getApp();

/**
 * 页面底部工具条
 * @param {Boolean} {            properties: {                             isShow: {                        type: Boolean        }    } [description]
 * @param {[type]}  data:    {                                             }       [description]
 * @param {[type]}  methods: {                    onHide(e [description]
 */
Component({
    properties: {
        topicId: {
            type: String,
        },
        liveId: {
            type: String,
        },
        isCommentBanned: {
            type: Boolean,
        },
        topicEnded: {
            type: Boolean,
        },
        inputText: {
            type: String,
            value: '',
        },
        isInputFocus: {
            type: Boolean,
            value: false,
        },
        isQuestion: {
            type: Boolean,
            value: false,
        },
        isShowComment: {
            type: Boolean,
            value: false,
        },
        isShowBarrage: {
            type: Boolean,
            value: false,
        }
    },

    data: {

    },

    methods: {
        inputOnFocus() {
            this.setData({
                'isInputFocus': true,
            });
        },

        inputOnChange(e){
            this.setData({
                'inputText':e.detail.value
            })
        },

        inputOnBlur() {
            console.log('blur');
            this.setData({
                'isInputFocus': false,
            });
        },

        questionBoxOnClick(e) {
            console.log('cilck');
            this.setData({
                'isInputFocus': true,
                'isQuestion': !this.data.isQuestion
            });
        },
        // 输入框事件
        inputComplete(e) {
            let value = this.data.inputText;
            const isQuestion = this.data.isQuestion ? 'Y': 'N';

            if (value.trim() == "") {
                wx.showToast({
                    title: "内容不能为空",
                    icon: 'loading',
                    duration: 2000
                })
                return;
            }

            if (value.trim().length > 10200) {
                wx.showToast({
                    title: "内容字数不能超过200字",
                    icon: 'loading',
                    duration: 2000
                })
                return;

            }

            app.showLoading();

            value = normalFilter(value);

            this.addComment('text', value, isQuestion)
                .then(result => {
                    app.hideLoading();
                    if (result.data.state.code === 0) {
                        this.setData({
                            'inputText': '',
                            'isQuestion': false,
                        });
                    } else {
                        wx.showToast({
                            title: result.data.state.msg,
                            icon: 'loading',
                            duration: 2000
                        })
                    }

                }).catch(err => {
                    app.hideLoading();
                });
        },

        onBarrageBtnClick(e) {
            this.triggerEvent('onBarrageBtnClick', e);
        },
        onCommentBoxBtnClick(e) {
            this.triggerEvent('onCommentBoxBtnClick', e);
        },
        onOperationBtnClick(e) {
            this.triggerEvent('onOperationBtnClick', e);
        },
        // 发送消息
        addComment(type, content, isQuestion) {
            let that = this;
            return request({
                url: api.addComment,
                method: 'POST',
                data: {
                    liveId: this.data.liveId,
                    topicId: this.data.topicId,
                    type,
                    content,
                    isQuestion,
                }
            });
        },
    },

    ready () {
    }
});
