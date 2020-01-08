Component({
    properties: {
        activeTabKey: {
            type: String,
            value: 'index'
        },
        tabs: {
            type: Array,
            value: [{
                key: 'index',
                name: '首页',
                url: '/pages/index/index',
                icon: __inline('/comp/tab-menu/img/tab-home.png'),
                activeIcon: __inline('/comp/tab-menu/img/tab-home-active.png'),
            }, {
                key: 'joined',
                name: '最近学习',
                url: '/pages/joined/joined',
                icon: __inline('/comp/tab-menu/img/topic-icon.png'),
                activeIcon: __inline('/comp/tab-menu/img/topic-icon-active.png')
            }, {
                key: 'mine',
                name: '我的',
                url: '/pages/mine/mine',
                icon: __inline('/comp/tab-menu/img/mine-icon.png'),
                activeIcon: __inline('/comp/tab-menu/img/mine-icon-active.png')
            }]
        }
    },
    data: {
    },
    methods: {
        handleTabTap: (e) => {
            let curTarget = e.currentTarget;
            let isCurrent = curTarget.dataset.iscurrent;
            let url = curTarget.dataset.url;

            if (isCurrent) {
                return;
            }

            if (url) {
                wx.redirectTo({
                    url: url
                });
            }
        }
    }
})
