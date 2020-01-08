Component({
    properties: {
        menus:{
            type: Object,
        },
        system: String,
    },

    data: {
        showCourse: false,
        showVip: false,
        showIntro: false,

        showMenus: false,
    },

    ready() {
        const { menus } = this.data
        let { showCourse, showVip, showIntro, showMenus , system} = this.data

        if (menus && menus.length) {
            showCourse = showOptionByCode(menus, 'course_table')
            showVip = showOptionByCode(menus, 'vip')
            showIntro = showOptionByCode(menus, 'introduce')

            showMenus = showCourse || (showVip&& system!='ios') || showIntro

            this.setData({ showCourse, showVip, showIntro, showMenus })
        }

        function showOptionByCode(list, code) {
            const option = list.find(item => item.code === code)
            if (option && option.isShow === 'Y') {
                return true
            }
            return false
        }
    },

    methods: {
        onCourseTap() {
            wx.navigateTo({ url: '/pages/course-table/course-table' })
        },
        onVIPTap() {
            wx.navigateTo({ url: '/pages/vip-preview/vip-preview' })
        },
        onIntroTap() {
            wx.navigateTo({ url: '/pages/live-introduce/live-introduce' })
        },
    },
});