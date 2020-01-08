import { ApiService } from '../components/api-service'
import { Topic, Channel, Page, Region,ResponseData } from '../models/common'
import { FormConfig, SaveConfigReturn, InfoCollectionDataDto, AddressDto } from '../models/customer'

export const apiService = new ApiService()

export async function fetchLive(liveId: string)
{
    const result = await apiService.post({
        url: '/h5/live/get',
        body: { liveId },
        showError: true,
    })
    if (result.state.code === 0) {
        return result.data
    }
}

/**
 * 获取表单配置信息
 * 
 * @export
 * @param {string} liveId 
 * @returns {Promise<FormConfig>} 
 */
export async function fetchFormConfig(liveId: string):Promise<FormConfig>
{
    const result = await apiService.get({
        url: '/h5/live/info/collection/get-config',
        body: { liveId },
    })
    if (result.state.code === 0) {
        return result.data.config
    }
}

/**
 * 保存表单配置信息
 * 
 * @export
 * @param {FormConfig} config 
 * @returns {Promise<FormConfig>} 
 */
export async function saveConfig(config: FormConfig): Promise<SaveConfigReturn>
{
    const result = await apiService.post({
        url: '/h5/live/info/collection/save-config',
        body: { config },
    })
    if (result.state.code === 0) {
        (window as any).message.success('保存成功')
        return result.data.ids
    }
}

/**
 * 获取系列课列表
 * 
 * @export
 * @param {string} liveId 
 * @returns {Promise<Channel[]>} 
 */
export async function fetchChannels(liveId: string, page: number = 1, size: number = 99999): Promise<Channel[]>
{
    const result = await apiService.post({
        url: '/h5/channel/getPcChannelList',
        body: { liveId, page, size },
        showError: true,
    })
    if (result.state.code === 0) {
        return result.data.channelList || []
    }
}

/**
 * 获取课程列表
 * 
 * @export
 * @param {string} liveId 
 * @returns {Promise<Topic[]>} 
 */
export async function fetchTopics(liveId: string, page: number = 1, size: number = 99999): Promise<Topic[]>
{
    const result = await apiService.post({
        url: '/h5/topic/mediaTopicList',
        body: { liveId, page, size },
        showError: true,
    })
    if (result.state.code === 0) {
        return result.data.mediaTopicList || []
    }
}

interface UserListParams {
    liveId: string
    sourceType?: string
    sourceName?: string
    startTime?: string
    endTime?: string
    pageNum?: number
    pageSize?: number
}

export async function fetchUserList(params: UserListParams = {liveId: '',}): Promise<any>
{
    const result = await apiService.post({
        url: '/h5/live/info/collection/list-data',
        body: { ...params },
        showError: true,
    })

    return result
}

interface UpdateUserInfoParams
{
    infoData: InfoCollectionDataDto
    address: AddressDto
}

/* 更新用户信息 */
export async function updateUserInfo(params:UpdateUserInfoParams):Promise<ResponseData<any>>
{
    const result = await apiService.post({
        url: '/h5/live/info/collection/update-user-data',
        body: params,
    })

    return result
}

export async function fetchRegion(pid): Promise<Array<Region>>
{
    const result = await apiService.get({
        url: '/h5/live/info/collection/regions',
        body: { pid },
        showError: true
    })
    if (result.state.code === 0) {
        return result.data.regions
    }
}

type LearnSituationParam = {
    liveId: string
}

export async function fetchLearnSituation(params:LearnSituationParam): Promise<Object> {
    const result = await apiService.post({
        url: '/h5/live/info/myStudent/get-study-time',
        body: params,
        showError: true
    })
    if (result.state.code === 0) {
        return result.data.studyTime;
    }
    // mock
    // const result =  await new Promise((resolve,reject) => {
    //     setTimeout(function() {
    //         resolve([
    //             {
    //                 "10/23": 1
    //             },
    //             {
    //                 "10/24": 2
    //             },
    //             {
    //                 "10/25": 3
    //             },
    //             {
    //                 "10/26": 4
    //             },
    //             {
    //                 "10/27": 5
    //             },
    //             {
    //                 "10/28": 6
    //             },
    //             {
    //                 "10/29": 7
    //             },
    //             {
    //                 "10/30": 8
    //             },
    //             {
    //                 "10/31": 9
    //             },
    //             {
    //                 "11/01": 10
    //             },
    //             {
    //                 "11/02": 11
    //             },
    //             {
    //                 "11/03": 12
    //             },
    //             {
    //                 "11/04": 13
    //             },
    //             {
    //                 "11/05": 14
    //             },
    //             {
    //                 "11/06": 15
    //             }
    //         ])
    //     },200)
    // })
    return result;
}

type StudentDetailParams = {
    id: number;
    liveId: number;
}

export async function fetchStudentDetail(params: StudentDetailParams) {
    const result = await apiService.post({
        url: '/h5/live/info/collection/find-one',
        body: params,
        showError: true
    })
    if (result.state.code === 0) {
        return result.data;
    }
    return result;
}

export async function preSingleMsgCheck (liveId: any, studentId: any) {
    const result = await apiService.post({
        url: '/h5/live/msg/push/pre-single',
        body: {
            liveId,
            studentId,
        },
        showError: true
    });

    if (result.state.code === 0) {
        return result.data.result;
        // return {
        //     isBindSF: 'Y',
        //     totalTimes: 4, 
        //     usedTimes: 10, 
        //     isPushIn24Hours: 'N'
        // }
    }
    
}

export async function preMassMsgCheck (liveId: any) {
    const result = await apiService.post({
        url: '/h5/live/msg/push/pre-batch',
        body: { liveId, },
        showError: true,
    })

    // console.log(result)

    if (result.state.code === 0) {
        return result.data.result;
    }
}

// pramas: liveId, page
export async function getTopicList (params: any) {
    const result = await apiService.post({
        url: '/h5/topic/getTopicNameList',
        body: { ...params },
        showError: true,
    })
    if (result.state.code === 0) {
        return result.data.topicList;
    }
}

export async function getChannelList (params: any) {
    const result = await apiService.post({
        url: '/h5/channel/changeChannelList',
        body: { ...params },
        showError: true,
    })

    if (result.state.code === 0) {
        return result.data.channels;
    }
}

export async function getMsgTemplateList (params: any) {
    const result = await apiService.post({
        url: '/h5/live/msg/template/list',
        body: { ...params },
        showError: true,
    })

    if (result.state.code === 0) {
        return result.data.msgTemplates;
    }
}

export async function deleteTemplate (id: any) {
    const result = await apiService.post({
        url: '/h5/live/msg/template/delete',
        body: { id,  },
        showError: false,
    })

    return result;
}

export async function saveTemplate (msgTemplateDto: any) {
    const result = await apiService.post({
        url: '/h5/live/msg/template/save',
        body: {
            msgTemplateDto,
        },
        showError: false,
    })

    return result;
}

export async function pushSingleMsg (params: any) {
    const result = await apiService.post({
        url: '/h5/live/msg/push/single',
        body: {
            ...params,
        },
        showError: false,
    })

    return result;
}

export async function pushMassMsg (params: any) {
    const result = await apiService.post({
        url: '/h5/live/msg/push/batch',
        body: {
            ...params,
        },
        showError: false,
    })

    return result;
}

export async function getBatchTime (liveId: any) {
    const result = await apiService.post({
        url: '/h5/live/msg/push/batch-times',
        body: {
            liveId,
        },
        showError: false,
    })

    return result;
}