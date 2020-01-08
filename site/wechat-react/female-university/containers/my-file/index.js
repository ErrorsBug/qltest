import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import FileInfo from './components/file-info';
import CardHoc from '../../components/card-hoc';
import EditFile from './components/edit-file';
import { share } from 'components/wx-utils';
import { fillParams, getUrlParams } from 'components/url-utils';
import { getCookie } from 'components/util'
import { getStudentInfo } from '../../actions/home'
import NoticeCard from '../../components/notice-card'
import PortalCom from '../../components/portal-com';
import { handleFileCard } from './components/file-card'
import { clearData } from './components/file-card/card'
import PressHoc from 'components/press-hoc';
import AppEventHoc from '../../components/app-event'
import QRCode from 'qrcode'
import { uploadImage } from 'common_actions/common';

@AppEventHoc
@CardHoc()
@autobind
class MyFile extends Component {
    state = {
        isShowEdit: false,
        user: {},
        isShow: false,
        fileUrl: '',
        isShowCard: false,
        isNew: false,
        isOnceClick: false
    }
    isOnce = false
    get studentId() {
        return getUrlParams('studentId', '')
    }
    get editHobby() {
        const editHobby = getUrlParams('editHobby', '')
        return Object.is(editHobby, 'Y')
    }
    get showEdit() {
        const showEdit = getUrlParams('showEdit', '')
        return Object.is(showEdit, 'Y')
    }
    async componentDidMount() {
        await this.initUserInfo();
        if(this.editHobby||this.showEdit) {
            this.setState({
                isShowEdit: true
            })
        }
        this.initShare();
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('my-file-box');
    }
    closeForm() {
        this.setState({
            isShowEdit: false,
            isOnceClick: true
        })
    }
    async shouldComponentUpdate({ userInfo, url }, nextState, nextContext) {
        if(userInfo && userInfo.userId){
            this.initShare();
        }
        return true
    }
    // 初始化画卡
    async initCard(userInfo, bgUrl){
        const { url } = this.props;
        window.loading(true)
        let hei = this.box.getFileBox() || 0 
        const qrUrl = await this.getQr(userInfo.shareType);
        const area = userInfo.address && userInfo.address.split('&')[0] || ''
        const flag = !!userInfo.say || !!userInfo.hobby || !!userInfo.bio || !!userInfo.address || !!userInfo.remark || !!userInfo.coolThing;
        const html = document.getElementsByTagName('html')[0]
        const dpr = html.getAttribute('data-dpr')
        if(flag){
            if(dpr === "1"){
                hei = hei * 2.8; 
            }
            if(dpr === "2"){
                hei = hei + 400; 
            }
            if(dpr === "3"){
                hei = hei; 
            }
        }
        const params = {
            headBg: 'https://img.qlchat.com/qlLive/business/Q8BM6RNB-LXJW-PBX5-1561012099478-EQ74LN4VR3B9.png',
            cardBg: url || bgUrl,
            areaTitle: "地区",
            area: area.replace(',','·') || null,
            mineTitle: "职业",
            mineArr: userInfo.bio && userInfo.bio.split('\n') || null,
            hobbyTitle: "擅长",
            hobbyArr: userInfo.hobby && userInfo.hobby.split('\n') || null,
            sayTitle: "想对你们说",
            sayArr: userInfo.say && userInfo.say.split('\n') || null,
            remarkTitle: "其他",
            remarkArr: userInfo.remark && userInfo.remark.split('\n') || null,
            coolThingTitle: "最酷的事",
            coolThingArr: userInfo.coolThing && userInfo.coolThing.split('\n') || null,
            qrBg: 'https://img.qlchat.com/qlLive/business/JZPDPU6W-U6QK-5E88-1561014205459-7Q1CAYT2T7WT.png',
            qrUrl: qrUrl,
            isInfo: flag,
            hei: hei 
        }
        try {
            const url = await handleFileCard(params);
            this.props.getCardUrl(url);
            this.setState({
                fileUrl: url
            })
        } catch (error) {
        }
        window.loading(false)
    }

    // 生成二维码
    async getQr (type){ 
        let neUrl = ''
        if(type && !Object.is(type, 'LEVEL_F')){
            neUrl = `https://ql.kxz100.com/wechat/page/join-university?userId=${getCookie("userId")}&couponType=share`
        } else {
            neUrl = `https://ql.kxz100.com/wechat/page/join-university`
        }
        const res = QRCode.toDataURL(neUrl, {
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff" 
            })
            .then(url => {
                return url
            })
            .catch(err => {
                console.error(err)
            })     
        return res
    }
    async initUserInfo(){ 
        const res = await getStudentInfo()
        this.setState({
            user: res.studentInfo || {}
        })
    }
    initShare() {
        const { user } = this.state;
        const { userInfo, shareConfig } = this.props;
        let title = '给你看看我的档案';
        let desc = '知道你会对我感兴趣的。';
        let params = {
            wcl:'university_share'
        } 
        if(!!user?.userId){
            params.studentId = user?.userId
        } else {
            params.studentId = this.studentId
        }
        let shareUrl = fillParams(params,location.href)
        // h5分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: (user && user.headImgUrl) || userInfo.headImgUrl,
            shareUrl: shareUrl
        });

        // app分享
        shareConfig({
            content: shareUrl,
            title: title,
            desc: desc,
            thumbImage: (user && user.headImgUrl) || userInfo.headImgUrl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        })
    }
    // 显示编辑
    handleShowEdit() {
        this.setState({
            isShowEdit: true
        })
    }
    // 显示录取通知书
    showNotice() {
        this.setState({
            isShow: true
        }, () => {
            this.initShowApp();
        })
    }

    initShowApp(flag){
        const { isQlchat, onPress } = this.props;
        if(isQlchat){
            onPress && onPress(flag)
        }
    }
    // 显示画卡
    showFileCard() {
        this.setState({
            isShowCard: !this.state.isShowCard
        }, () => {
            this.initShowApp(this.state.isShowCard);
            if(this.state.isShowCard){
                clearData();
                const { userInfo } = this.props;
                this.initCard(userInfo);
            }
        })
    }
    close() {
        this.props.onPress && this.props.onPress(false);
        this.setState({
            isShow: false
        })
    }
    async updateUserInfo(userInfo) {
        clearData();
        await this.props.updateUserInfo(userInfo)
    }
    render(){
        const { url, userInfo, onPress, isQlchat } = this.props;
        const { isShowEdit, isShow, fileUrl, isShowCard, isOnceClick } = this.state;
        const flag = (getCookie('userId') == userInfo.userId)
        return (
            <Page title={ `${ flag ? '我的' : (userInfo.userName||'') }档案` } className="my-file-box">
                <FileInfo 
                    ref={ r => this.box = r }
                    { ...userInfo }
                    url={ url } 
                    isSelf={ flag }
                    isHide={isShowCard && !!fileUrl}
                    showNotice={ this.showNotice }
                    showFileCard={ this.showFileCard }
                    handleShowEdit={ this.handleShowEdit }/>
                { (isShowEdit) && (
                    <EditFile 
                        uploadImage={this.props.uploadImage}
                        editHobby={ this.editHobby && !isOnceClick }
                        showEdit={ this.showEdit }
                        focus={ this.focus }
                        updateUserInfo={ this.updateUserInfo }
                        { ...userInfo }
                        closeForm={ this.closeForm } />
                ) }
                <NoticeCard 
                    isQlchat={ isQlchat }
                    getCardUrl={ this.props.getCardUrl }
                    isShow={ isShow  }
                    close={ this.close }/>
                { isShowCard && fileUrl && (
                    <Fragment>
                        <PortalCom className={ `my-card-box ${ isQlchat ? 'pdBtm' : '' }` }>
                            <div onClick={ () => { onPress && onPress(false) } }>
                                <PressHoc onPress={ onPress } className="my-card-show" region="un-file-card">
                                    <p onClick={ this.showFileCard }>
                                        <img src={ fileUrl } />
                                    </p>
                                </PressHoc>
                            </div>
                        </PortalCom>
                        <div className="my-card-close" onClick={ this.showFileCard }>
                            <span></span>
                        </div>
                        <div className="my-yin-box">
                            <p>长按图片保存，分享给好友</p>
                        </div>
                    </Fragment>
                ) }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    user: ''
});

const mapActionToProps = {
    uploadImage
};

module.exports = connect(mapStateToProps, mapActionToProps)(MyFile);