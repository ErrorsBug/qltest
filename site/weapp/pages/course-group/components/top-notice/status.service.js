class StatusService {
    constructor() {
    }

    findText(groupStatus, type, isHaruhi, isMember) {
        if (groupStatus === 'ING') {
            if (isHaruhi) { return '开团成功，快找好友参团吧！' }
            if (isMember) { return '参团成功，快去听课吧' }
            return '发现好知识，邀你一起来听课！'
        }

        if (groupStatus === 'PASS') {
            if (isHaruhi) { return '已拼课成功，快去听课吧' }
            if (isMember) { return '参团成功，快去听课吧' }
            return '拼课已结束，快开团吧'
        }

        if (groupStatus === 'OVER') {
            if (isHaruhi || isMember) {
                return '未拼成，尝试听课吧'
            }
            return '拼课已结束，快开团吧'
        }
    }

    findClass(groupStatus) {
        return groupStatus === 'OVER' ? 'fail' : 'normal'
    }

    mapStatus(type, groupStatus, isMember, isHaruhi) {
        return {
            text: this.findText(groupStatus, type, isHaruhi, isMember),
            class: this.findClass(groupStatus)
        }
    }
}

const statusService = new StatusService()
export default statusService