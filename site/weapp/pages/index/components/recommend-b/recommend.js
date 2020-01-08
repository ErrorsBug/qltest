//recommend.js
//获取应用实例
var app = getApp();

import log from '../../../../comp/log';
import { linkTo, getVal, digitFormat, imgUrlFormat } from '../../../../comp/util';
// import { initTabMenu } from '../../../../comp/tab-menu/tab-menu';
import { initSwiperBanners } from '../../../../comp/swiper-banners/swiper-banners';
import { api } from '../../../../config';
import request from '../../../../comp/request';
import * as regeneratorRuntime from '../../../../comp/runtime';

Component({

    data: {
        banners: [],
        hotLives: [],
        courseList: [],
        cateList: [],
        loadingCourseList: true,
        item_placeholder: __uri('/pages/index/components/recommend-b/img/item-placeholder.png'),
        activeTag: '0',
        userInfo: {},
        scrollHeight: '100%',
        hotLiveIndex: 5,
        noMore: false,
        loading: false,
        bottomTip: '加载数据中',
        icons: [],
        menuActive: 0,

        /* 当前的swiper index */
        curPanelIndex: 0,
        panels: [],
	    interestData: null,
        toView: '',
        isReverseToDailyBtn: false,
        scrollTop: 0,//滚动条距离顶部距离
        hideAudioBox: false,
        // 导航栏高度
        categoryBarHeight: 0,
         /*ios的判断，支付按钮隐藏*/
        system: app.globalData.system
    },

    async ready() {
        this.initIndexData();
        this.fetchIconList();

        // 加载分类列表
        await this.loadPageData();

        // 初始化列表
        // this.fetchCourseList('0');

        // 初始化页面滚动区域高度
        this.initScrollHeight();
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
                let usedHeight = 0;

                if (this.data.activeTag == '0' || (target && target.children.length === 0)) {
                    usedHeight = 175;
                } else {
                    usedHeight = 265
                }

                this.setData({
                    scrollHeight: (res.windowHeight - usedHeight * rate) + 'px'
                });
            } catch (error) {
                console.error(error);
            }
        },

        onCateItemSelectd(e) {
            const { panels } = this.data
            const tagId = e.detail.tagId;
            let panelIndex = 0 
            panels.find((item,index) => {
                if (item.id === tagId) {
                    panelIndex = index
                    return true
                }
                return false
            })

            this.onListSwiperChange({
                detail: {
                    current: panelIndex,
                    source: 'click',
                },
            })
        },

        onCateChildItemSelected(e) {
            const tagId = e.detail.tagId;

            const { panels } = this.data
            const panelIndex = this.findPanelIndexWithTagId(tagId)
            this.setData({
                [`panels[${panelIndex}]`]: {
                    ...panels[panelIndex],
                    activeChildTag: tagId,
                    hotLives: [],
                    courseList: [],
                }
            })

            this.fetchHotLives(tagId)
            this.fetchCourseList(tagId)
        },

        onListSwiperChange(e) {
            
            const { current, source } = e.detail
            let { panels, curPanelIndex, activeTag } = this.data

            curPanelIndex = current
            const panel = panels[curPanelIndex]
            const { init, id, noMore, courseList } = panel

            activeTag = panels[current].id
            this.setData({ curPanelIndex, activeTag })

            if (!init) {
                setTimeout(() => {
                    this.fetchCourseList(activeTag)
                    this.fetchHotLives(activeTag)
                }, 300);
            }
        },

        onFormSubmit(e){
            global.commonService.updateFormId(e.detail.formId)
        },

        async initIndexData(){
            const res = await request({
                url: api.initIndexData,
                cache: true,
	            expires: 60 * 5 // 5分钟
            }).then(res => res.data);
            console.log(res);
            if(res.state.code === 0){
                const regions = res.data.regions || [];
                this.setData({regions})
                if (regions.find((item)=> item.type == 'interest')) {
                    this.initIndexInterest()
                }
            }
        },

        async initIndexInterest(){
	        const res = await request({
		        url: api.initIndexInterest,
		        cache: true,
		        expires: 60 * 5 // 5分钟
            }).then(res => res.data);
	        if(res.state.code === 0 && res.data.courses.length){
	            this.setData({
                    interestData: res.data
                });
            }
        },

        async fetchIconList(){
            const res = await request({
                url: api.iconList,
                data: {
                    platform: 'weapp'
                }
            });
            if(res.data.state.code === 0) {
                let iconList = res.data.data.zoneList,icons = [],iconGroup = [],ind = 0;
                //将icon列表分成五个一组
                for (let i = 0,len = iconList.length; i < len; i++){
                    if (ind == Math.floor(i / 5)) {
                        iconGroup.push(iconList[i])
                    } else {
                        icons.push(iconGroup)
                        iconGroup = []
                        iconGroup.push(iconList[i])
                        ind++
                    }
                }
                if(iconGroup.length){
                    icons.push(iconGroup)
                }
                this.setData({icons})
            }
        },

        /**
         * 加载页面数据并渲染
         * @return {[type]} [description]
         */
        loadPageData() {
            return request({
                url: api.getIndexData,
                cache: false,
                expires: 60 * 5 // 5分钟
            }).then((res) => {
                var result = res.data.data || res.data;

                let hotLives = getVal(result, 'hotLives.data.lives', []);
                let banners = getVal(result, 'banners.data.banners', []);
                let isAudit = getVal(result, 'isAudit.data.isAuth', 'N');
                let cateList = getVal(result, 'categoryList.data.dataList', []);

                banners = banners.map(item => {
                    return {
                        ...item,
                        backgroundUrl: imgUrlFormat(item.backgroundUrl, '?x-oss-process=image/resize,h_290,w_750,m_fill')
                    }
                })

                // 初始化banners
                initSwiperBanners(this, {
                    indicatorDots: true, // 显示面板指示点
                    autoplay: true, // 是否自动播放
                    interval: 5000, // 切换时间间隔
                    duration: 500,  // 滑动动画时长
                    circular: true, // 衔接动画
                    items: banners
                });

                let hotLiveIndex = this.data.hotLiveIndex;

                if (hotLiveIndex > hotLives.length) {
                    hotLiveIndex = hotLives.length;
                }

                let parentList = {};
                cateList.forEach(item => {
                    if (item.parentId !== '0') {
                        if (!parentList[item.parentId]) {
                            parentList[item.parentId] = { children: [ item ] };
                        } else {
                            parentList[item.parentId].children.push(item);
                        }
                    } else {
                        if (!parentList[item.id]) {
                            parentList[item.id] = { ...item, children: [ ] };
                        } else {
                            parentList[item.id] = { ...item, children: parentList[item.id].children };
                        }
                    }
                });

                cateList = [];
                for (const key in parentList) {
                    if (parentList.hasOwnProperty(key)) {
                        cateList.push(parentList[key]);
                    }
                }
                const panels = cateList.map(item => {
                    let childTag = []
                    if (item.children.length) {
                        childTag = item.children.map(item=>item.id)
                    }
                    return {
                        id: item.id,
                        activeChildTag: item.id,
                        childTag,
                        courseList: [],
                        hotLives: [],
                        init: false,
                        loading: false,
                        noMore: false,
                        noneOne: false,
                    }
                })
                const firstPanel = {
                    id: '0',
                    activeChildTag: '',
                    childTag: [],
                    courseList: [],
                    hotLives,
                    init: false,
                    loading: false,
                    noMore: false,
                    noneOne: false,
                }
                panels.unshift(firstPanel)

                this.setData({
                    hotLives,
                    isAudit,
                    cateList,
                    panels,
                });

                // this.saveAssortsTitle(assorts);
            }, (err) => {
                console.log('reject. ', err);
                app.hideLoading();
            }).catch((err) => {
                console.error('catch err. ', err);
                app.hideLoading();
                });
        },

        handleMenuItemClick(e) {
            const url = e.currentTarget.dataset.url;
            if(url.indexOf('http') < 0){
                wx.navigateTo({
                    url: url
                });
            }else {
                linkTo.webpage(url);
            }
        },

        findPanelIndexWithTagId(tagId) {
            if (tagId === '0') { return 0 }

            const { cateList,panels } = this.data
            let panelTagId

            cateList.find(item => {
                if (item.id === tagId) {
                    panelTagId = item.id
                    return true
                }
                if (Array.isArray(item.children)) {
                    item.children.find(childItem => {
                        if (childItem.id === tagId) {
                            panelTagId = item.id
                            return true
                        }
                    })
                }
                return false
            })

            let panelIndex
            panels.find((item,index) => {
                if (item.id === panelTagId) {
                    panelIndex = index
                    return true
                }
                return false
            })
            
            return panelIndex
        },

        async fetchHotLives(tagId) {
            try {
                const result = await request({
                    url: api.hotLiveS,
                    cache: true,
                    expires: 60 * 5, // 5分钟
                    data: { tagId },
                })
                
                let hotLives = getVal(result, 'data.data.lives', []);
                let panelIndex = this.findPanelIndexWithTagId(tagId)

                this.setData({
                    [`panels[${panelIndex}].hotLives`]: hotLives
                })

            } catch (error) {
                console.error('获取热门直播间失败', error)
            }
        },

        onScrollToLoad() {
            this.fetchCourseList(this.data.activeTag)
        },

        async fetchCourseList(tagId) {
            const { panels } = this.data
            const panelIndex = this.findPanelIndexWithTagId(tagId)
            let {
                id,
                courseList,
                init,
                loading,
                noMore,
                noneOne,
            } = panels[panelIndex]

            if (noMore || loading) { return }

            this.setData({ [`panels[${panelIndex}].loading`] : true })
            const loadingTime = Date.now()

            try {
                const result = await request({
                    url: api.courseList,
                    cache: true,
                    expires: 60 * 5, // 5分钟
                    data: {
                        offset: courseList.length,
                        tagId,
                        pageSize: 20,
                    }
                })

                let newList = getVal(result, 'data.data.dataList', []);
                init = true
                noMore = newList.length === 0
                courseList = courseList.concat(newList)
                loading = false

                this.setData({
                    [`panels[${panelIndex}]`]: {
                        ...panels[panelIndex],
                        init,
                        noMore,
                        loading,
                        courseList,
                    },
                })

            } catch (error) {
                console.error('获取课程列表错误：', error)
                this.setData({ [`panels[${panelIndex}].loading`]: false })
            } 
        },
        onFeedbackClick() {
            const systemInfo = wx.getSystemInfoSync()
            const {userInfo }= this.data

            const data = {
                userInfo,
                systemInfo,
                weappVersion: global.weappVersion,
            }

            request({
                url: '/api/weapp/mine/feedback-info',
                method: 'POST',
                data,
            })
        },
	    toDailyBtnTapHandle(){
            if(this.data.activeTag !== '0') return false;
            if(this.data.isReverseToDailyBtn){
	            this.setData({
		            toView: 'banner-wrap'
	            })
            }else{
	            this.setData({
		            toView: 'daily-collection'
	            })
            }
        },
	    onScroll(e){
		    if(this.data.activeTag !== '0') return false;
		    wx.createSelectorQuery().in(this).select('.list-title').boundingClientRect(rect => {
                const scrollHeight = Number(this.data.scrollHeight.replace('px',''));
		        if(rect.top <= this.data.catagoryBarHeight + scrollHeight && !this.data.isReverseToDailyBtn){

		            // 首页滚下去才初始化每日精选
			        if(!this.data.panels[0].init){
				        this.fetchCourseList('0');
                    }

			        this.setData({
				        isReverseToDailyBtn: true
			        })
                }else if(rect.top > this.data.catagoryBarHeight + scrollHeight && this.data.isReverseToDailyBtn){
			        this.setData({
				        isReverseToDailyBtn: false
			        })
                }
            }).exec();
            //向下滚动或者停止向下滚动的时候隐藏播放条
            if(e.detail.deltaY < 0){
                this.setData({hideAudioBox: true})
            }else {
                this.setData({hideAudioBox: false})
            }
        },
	    courseItemTapHandle(e){
		    global.loggerService.click(e)
		    const course = e.currentTarget.dataset.course;

		    if(course.url){
			    wx.navigateTo({
				    url: `/pages/web-page/web-page?url=${encodeURIComponent(course.url)}`
			    });
			    return;
            }

		    const url = course.businessType === 'channel'
			    ?
			    `/pages/channel-index/channel-index?channelId=${course.businessId}`
			    :
			    `/pages/thousand-live/thousand-live?topicId=${course.businessId}`;

		    wx.navigateTo({
			    url
		    });
	    },
        getMoreBtnTapHandle(e){
	        const regionCode = e.detail.code || '';
	        const name = e.detail.name || '';
	        if(regionCode){
		        wx.navigateTo({
			        url: `/pages/view-more/view-more?regionCode=${regionCode}&name=${encodeURIComponent(name)}`
		        });
            }
        },
        //头部head-menu部分swiper切换
        headMenuSwiperChange(e){
            this.setData({menuActive: e.detail.current})
        },
        updateCategoryBarHeight(e){
            const params = e.detail;
            this.setData({
	            catagoryBarHeight: params.height
            })
        }
    },
});
