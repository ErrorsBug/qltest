import { imgUrlFormat } from "components/util";
import { share } from "components/wx-utils";



const knowledgeShareDescs = [
    '超有料的小视频，你来看看？',
    '别忍了，快看看',
    '我不信你能忍住不看！',
    '这个小视频有点意思',
    '我就说你会看的',
    '涨知识',
    '有才',
    '666，给老师送小红花',
]


function randomKnowledgeShareDesc() {
    return knowledgeShareDescs[Math.floor(Math.random() * 8)]
}


const water = "cWxMaXZlL3Nob3J0L3ZpZGVvLXdhdGVyLnBuZw=="; // 短知识的分享图片水印


export function initShareKnowledge(data, options) {
    const shareOptions = {
        title: '小视频：' + data.name,
        desc: data.introduction || randomKnowledgeShareDesc(),
        imgUrl: imgUrlFormat(data.coverImage, `?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200`),
        shareUrl: `${location.origin}/wechat/page/short-knowledge/video-show?knowledgeId=${data.id}&liveId=${data.liveId}`,
        ...options,
    };
    share(shareOptions);
}