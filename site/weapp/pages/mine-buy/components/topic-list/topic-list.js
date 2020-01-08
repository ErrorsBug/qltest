import { api } from '../../../../config';
import request from '../../../../comp/request';

import { linkTo, getVal, imgUrlFormat } from '../../../../comp/util';
const app = getApp();

Component({
    properties: {
        visible: {
            type: Boolean,
        }
    },
    data: {
        page: 1,
        size: 20,

        noMore: false,
        noneOne: false,

        list: [],
    },
    attached() {
        this.loadListLock = false
        this.loadList()
    },
    methods: {
        loadList() {
            if (this.loadListLock) { return }

            const { page, size, noMore, noneOne } = this.data
            if (noMore || noneOne) { return }

            this.loadListLock = true
            app.showLoading()
            request({
                url: api.getPurchaseRecord,
                data: {
                    type: 'topic',
                    page, size,
                }
            }).then(res => {
                if (getVal(res, 'data.state.code') === 0) {
                    this.updateList(getVal(res, 'data.data.list', []))
                }
                this.loadListLock = false
                app.hideLoading()
            }).catch(err => {
                console.error('获取课程购买记录失败', err)
                this.loadListLock = false
                app.hideLoading()
            })
        },
        updateList(data) {
            let { list, page, size, noMore, noneOne } = this.data

            data = data.map(item => ({
                ...item,
                pic: imgUrlFormat(item.pic, '?x-oss-process=image/resize,h_150,w_240,m_fill')
            }))

            list = list.concat(data)
            noneOne = !list.length
            noMore = !data.length || data.length < size
            page++

            this.setData({ list, noneOne, noMore, page })
        },
        linkTotopic: function linkTotopic(e) {
            linkTo.thousandLive(e.currentTarget.dataset.topicid);
        },
    },
})