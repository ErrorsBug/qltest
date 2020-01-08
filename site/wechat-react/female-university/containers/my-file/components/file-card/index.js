import { initCard } from './card'

export const handleFileCard = (param) => {
    const bg = 'https://img.qlchat.com/qlLive/business/QNYSIHVE-Z6C8-PLU1-1561112748739-VQLJIM5E1M4N.png'
    return new Promise((resolve, reject) => {
        initCard(bg, param, (url) => {
            resolve(url)
        }, 1125, 1880 + param.hei)
    })
}