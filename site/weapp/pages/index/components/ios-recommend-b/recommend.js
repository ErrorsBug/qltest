import request from '../../../../comp/request';
import * as regeneratorRuntime from '../../../../comp/runtime';
import { api } from '../../../../config';

let page = 1, pageSize = 20, requesting = false;

Component({

    data: {
        // 滚动列表高度
        scrollHeight: 0,
        // 课程列表
        courseList: [],
        // 页面锚点
        anchor: '',
        // 显示回到顶部按钮
        showBackTop: false,
        // 列表数据是否已经加载完毕
        noMore: false,
    },

    methods: {
        /**
         * 初始化滚动列表高度
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        initScrollHeight(target) {
            try {
                const res = wx.getSystemInfoSync();

                let rate = res.windowWidth / 750;
                let usedHeight = 100;

                this.setData({
                    scrollHeight: res.windowHeight - usedHeight * rate,
                });
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 加载课程数据
         */
        async loadCourseData() {
            if (requesting) {
                return;
            }
            requesting = true;
            const res = await request({
                method: 'POST',
                url: api.getIosFreeCourses,
                data: {
                    caller: 'weapp',
                    page: {
                        page: page,
                        size: pageSize
                    }
                }
            });
            if (res.data.state.code === 0) {
                const courseList = res.data.data.courseList || [];
                this.setData({
                    courseList: this.data.courseList.concat(courseList),
                    noMore: courseList.length < pageSize
                });
                page = page + 1;
            }
            requesting = false;
        },

        /**
         * 控制回到顶部按钮的显示或隐藏
         * @param {Object} event 滚动事件对象
         */
        handleScroll(event) {
            let { scrollTop } = event.detail;
            if (scrollTop >= 50) {
                if (!this.data.showBackTop) {
                    this.setData({
                        showBackTop: true
                    });
                }
            } else {
                if (this.data.showBackTop) {
                    this.setData({
                        showBackTop: false
                    });
                }
            }
        },

        /**
         * 回到页面顶部
         */
        backToTop() {
            this.setData({
                anchor: 'top'
            });
        }
    },

    ready() {
        this.loadCourseData();
        this.initScrollHeight();
    }
});