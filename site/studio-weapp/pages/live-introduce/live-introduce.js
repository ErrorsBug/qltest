import * as regeneratorRuntime from '../../comp/runtime'
import request from '../../comp/request'
import { getVal, imgUrlFormat } from '../../comp/util'

const app = getApp()

const config = {

    data: {
        introText: '',
        introList: [],
        liveInfo: {},

        liveLogo: '',
        liveName: '',
    },

    async onLoad() {
        try {
            await app.login()
            this.setData({ liveId: global.liveId })
            this.initLiveInfo()
            this.fetchLiveIntro()
        } catch (error) {
            console.error('页面初始化失败：', error)
        }
    },

    async initLiveInfo() {
        const { liveId } = this.data

        const result = await request({
            url: '/api/studio-weapp/live/info',
            data: { liveId },
        })

        const liveInfo = getVal(result, 'data.data')
        const liveLogo = imgUrlFormat(liveInfo.entity.logo || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png', "?x-oss-process=image/resize,m_fill,limit_0,h_140,w_140") 
        const liveName = liveInfo.entity.name
        
        this.setData({ liveInfo, liveLogo, liveName })
    },

    async fetchLiveIntro() {
        const { liveId } = this.data
        
        const result = await request({
            url:'/api/studio-weapp/live/intro',
            data: { liveId },
        })

        if (getVal(result, 'data.state.code') === 0) {
            this.updateLiveIntro(result)
        } else {
            wx.showToast({ title: '获取简介失败' })
        }
    },

    updateLiveIntro(data) {
        let introText = getVal(data,'data.data.introduce')
        let introList = getVal(data, 'data.data.profileList')
        introList = introList.map(item => {
            let url = imgUrlFormat(item.url, '@750w_1e_1c_2o')
            return { ...item, url }
        })

        this.setData({ introText, introList })
    },
}

Page(config)
