'use strict';

import log from '../../comp/log';
import { api } from '../../config';

import { linkTo, getVal, imgUrlFormat , formatDate} from '../../comp/util';
import { timeAfter, isBeginning, digitFormat } from '../../comp/filter';
import request from '../../comp/request';

const app = getApp();

Page({
    data: {
        list: [],
        viewList: [],
        
        page: 1,
        size: 60,
        noMore: false,
        noneOne: false,
        lastCourseTime:null,
    },

    //事件处理函数
    onLoad: function ready () {
        app.login().then(() => {

            this.loadPage();

            console.log('this.getPageUrl() ---- ', this.getPageUrl());
            // 页面pv日志
            // log.pv({
            //     page: '我参与的话题',
            //     url: this.getPageUrl()
            // });
        });
    },

    getPageUrl() {
        return this.__route__;
    },

    /* 请求锁 */
    fetchingList: false,
    loadPage() {
        console.log('loadPage')
        if (this.fetchingList) { return }
        
        const { page, size, noMore, noneOne, lastCourseTime } = this.data
        if (noMore || noneOne) {
            return
        }

        this.fetchingList = true
        const params = {
            page,
            size,
            liveId: global.liveId,
            pageSize: size,
            time: lastCourseTime || 0,
            beforeOrAfter: 'before',
        };

        request({
            url: api.recentLearning,
            data: params,
        }).then((res) => {
            this.fetchingList = false

            const list = getVal(res, 'data.data.learningList', [])
            this.updateList(list);
        }).catch((e) => {
            this.fetchingList = false
            app.hideLoading();
        });
    },
    updateList(data) {
        let {
            noneOne, noMore, page, size,
            list, viewList,lastCourseTime
        } = this.data
        
        noMore = !data.length 
        noneOne = !data.length && page === 1
        console.log('noMore',noMore)
        /* 去个重 */
        data = data.filter(item => {
            let { id } = item
            let repeated = list.find(course => course.id === id)
            if (repeated) {
                return false
            }
            return true
        })

        list = list.concat(data)
        page += 1
        viewList = this.modelListToView(list)
        lastCourseTime = getVal(list, `${list.length - 1}.lastLearnTime`)
        
        this.setData({ noneOne, noMore, page, list, viewList, lastCourseTime})
    },
    modelListToView(list) {
        return list.map(item => {
            return {
                ...item,
                backgroundUrl: imgUrlFormat(item.backgroundUrl, '@300h_480w_1e_1c_2o'),
                lastLearnTime: formatDate(item.lastLearnTime, 'MM-dd hh:mm'),
            }
        })
    },
    linkTotopic(e) {
        linkTo.thousandLive(e.currentTarget.dataset.topicid);
    },
});
