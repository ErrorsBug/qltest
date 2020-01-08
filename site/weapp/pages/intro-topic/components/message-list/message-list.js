import { imgUrlFormat, getVal, timeBefore } from '../../../../comp/util'
import request from '../../../../comp/request';
import * as regeneratorRuntime from '../../../../comp/runtime'

class MessageListComponent {
    properties = {
        list: {
            type: Array,
            observer: 'onListChange',
        },
        serverTime: Number,
    }

    data = {
        icon_like_src: __uri('./img/like.png'),
        icon_liked_src: __uri('./img/like-red.png'),

        viewList: [],
    }

    ready() {

    }

    detached() {

    }

    methods = {
        onPraiseClick(e) {
            const { id } = e.currentTarget.dataset
            this.triggerEvent('onPraiseClick', { id })
        },
        onListChange() {
            let { list, serverTime } = this.data
            list = list.map(item => {
                let { headImgUrl, consultTime, replyTime } = item
                headImgUrl = imgUrlFormat(headImgUrl, "?x-oss-process=image/resize,m_fill,limit_0,h_70,w_70")
                consultTime = timeBefore(consultTime, serverTime)
                replyTime = timeBefore(replyTime, serverTime)
                return {
                    ...item,
                    headImgUrl, consultTime, replyTime,
                }
            })
            this.setData({ viewList: list })
        },
    }
}

Component(new MessageListComponent())
