import { getVal } from '../../comp/util';
import * as regeneratorRuntime from '../../comp/runtime'
import request from '../../comp/request'

const app = getApp()

const config = {

    data: {
        liveId: '',
        purchaseCourse: {
            page: 1,
            size: 10,
            list: [],
            noMore: false,
            noneOne: false,
        },
        planCourseList: [],
    },

    async onLoad() {
        try {
            await app.login()
            this.setData({ liveId: global.liveId })
            this.initData()
        } catch (error) {
            console.error('页面初始化失败：', error)
        }
    },

    async initData() {
        this.fetchPurchaseCourse()
        this.fetchPlanCourse()
    },

    fetchPurchaseCourseLock: false,
    async fetchPurchaseCourse() {
        try {
            if (this.fetchPurchaseCourseLock || this.data.purchaseCourse.noMore) {
                return
            }
            this.fetchPurchaseCourseLock = true
            const { liveId, purchaseCourse } = this.data
            const { page, size } = purchaseCourse

            const result = await request({
                url: '/api/studio-weapp/live/purchase-course',
                data: { liveId, page, size },
            })
            this.updatePurchaseCourse(result)
            
        } catch (error) {
            console.log('获取已购课程列表失败: ', error)
        } finally {
            this.fetchPurchaseCourseLock = false    
        }
    },

    updatePurchaseCourse(data) {
        let { list, page, size, noMore, noneOne } = this.data.purchaseCourse

        let newList = getVal(data, 'data.data.list',[])
        list = list.concat(newList)
        noMore = newList.length < size
        noneOne = !list.length
        page++

        this.setData({ purchaseCourse: { list, page, size, noMore, noneOne } })
    },

    async fetchPlanCourse() {
        const { liveId } = this.data
        
        const result = await request({
            url: '/api/studio-weapp/live/plan-course',
            data: { liveId },
        })
        this.updatePlanCourse(result)
    },

    updatePlanCourse(data) {
        let list = getVal(data, 'data.data.list',[])
        list = list.map(item => {
            return {
                learningCount: item.browseNum,
                time: item.startTime,
                title: item.topic,    
                bussinessId: item.id,
                pic: item.backgroundUrl,
                type:'topic',
            }
        })

        this.setData({ planCourseList: list })
    },

    onViewMorePurchaseCouse() {
        this.fetchPurchaseCourse()
    }
}

Page(config)
