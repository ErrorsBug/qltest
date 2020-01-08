import { LiveService } from './live.service'
import { ChannelService } from './channel.service'
import { CourseGroupService } from './course-group.service'
import { BonusesService } from './bonuses.service'

const liveService = new LiveService()
const channelService = new ChannelService()
const courseGroupService = new CourseGroupService()
const bonusesService= new BonusesService()

export const LIVE_SERVICE = 'LIVE_SERVICE'
export const CHANNEL_SERVICE = 'CHANNEL_SERVICE'
export const COURSEGROUP_SERVICE = 'COURSEGROUP_SERVICE'
export const BONUSES_SERVICE = 'BONUSES_SERVICE'


const services = {
    [LIVE_SERVICE]: liveService,
    [CHANNEL_SERVICE]: channelService,
    [COURSEGROUP_SERVICE]: courseGroupService,
    [BONUSES_SERVICE]: bonusesService,
}

export class Provider{
    static provide(service_key) {
        return services[service_key]
    }

    static inject(obj, keys) {
        try {
            keys.forEach(key => {
                if (obj.hasOwnProperty(key)) {
                    throw new Error('对象已有该服务字段', key)
                }
                let svc = services[key]
                if (!svc) {
                    throw new Error('需求的服务不存在', key)
                }
                Object.defineProperty(obj, key, {
                    value: svc,
                    enumerable:true,
                })
            })
            return obj
        } catch (error) {
            console.error('[服务注入失败]', error)            
            return obj
        }
    }
}
