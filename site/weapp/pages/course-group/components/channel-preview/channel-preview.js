Component({
    properties: {
        channelInfo: Object,
        groupInfo: Object,
    },
    data: {

    },
    methods: {
        linkToChannel() {
            this.triggerEvent('linkToChannel')
        },
    },
})