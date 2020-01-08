import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';  
import Cover from './components/cover'
import Book from './components/book'
import AdCom from './components/ad-com'
import { getUrlParams } from 'components/url-utils';
import { getCookie } from 'components/util'
import ShareNotesImg from '../../components/share-notes-img'
import { share } from 'components/wx-utils';
import { getStudentInfo } from '../../actions/home'; 
import { fillParams } from 'components/url-utils';
import AppEventHoc from '../../components/app-event'
import Masking from './components/masking'
import { getNoteCoverInfo, getNoteDirectory, getNoteSubjectList, getTargetStatus, 
    getNoteCoverInfoByPeriodId, getPaperInfo } from '../../actions/camp'
import { getCommonAd } from '../../actions/common'
import $ from 'jquery'
global.jQuery = global.$ = $;
require('./turn')

const shareList = [
    {
        title: '在吗？我认真写了一些学习笔记，想分享给你看看！',
        decs: '一般人儿我不分享给ta'
    },
    {
        title: '嘘！这是我的学习笔记本，一般人儿我不分享给ta~',
        decs: '点击马上查看'
    },
    {
        title: '这是我的笔记本，点击可以看看记录了什么内容哦~',
        decs: '我知道你会感兴趣的'
    }
]

@AppEventHoc
@autobind
class EBook extends Component { 
    state = {
        coverInfo: {},
        dirList: [],
        turnList: [],
        userInfo: {},
        shareInfo: {},
        isShare: false,
        isCover: true,
        isSelf: true,
        adObj: null,
        isMask: false,
        isLoading: true,
    }
    get shareUserId(){
        return getUrlParams('shareUserId', '')
    }
    pages = []
    componentDidMount() {
        this.initStore()
        this.initShare()
        this.getStudentInfo();
        this.getNoteCoverInfo();
        this.getNoteDirectory();
        setTimeout(() => {
            window.loading && window.loading(true)
        },10)
    }
    // 获取缓存
    initStore(){
        const status = localStorage.getItem('eb_mask')
        if(!Object.is(status, 'Y')){
            this.setState({
                isMask: true
            })
        }
    }
    // 获取体验营广告位
    async getCommonAd() {
        const res = await getCommonAd({nodeCode: 'QL_AD_EBOOK_AD', type: 'ufw'})
        if(!!res && Object.is(res.keyI, 'Y')){
            this.setState({
                adObj: res
            })
        }
    }
    // 获取用户信息
    getStudentInfo = async () => {
        const userId = getCookie("userId");
        const { studentInfo } = await getStudentInfo({ studentId: this.shareUserId });
        const isSelf = (!this.shareUserId || userId == this.shareUserId)
        if(!isSelf) {
            this.getCommonAd();
        }
        this.setState({
            userInfo: studentInfo || {},
            isSelf: isSelf
        })
    }
    // 获取蜕变笔记封面信息
    async getNoteCoverInfo() {
        const res = await getNoteCoverInfo({ currentUserId: this.shareUserId })
        this.setState({
            coverInfo: res
        })
    }
    // 获取蜕变笔记目录
    async getNoteDirectory() {
        const { dataList } = await getNoteDirectory({ currentUserId: this.shareUserId })
        if(!!dataList && dataList.length) {
            // 此处可以使用es8 for await (let i of array) 
            const list = await this.handleDir(dataList, 0)
            this.setState({
                dirList: list || [],
                turnList: this.pages
            })
        }
        this.setState({
            isLoading: false
        })
        window.loading(false)
    }
    // 递归蜕变目录数据
    async handleDir(list, idx) {
        if(list[idx]){
            const periodId = list[idx].periodId
            const params = {
                periodId,
                currentUserId: this.shareUserId
            }
            let { subjects } = await getNoteSubjectList({ ...params, size: 40, page: 1 }) || {} // 获取学习营下的打卡笔记
            const res = await getTargetStatus(params) // 目标
            const note = await getNoteCoverInfoByPeriodId(params) || {} // 笔记数量
            const paper = await getPaperInfo(params) // 获取论文 
            if(res) {
                const targetObj = {
                    title: '我的小目标',
                    targetTxt: res.target,
                    type: 'target',
                    periodId: periodId,
                    campId: list[idx].campId,
                    campName: list[idx].title
                }
                subjects.unshift(targetObj)
            }
            if(paper && Object.is(paper.writeStatus, 'Y')) {
                const paperObj = {
                    title: '毕业论文',
                    type: 'paper',
                    periodId: periodId,
                    campId: list[idx].campId,
                    campName: list[idx].title,
                    ...paper,
                }
                subjects.push(paperObj)
            }
            list[idx] = { ...list[idx], ...note }
            list[idx].subjects = subjects || []
            if(list[idx - 1]) {
                list[idx].len = list[idx - 1].subjects.length + 1
            } else {
                list[idx].len = 0
            }
            const campInfo = list[idx]
            this.pages = [...this.pages, campInfo, ...subjects]
            return this.handleDir(list, idx + 1)
        } else {
            return list
        }
    }
    // 今日笔记以及毕业论文分享
    onShareImg(shareInfo) {
        this.setState({
            shareInfo: shareInfo,
            isShare: true
        })
    }
    // 隐藏封面
    goTurn(e) {
        e && e.stopPropagation();
        e && e.preventDefault();
        this.setState({
            isCover: false
        })
    }
    // 隐藏分享
    onCloseShare() {
        this.setState({
            shareInfo: {},
            isShare: false
        })
    }
    // 分享
    initShare() {
        const idx = Math.floor(Math.random() * shareList.length);
        const shareObj = shareList[idx]
        const userId = getCookie("userId");
        let title = shareObj.title;
        let desc = shareObj.decs; 
        const curUserId = !!this.shareUserId ? this.shareUserId : userId
        let shareUrl = fillParams({ shareUserId: curUserId, shareKey: curUserId }, location.href) 
        let imgUrl = 'https://img.qlchat.com/qlLive/activity/image/APS9VU8Q-UI52-3BX5-1578120642222-8K7PYPO9MDD2.png'
        // h5分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });
    }
    // 隐藏引导
    hideMask() {
        localStorage.setItem("eb_mask", "Y")
        this.setState({
            isMask: false
        })
    }
    render(){
        const { coverInfo, dirList, turnList, userInfo, isShare, shareInfo, isCover, isSelf, adObj, isMask, isLoading } = this.state;
        const { isQlchat } = this.props
        return (
            <Page title={ `${ isSelf ? '我' : userInfo.userName }的蜕变笔记` } className="eb-ebook-box">
                { !isSelf && !!adObj && <AdCom {...adObj} shareUserId={this.shareUserId } /> }
                { isCover && <Cover goTurn={ this.goTurn } userName={ userInfo.userName || '' } isSelf={ isSelf } {...coverInfo} /> }
                { !isCover && isMask && <Masking hideMask={ this.hideMask } /> }
                { !isCover && !isLoading && (
                    <Book 
                        isQlchat={ isQlchat }
                        dirList={ dirList } 
                        turnList={ turnList } 
                        isSelf={ isSelf }
                        userInfo={ userInfo } 
                        onShareImg={ this.onShareImg } />
                ) }
                { isShare && <ShareNotesImg shareInfo={ shareInfo } onCloseShare={ this.onCloseShare } /> }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
 
};

module.exports = connect(mapStateToProps, mapActionToProps)(EBook);