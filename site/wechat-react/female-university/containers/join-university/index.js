import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind , throttle} from 'core-decorators';
import Page from 'components/page';
import ImgList from './components/img-list';
import BottomBar from './components/bottom-bar';
import Barrage from './components/barrage';
import { request } from 'common_actions/common'
import { getVal, locationTo } from 'components/util';
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';
import TabBar from 'components/tabbar';
import { getUrlParams } from 'components/url-utils';
import { getCookie } from 'components/util'; 
import WCLHoc from './components/wcl-hoc'
import { userBindKaiFang } from "../../../actions/common";
import AppEventHoc from '../../components/app-event'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import CourseIcon from '../../components/course-icon'  
import classnames from 'classnames'
import { getMenuNode } from '../../actions/home';
import './style.scss'

@AppEventHoc
@HandleAppFunHoc
@WCLHoc
@autobind
class JoinUniversity extends Component {
    state = {
        dataList: [],
        adviceData:{},
        isBuy: false,
        showBottom: false,
    }
    imgIdx = 0;
    arr = []
    get isTab(){
        return getUrlParams('isTab', '')
    }
    get ch(){
        return getUrlParams('ch', '')
    }
    
    get isWithIcon(){
        return getUrlParams('with_icon', '')
    }
    
    async componentDidMount() {
        localStorage.removeItem('isShowAppHome')
        await this.initDate();
        await this.initAdvice();
        await this.getStudentInfo();
        this.initShare();
        this.bindAppKaiFang();
        (this.isTab||this.isWithIcon)&&this.getIcon() 
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }

     


    //获取免费体验图标
    async getIcon(){ 
        const { menuNode=false } = await getMenuNode({nodeCode:"QL_NZDX_DG_ICON_01"}) 
        this.setState({
            ExperienceCampIcon:menuNode
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
    // 获取导购图列表
    async initDate() {
        await request({
            url: '/api/wechat/transfer/baseApi/h5/menu/node/listChildren',
            method: 'POST',
            body: {
                nodeCode: 'QL_NZDX_DG_IMGS',
                page:{
                    size: 9999,
                    page:1
                }
            }
        }).then(res => {
            let dataList = getVal(res, 'data.dataList', []);
            if (dataList.length) {
                this.setState({
                    dataList: dataList
                })
            }
		}).catch(err => {
			console.log(err);
		})
    }

    // 获取咨询图片
    async initAdvice() {
        await request({
            url: '/api/wechat/transfer/baseApi/h5/menu/node/get',
            method: 'POST',
            body: {
                nodeCode: 'QL_NZDX_DG_ZX',
                page:{
                    size: 20,
                    page:1
                }
            }
        }).then(res => {
            let adviceData = getVal(res, 'data.menuNode', {});
            this.setState({
                adviceData
            })
            
		}).catch(err => {
			console.log(err);
		})
    }


    // 获取购买信息
    async getStudentInfo() {
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/getStudentInfo',
            method: 'POST',
            body: {}
        }).then(res => {
            let isBuy = getVal(res, 'data.studentInfo.classNo', false);
            this.setState({
                isBuy
            })
		}).catch(err => {
			console.log(err);
		})
    }

    initShare() {
        let title = '千聊女子大学';
        let desc = '女性无需全能，但有无限可能。加入女子大学，追寻有能量的人，发现自己的能量。';
        let shareUrl = fillParams({isTab: "N", userId: getCookie("userId"),wcl:'university_share'},location.href,['couponCode'])
        // h5分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/nzdx.png',
            shareUrl: shareUrl
        });
        // app 分享
        this.props.shareConfig({
			content: shareUrl,
			title: title,
			desc: desc,
			thumbImage:'https://img.qlchat.com/qlLive/liveCommon/nzdx.png',
			success: (res) => {
				console.log('分享成功！res:', res);
			}
		});
    }

    @throttle(300)
    onScrollHandle() {
        const { isQlchat } = this.props;
        if(!isQlchat){
            this.setState({
                scrolling: true,
            });
            this.timer&&clearTimeout(this.timer)
            this.timer=setTimeout(()=>{
                this.setState({
                    scrolling: false,
                });
            }, 300)

            if (this.state.showBottom) {
                return
            }
            this.setState({
                showBottom:true,
            })
        }
    }
    render(){
        const { isQlchat } = this.props;
        const { ExperienceCampIcon } = this.state
        const cls = classnames("scroll-content-container", {
            "minBtm" : !this.state.showBottom || isQlchat,
            "cenBtm": Object.is(this.isTab, 'Y'),
            "maxBtm":  Object.is(this.isTab, 'Y') && this.state.showBottom
        })
        return (
            <Page title="千聊女子大学" className="join-university-page">
                <section className={ cls } onScroll={this.onScrollHandle}>
                    <ImgList
                        ch={ this.ch }
                        imgList={this.state.dataList}
                    />
                </section>
                <Barrage isQlchat={ isQlchat } />
                { !isQlchat && (
                    <Fragment>
                        <BottomBar
                            isTab={ Object.is(this.isTab, 'Y') }
                            isWithIcon={ this.isWithIcon }
                            ExperienceCampIcon={ExperienceCampIcon}
                            show={this.state.showBottom}
                            adviceData={this.state.adviceData}
                        />    
                        { Object.is(this.isTab, 'Y') && (
                            <TabBar  
                                activeTab='university'
                                isMineNew={false}
                                isMineNewSession={"N"} />
                        ) }  
                        <CourseIcon scrolling = { this.state.scrolling } isTab={ Object.is(this.isTab, 'Y') } showBottom={this.state.showBottom}/>
                    </Fragment>
                ) }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    userBindKaiFang

};

module.exports = connect(mapStateToProps, mapActionToProps)(JoinUniversity);