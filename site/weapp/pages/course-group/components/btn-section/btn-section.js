Component({
    properties: {
        groupInfo: {
            type: Object,
            observer: 'onStatusChange',
        },
        joinList: {
            type: Object,
            observer: 'onStatusChange',
        },
        isHaruhi: {
            type: Boolean,
            observer: 'onStatusChange',
        },
        isMember: {
            type: Boolean,
            observer: 'onStatusChange',
        },
    },
    data: {
        showShare: false,
        showEnter: false,
        showJoin: false,
        showStart: false,
        showReStart: false,
    },

    methods: {
        onStatusChange() {
            const { joinList, isHaruhi, isMember } = this.data
            const { type, groupStatus } = this.data.groupInfo

            /* 按钮显示的条件判断，命名那么清晰就不多写注释了 */
            const showShare = groupStatus === 'ING' && (isHaruhi || isMember)
            const showEnter = isMember
                || (type === 'charge' && isHaruhi)
                || (type === 'free' && groupStatus === 'PASS' && isHaruhi)
            const showJoin = !isHaruhi && !isMember && groupStatus === 'ING'
            const showStart = !isHaruhi && !isMember
                && (groupStatus === 'PASS' || groupStatus === 'OVER')
            const showReStart = isHaruhi && type === 'free' 
                && (groupStatus === 'PASS' || groupStatus === 'OVER')
            
            this.setData({ showShare, showEnter, showJoin, showStart, showReStart })
        },
        onEnterTap() {
            this.triggerEvent('onEnterTap')
        },
        onJoinTap() {
            this.triggerEvent('onJoinTap')
        },
        onStartTap() {
            this.triggerEvent('onStartTap')
        },
        onFormSubmit(e) {
            this.triggerEvent('updateFormId', { formId: e.detail.formId })
        },
    },
})
