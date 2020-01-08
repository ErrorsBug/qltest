// 获取打卡状态
export const getCheckStatus = (sysTime, checkStartTime, graduationTime) => {
    if(!checkStartTime) return ''
    const sysDate= new Date(sysTime); // 当前时间
    const checkTime = new Date(checkStartTime); // 开始打卡时间
    const checkEnd = new Date(graduationTime); // 结营典礼时间
    if(sysDate.toDateString() != checkTime.toDateString() && sysDate.getTime() < checkTime.getTime()){ // 打卡为开始
        return "unstart" 
    } else if(sysDate.toDateString() == checkEnd.toDateString()) { 
        return "end"
    } else if(sysDate.toDateString() == checkTime.toDateString() || sysDate.getTime() > checkTime.getTime()) {
        return "ing"
    } else {
        return ''
    }
}

// 奖金参数配置
export const rewardObj = {
    fullAttendance: { 
        title: '恭喜获得全勤奖',
        bg: '#FF7033',
        headLogo: 'time',

    },
    cash: { 
        title: '恭喜获得现金奖励',
        bg: '#FF5D4C',
        headLogo: 'money',

    },
    addHours: { 
        title: '恭喜获得时长奖励',
        bg: '#FF9C01',
        headLogo: 'popular',

    },
    schoolBadge: { 
        title: '恭喜获得女大周边',
        bg: '#E0414F',
        headLogo: 'present',
    },
    notebook: { 
        title: '恭喜获得女大周边',
        bg: '#E0414F',
        headLogo: 'present',
    },
}