Component({
    properties: {
        active: {
            type: String,
        },
    },
    data: {
        tabs: [
            {
                tab: "channel",
                tabName: "系列课",
                tabIcon: "",
                tabIconAction: ""
            },
            {
                tab: "topic",
                tabName: "话题",
                tabIcon: "",
                tabIconAction: ""
            },
            // {
            //     tab: "vip",
            //     tabName: "VIP",
            //     tabIcon: "",
            //     tabIconAction: ""
            // },
        ],
    },
    methods: {
        onTabClick(e) {
            this.triggerEvent('onTabClick', { tab: e.currentTarget.dataset.tab })
        },
    }
})