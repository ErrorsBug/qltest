class ChannelBarComponent {
    properties = {
        channelInfo: Object,
    }

    data = {
    }

    ready() {
    }

    detached() {

    }

    methods = {
        linkToChannel() {
            const {channelId} = this.data.channelInfo  
            wx.redirectTo({
                url: `/pages/channel-index/channel-index?channelId=${channelId}`
            })
        },
    }
}

Component(new ChannelBarComponent())
