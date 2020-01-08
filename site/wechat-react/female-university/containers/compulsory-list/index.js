import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import HeadImg from '../../components/head-img';
import CourseItem from '../../components/course-item';
import JoinDialog from '../../components/join-dialog';
import JoinHoc from '../../components/join-dialog/join-hoc';
import Footer from '../../components/footer';
import CourseStatusHoc from '../../components/course-status-hoc';
import { fillParams } from 'components/url-utils';
import { share } from 'components/wx-utils';
import { getCookie } from 'components/util';
import UserHoc from '../../components/user-hoc'
import UniversityHome from 'components/operate-menu/home'
import { createPortal } from 'react-dom'
import AppEventHoc from '../../components/app-event'

@AppEventHoc
@UserHoc
@JoinHoc
@CourseStatusHoc({
    nodeCode:"QL_NZDX_SY_BX",
    isChildren: true
})
@autobind
class CompulsoryList extends Component {
    componentDidMount() { 
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('cp-scroll-box');
    }
    initShare() {
        const { shareParams, shareConfig } = this.props;
        let title = '千聊女子大学必修课单';
        let desc = '校长倾力推荐，击破这些就够了';
        let shareUrl = fillParams({...shareParams , wcl:'university_share'}, location.href,['couponCode'])
        let imgUrl = 'https://img.qlchat.com/qlLive/business/IYQKXP1C-Z929-GD2D-1559616151929-BNFX5JNA57UA.png'
        // h5分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });
        // app分享
        shareConfig({
            content: shareUrl,
            title: title,
            desc: desc,
            thumbImage: imgUrl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        })
    }
    render(){
        this.initShare();
        const { isShowDialog, close, joinPlan, isNoMore, loadNext, compulsoryObj, isQlchat, ...otherProps } = this.props;
        return (
            <Page title="大学必修课" className={`cp-list-box ${isShowDialog?'pointer-events-none':''}`}>
                <ScrollToLoad
                    className={"cp-scroll-box"}
                    toBottomHeight={300}
                    disable={ isNoMore }
                    loadNext={ loadNext }
                    >
                    <HeadImg url={ require('./img/mastercourse_bg_top.png') } />
                    <div className="cp-list-cont">
                        {  !!compulsoryObj.lists && compulsoryObj.lists.map((item, index) => (
                            <CourseItem
                                key={ index } 
                                idx={index}
                                { ...item } 
                                { ...otherProps } />
                        )) }
                    </div>
                    { isNoMore && <Footer /> }
                </ScrollToLoad>
                { !isQlchat && <UniversityHome isUnHome /> }
                {
                    createPortal(
                        <JoinDialog 
                            isShowDialog={ isShowDialog } 
                            close={ close } 
                            joinPlan={joinPlan} />,
                            document.getElementById('app')
                        ) 
                }

            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    user: ''
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(CompulsoryList);