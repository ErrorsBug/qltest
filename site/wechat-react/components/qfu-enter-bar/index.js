import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { request } from 'common_actions/common'
import { createPortal } from 'react-dom';
import { locationTo ,getVal,getCookie} from 'components/util';
import Lottie from 'lottie-react-web' 

class QfuEnterBar extends Component {
    state = {
        authStatus:false,
        imgNode: {},
        aOrb:true,
		activeTagArr: [
			{
				key:'everyday',
				val:'QL_NZDX_DLRK_WDKC_01',
			},
			{
				key:'recent',
				val:'QL_NZDX_DLRK_WDKC_02',
			},
			{
				key:'purchased',
				val:'QL_NZDX_DLRK_WDKC_03',
            },
            {
				key:'ufwCamp',
				val:'QL_NZDX_DLRK_WDKC_04',
			},
			{
				key:'books',
				val:'QL_NZDX_DLRK_WDKC_05',
			},
			{
				key:'footPrint',
				val:'QL_NZDX_DLRK_WDZJ_01',
			},
        ],
        portalBody:null,
        qfuBottom:null,
        menuNode: []
	};

	data = {

	};

    componentDidMount() {
        this.initAB();
        this.getUniversityStatus();
        this.getQfuSettings();
        this.update();
        this.initData();
    }
    initData(){
        const authStatus = localStorage.getItem('uniAuthStatus')
        if(authStatus) {
            const newCourseNum = sessionStorage.getItem("newCourseNum");
            let portalBody = document.querySelector(".empty-portal");
            let qfuBottom = document.querySelector(".qfu-enter-bottom");
            const imgNode = localStorage.getItem('uniImgNode')
            this.setState({
                isShow: true,
                imgNode: imgNode,
                authStatus: Object.is(authStatus, 'Y'),
                portalBody,
                newCourseNum: Number(newCourseNum),
                qfuBottom
            })
        }
    }

    componentDidUpdate(preProps,preState ) {
        if (preProps.activeTag && this.props.activeTag && preProps.activeTag !== this.props.activeTag) {
            this.update();
            this.initData();
        }
    }

    update() {
        this.setState({
            isShow:false,
        })
        setTimeout(() => {
            console.log(this.state.menuNod, 'activeTag')
            let portalBody = document.querySelector(".empty-portal");
            let qfuBottom = document.querySelector(".qfu-enter-bottom");
            let activeTag = this.state.activeTagArr.find(item => item.key === this.props.activeTag);
            let imgNode = this.state.menuNode.find(item => item.nodeCode === activeTag.val);
            localStorage.setItem('uniImgNode', JSON.stringify(imgNode))
            this.setState({
                isShow: true,
                imgNode,
                portalBody,
                qfuBottom
            })
        }, 1200);
    }
    
    
    /**
     * 获取女子大学导流入口
     *
     * @memberof MineCourse
     */
    async getQfuSettings() {
        await request({
            url: '/api/wechat/transfer/baseApi/h5/menu/node/getWithChildren',
            method: 'POST',
            body: {
                nodeCode: 'QL_NZDX_DLRK',
                page:{
                    size: 20,
                    page:1
                }
            }
        }).then(res => {
            let menuNode = getVal(res, 'data.menuNode.children', []);
            
            this.setState({
                menuNode: menuNode || [],
            })
            
		}).catch(err => {
			console.log(err);
		})
    }

     /**
     * 获取是否购买了女子大学
     *
     * @memberof MineCourse
     */
    async getUniversityStatus() {
        await request({
            url: '/api/wechat/transfer/h5/university/universityStatus',
            method: 'POST',
            body: {
                courseId:''
            }
        }).then(res => {
            let authStatus = res?.data?.authStatus;
            const flag = authStatus === 'Y'
            if(flag) {
                this.getStaticInfo();
            }
            localStorage.setItem('uniAuthStatus', authStatus)
            this.setState({ authStatus:flag })
		}).catch(err => {
			console.log(err);
		})
    }

    /**
     * 30天课程数
     *
     * @memberof MineCourse
     */
    async getStaticInfo() {
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/staticInfo',
            method: 'POST',
            body: {}
        }).then(res => {
            let newCourseNum = res?.data?.staticInfo?.newCourseNum;
            sessionStorage.setItem("newCourseNum", newCourseNum)
            this.setState({
                newCourseNum
            })
		}).catch(err => {
			console.log(err);
		})
    }

    async initAB() {
        let userId = getCookie('userId');
        if (userId) {
            let aOrb = userId%2
            this.setState({
                aOrb: aOrb !== 1
            })
        }
    }


    render() {
        if (typeof window == "undefined") return null;
        if (!this.state.isShow) {
            return null;
        }

        return (
            // 如果为空数据
            // ( !this.state.authStatus && this.state.portalBody && this.state?.imgNode?.keyB)?
            // createPortal(
            //     <div className='empty-enter on-log on-visible'
            //         data-log-name="我的课单-空数据"
            //         data-log-region={ `un-${ this.props.activeTag }-undata` }
            //         data-log-pos="0" 
            //         onClick={()=>{locationTo(this.state?.imgNode?.keyC)}}>
            //         <img src={this.state?.imgNode?.keyB} />
            //     </div>,
            //     this.state.portalBody
            // )
            // :
            // !this.state.authStatus ?
            // (
            //     // (!this.state.aOrb && this.state.qfuBottom) ?
            //     // createPortal(
            //     //     <div className="on-log on-visible"
            //     //         data-log-name="我的课单-女大未购"
            //     //         data-log-region={ this.props.activeTag == "recent" || this.props.activeTag == "purchased" ? `un-${ this.props.activeTag }-unpurchased-A` : `un-${ this.props.activeTag }-unpurchased` }
            //     //         data-log-pos="0"
            //     //         onClick={()=>{locationTo(this.state?.imgNode?.keyC)}}>
            //     //         <Lottie
            //     //             options={{
            //     //                 path: '//media.qlchat.com/qlLive/activity/file/93HWO1JS-H4YZ-1JIE-1565232696450-E9F2EPAEDJBQ.json'
            //     //             }}  
            //     //         />
            //     //     </div>,
            //     //     this.state.qfuBottom
            //     // )
            //     // :
            //     <div className='other-page-qfu-enter-bar-img on-log on-visible' 
            //         data-log-name="我的课单-女大未购"
            //         data-log-region={ this.props.activeTag == "recent" || this.props.activeTag == "purchased" ? `un-${ this.props.activeTag }-unpurchased-B`: `un-${ this.props.activeTag }-unpurchased` }
            //         data-log-pos="0"
            //         onClick={()=>{locationTo(this.state?.imgNode?.keyC)}}>
            //         <img src={this.state?.imgNode?.keyA} />
            //     </div>
            // )
            // // 只有 最近学习和已购 显示
            // : (!this.props.hideBought && /(recent|purchased)/.test(this.props.activeTag) )?
            //     <div className={['other-page-qfu-enter-bar on-log on-visible', this.state.newCourseNum ? null : 'mini'].join(' ')} 
            //         data-log-name="我的课单-女大已购"
            //         data-log-region={ `un-${ this.props.activeTag }-buy` }
            //         data-log-pos="0"
            //         onClick={() => { locationTo('/wechat/page/university/home') }} >
            //         <div className="main">
            //             <img className="icon" src={require('./img/icon-collage-red.png')} />
            //             <div className="main-flex">
            //                 <span className="qfu-name">千聊女子大学</span>
            //                 {
            //                     this.state.newCourseNum?
            //                     <span><span className="course-tips">30天内上新{this.state.newCourseNum}门课</span></span>
            //                     :null
            //                 }
            //             </div>
            //             <div className="right">回大学<i className='icon_enter'></i></div>
            //         </div>
            //     </div >
            // :null
            this.state.authStatus && (!this.props.hideBought && /(recent|purchased)/.test(this.props.activeTag)) && (
                <div className={['other-page-qfu-enter-bar on-log on-visible', this.state.newCourseNum ? null : 'mini'].join(' ')} 
                    data-log-name="我的课单-女大已购"
                    data-log-region={ `un-${ this.props.activeTag }-buy` }
                    data-log-pos="0"
                    onClick={() => { locationTo('/wechat/page/university/home') }} >
                    <div className="main">
                        <img className="icon" src={require('./img/icon-collage-red.png')} />
                        <div className="main-flex">
                            <span className="qfu-name">千聊女子大学</span>
                            {
                                this.state.newCourseNum?
                                <span><span className="course-tips">30天内上新{this.state.newCourseNum}门课</span></span>
                                :null
                            }
                        </div>
                        <div className="right">回大学<i className='icon_enter'></i></div>
                    </div>
                </div >
            )
        );
    }
}

QfuEnterBar.propTypes = {

};

export default QfuEnterBar;