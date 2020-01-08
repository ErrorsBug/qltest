
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind , throttle} from 'core-decorators';
import Page from 'components/page';
import ImgList from './components/img-list';
import { request } from 'common_actions/common'
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';
import { getUrlParams } from 'components/url-utils';
import { getCookie } from 'components/util'; 
import WCLHoc from './components/wcl-hoc'
import { userBindKaiFang, getSysTime } from "../../../actions/common";
import PortalCom from '../../components/portal-com';
import DialogPayment from '../../components/dialog-payment';
import { getWithChildren } from '../../actions/home';
import { isQlchat } from 'components/envi'
import { locationTo } from 'components/util';
import CourseIcon from '../../components/course-icon'  

@WCLHoc
@autobind
class CollegesIntro extends Component {
    state = {
        dataList: [],
        isBuy: false,
        showBottom: false,
        isLoading: false,
        btnImg: '',
        btnBg: '',
        btnTxt: '',
        menuNode: {},
        scrolling:false
    }
    get nodeCode(){
        return getUrlParams('nodeCode', '')
    }
    get ch(){
        return getUrlParams('ch', '')
    }
    async componentDidMount() {
        localStorage.removeItem('isShowAppHome')
        await this.initData();
        this.getStudentInfo();
        this.initShare();
        this.bindAppKaiFang();
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }
    /**
     * 初始化获取学院介绍
     * @memberof CollegesIntro
     */
    async initData() {
        if(!this.nodeCode) return false;
        const { menuNode } = await getWithChildren({ nodeCode: this.nodeCode });
        this.setState({
            dataList: menuNode?.children || [],
            btnTxt: menuNode?.keyD || "",
            btnBg: menuNode?.keyE || "",
            btnImg: menuNode?.keyF || "",
            menuNode: menuNode || {}
        })
    }

    async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId');
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }
    }
    // 获取购买信息
    async getStudentInfo() {
        const { data } =  await this.props.getSysTime();
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getStudentInfo',
            method: 'POST',
            body: {}
        }).then(res => {
            let isBuy = ( !!data && !!res.data && !!res.data.studentInfo && data.sysTime < res.data.studentInfo.expireTime);
            this.setState({
                isBuy: isBuy,
                isLoading: true
            })
		}).catch(err => {
			console.log(err);
		})
    }
    
    initShare() {
        const { menuNode } = this.state;
        let title = menuNode.keyA;
        let desc = menuNode.keyB;
        let shareUrl = fillParams({ userId: getCookie("userId"), wcl:'university_share'},location.href,['couponCode'])
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: menuNode.keyC,
            shareUrl: shareUrl
        });
    }
    updateCharge() {
    }

    goAppPage() {
        locationTo(`${ location.origin }/wechat/page/join-university`)
    }
    goPage() {
        const { menuNode } = this.state;
        locationTo(menuNode.keyG);
    }
    
    @throttle(300)
    onScrollHandle() {
        this.setState({
            scrolling: true,
          });
        this.timer&&clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
            this.setState({
                scrolling: false,
            });
        }, 300) 
    }
    render(){
        const { isBuy, isLoading, btnImg, dataList, btnBg, btnTxt, menuNode } = this.state;
        const isApp = isQlchat()
        return (
            <Page title={ menuNode.title } className="join-university-page">
                <section className={ `scroll-content-container ${ this.state.showBottom ? '' : 'minBtm' }` }  onScroll={this.onScrollHandle}>
                    <ImgList
                        ch={ this.ch }
                        imgList={ dataList }
                    />
                </section>
                { isLoading && !isBuy && !isApp && (
                    <PortalCom className="cl-pay-btn">
                        <DialogPayment isCollege={ true } updateCharge={this.updateCharge}>
                            <span style={{ background: btnBg || '#3C2222' }}> { btnTxt || '立即购买' } </span>
                        </DialogPayment>
                    </PortalCom>
                ) }
                { !isApp &&btnImg && <CourseIcon scrolling = { this.state.scrolling } showBottom={true}  initClick={ this.goPage } src={ btnImg }/> }
                { isApp && (
                    <PortalCom className="join-university-app">
                        <div className="join-university-link on-log on-visible"
                            data-log-name="app返回"
                            data-log-region="un-app-back"
                            data-log-pos="0" onClick={ this.goAppPage }>
                        </div>
                    </PortalCom>
                ) }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    userBindKaiFang,
    getSysTime
};

module.exports = connect(mapStateToProps, mapActionToProps)(CollegesIntro);