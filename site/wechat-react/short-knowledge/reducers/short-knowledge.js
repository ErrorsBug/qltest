import { 
    UPLOAD_IMAGE, 
    ACTIVE_IMAGE, 
    UPDATE_IMAGE_LIST,
    ADD_AUDIO,
    MOVE_AUDIO,
    DELETE_AUDIO,
    TOTAL_SECOND,
    ADD_TEXT_CONTENT,
    INIT_DATA
} from '../actions/short-knowledge';
import { getUrlParams } from 'components/url-utils';
var initState = {
    uploadVideoData: {},
    resourceList: [],
    activeImage: {},
    textContent: {},
    audioList: {},
    totalSecond: 0,
    initData: {}
}

// 创建页面实时保存数据，防止刷新页面导致数据丢失
const saveData = (key, value) => {
    if(typeof window == 'undefined'){
        return
    }
    if(getUrlParams('id')){
        return
    }
    if(typeof key == 'string'){
        window.sessionStorage && window.sessionStorage.setItem(key, JSON.stringify(value))
    }else if(typeof key == 'object'){
        for(let i in key){
            window.sessionStorage && window.sessionStorage.setItem(i, JSON.stringify(key[i]))
        }
    }
}

export function shortKnowledge(state = initState, action) {
    switch (action.type) {
        // 上传图片
        case UPLOAD_IMAGE:
            // 初始化
            if(action.init){
                return {...state, resourceList: action.imgList.map((i,d)=>({...i,active: d==0})), activeImage: {...action.imgList[0], active: true} }
            }
            // 原图片列表是否为空
            let empty = state.resourceList.length < 1 ? true : false
            let newList = empty ? [] : [...state.resourceList]
            // 原图片列表是否为空的话就将传入的图片列表中的第一个置为选中状态
            Array.prototype.forEach.call(action.imgList, (i,d)=>{
                newList.push({...i, active: empty && d == 0 ? true : false})
            })
            saveData('resourceList', newList)
            return {...state, resourceList: newList, activeImage: newList.find(i => i.active) || {} }
        // 设置选中的图片
        case ACTIVE_IMAGE: 
            return {...state, activeImage: {...action.img}}
        // 更新图片列表，上移，下移，删除操作，同时更新图片的选中状态
        case UPDATE_IMAGE_LIST: 
            let newImageList = state.resourceList
            // 更新选中状态
            if(action._type === 'update'){
                newImageList = newImageList.map((i, d) => ({...i, active: d == action.index}))
                saveData('resourceList', newImageList)
                return {...state, resourceList: [...newImageList]}
            // 上移
            }else if(action._type === 'up'){
                // 除了sort外更换全部属性（sort用于后端返回的排序顺序）
                let sort1 = newImageList[action.index - 1].sort
                let sort2 = newImageList[action.index].sort
                newImageList[action.index] =  newImageList.splice(action.index - 1, 1, newImageList[action.index])[0]
                newImageList[action.index - 1].sort = sort1
                newImageList[action.index].sort = sort2
                saveData('resourceList', newImageList)
                return {...state, resourceList: [...newImageList]}
            // 下移
            }else if (action._type === 'down'){
                // 除了sort外更换全部属性（sort用于后端返回的排序顺序）
                let sort1 = newImageList[action.index].sort
                let sort2 = newImageList[action.index + 1].sort
                newImageList[action.index + 1] =  newImageList.splice(action.index, 1, newImageList[action.index + 1])[0]
                newImageList[action.index].sort = sort1
                newImageList[action.index + 1].sort = sort2
                saveData('resourceList', newImageList)
                return {...state, resourceList: [...newImageList]}
            // 删除
            }else if (action._type === 'delete'){
                // 重新计算总秒数，并删除当前图片下的录音
                let totalSecond = state.totalSecond
                let activeUrl = state.activeImage.id
                let audioList = state.audioList
                let textContent = state.textContent
                let currentAudioList = audioList[activeUrl]
                let currentText = textContent[activeUrl]
                // 更新秒数，删除语音
                if(totalSecond > 0 && Array.isArray(currentAudioList) &&  currentAudioList.length > 0){
                    currentAudioList.forEach(i => {
                        totalSecond -= i.duration
                    })
                    delete audioList[activeUrl]
                }
                // 删掉文本
                if(currentText && currentText.content){
                    delete textContent[activeUrl]
                }
                newImageList.splice(action.index, 1)
                let newLength = newImageList.length
                let newActiveImage = {}
                if(newLength == 1) {
                    newActiveImage = {...newImageList[0], active: true}
                    newImageList[0].active = true
                }else if(newLength > 1){
                    // 如果删除的是列表第一个，就拿新列表中的第一个作为已选择的项，否则都拿删除项的上一项作为已选择项
                    if(action.index < 1){
                        newActiveImage = {...newImageList[0], active: true}
                        newImageList[0].active = true
                    }else {
                        newActiveImage = {...newImageList[action.index - 1], active: true}
                        newImageList[action.index - 1].active = true
                    }
                }
                saveData({'resourceList': newImageList, 'audioList': audioList, 'totalSecond': totalSecond, 'textContent': textContent})
                return {...state, resourceList: newImageList, activeImage: newActiveImage, audioList: {...audioList}, totalSecond, textContent: {...textContent}}
            }
        // 增加录音
        case ADD_AUDIO: {
            // 初始化
            if(action.init){
                return {...state, audioList: {...action.audioObj}}
            }
            let activeUrl = state.activeImage.id
            let audioList = state.audioList
            if(audioList[activeUrl]){
                let current = [...audioList[activeUrl]]
                let sort = 1
                if(Array.isArray(current) && current.length > 0){
                    sort = current[current.length - 1].sort + 1
                }
                current.push({...action.audioObj, sort})
                audioList[activeUrl] = current
            }else {
                audioList[activeUrl] = [action.audioObj]
            }
            saveData('audioList', audioList)
            return {...state, audioList: {...audioList}}
        }
        // 删除单个录音
        case DELETE_AUDIO: {
            // 录音列表key值为当前选中的图片的id，value为语音数组
            let activeUrl = state.activeImage.id
            let audioList = state.audioList
            let current = [...audioList[activeUrl]]
            // 重新计算总秒数
            let totalSecond = state.totalSecond
            totalSecond -= current[action.index].duration
            // 当前图片上的录音为一条时，删除整个键值对，大于一条时，就删除当前录音
            if(current.length > 1){
                current.splice(action.index, 1)
                audioList[activeUrl] = current
            }else if (current.length == 1){
                delete audioList[activeUrl]
            }
            saveData({'audioList': audioList,'totalSecond':totalSecond})
            return {...state, audioList: {...audioList}, totalSecond}
        }
        // 移动单个录音
        case MOVE_AUDIO: {
            // 录音列表key值为当前选中的图片的id，value为语音数组
            let activeUrl = state.activeImage.id
            let audioList = state.audioList
            let current = [...audioList[activeUrl]]
            // 上移
            if(action.move === 'up'){
                let sort1 = current[action.index - 1].sort
                let sort2 = current[action.index].sort
                current[action.index] =  current.splice(action.index - 1, 1, current[action.index])[0]
                current[action.index - 1].sort = sort1
                current[action.index].sort = sort2
            // 下移
            }else if (action.move === 'down'){
                let sort1 = current[action.index].sort
                let sort2 = current[action.index + 1].sort
                current[action.index + 1] =  current.splice(action.index, 1, current[action.index + 1])[0]
                current[action.index].sort = sort1
                current[action.index + 1].sort = sort2
            }
            audioList[activeUrl] = current
            saveData('audioList', audioList)
            return {...state, audioList: {...audioList}}
        }
        // 计算总秒数
        case TOTAL_SECOND: {
            if(action.init){
                return {...state, totalSecond: Number(action.second)}
            }
            let totalSecond = state.totalSecond + Number(action.second)
            saveData('totalSecond', totalSecond)
            return {...state, totalSecond}
        }
        // 增加文字描述
        case ADD_TEXT_CONTENT: {
            if(action.init){
                return {...state, textContent: {...action.text}}
            }
            // 录音列表key值为当前选中的图片的id，value为文字描述
            let activeUrl = state.activeImage.id
            let textContent = state.textContent
            textContent[activeUrl] = action.text
            saveData('textContent', textContent)
            return {...state, textContent: {...textContent}}
        }
        case INIT_DATA: {
            saveData('initData', action.data)
            return {...state, initData: {...action.data}}
        }
        default:
            return state
    }
}
