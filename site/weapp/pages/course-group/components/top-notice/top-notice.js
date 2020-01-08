import statusService from './status.service'

Component({
    properties: {
        groupInfo: {
            type: Object,
            observer: 'onStatusChange',
        },
        isMember: {
            type: Boolean,
            observer: 'onStatusChange',
        },
        isHaruhi: {
            type: Boolean,
            observer: 'onStatusChange',
        },

    },
    data: {
        text: '',
        textClass: '',
    },

    methods: {
        onStatusChange() {
            const { groupInfo, isMember, isHaruhi } = this.data
            const { type, groupStatus } = groupInfo
            const res = statusService.mapStatus(type, groupStatus, isMember, isHaruhi)

            this.setData({
                text: res.text,
                textClass: res.class,
            })
        },
    },
})
