import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { request } from 'common_actions/common'
import { locationTo } from 'components/util'

class QfuEnterModule extends Component {

    state = {
        menuNode:{}
    }

    componentDidMount() {
        this.getUniversityStatus();
        this.getQfuSettings();
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
            this.setState({
                authStatus: flag
            })
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
            this.setState({
                newCourseNum
            })
		}).catch(err => {
			console.log(err);
		})
    }

    /**
     * 获取女子大学导流入口
     *
     * @memberof MineCourse
     */
    async getQfuSettings() {
        await request({
            url: '/api/wechat/transfer/baseApi/h5/menu/node/get',
            method: 'POST',
            body: {
                nodeCode: 'QL_NZDX_DLRK_MINE_01',
                page:{
                    size: 20,
                    page:1
                }
            }
        }).then(res => {
            let menuNode = res?.data?.menuNode;
            if (menuNode) {
                this.setState({
                    menuNode
                })
            }

            
		}).catch(err => {
			console.log(err);
		})
    }
    
    render() {
        if(!this.state.authStatus) return  null;
        return (
            <div className='qfu-enter-moudule'>
                <div className='qfu-enter-bar on-log on-visible' 
                    data-log-name="女大个人中心已购入口"
                    data-log-region="un-mine-university-purchased"
                    data-log-pos="0"
                    onClick={()=>{locationTo('/wechat/page/university/home')}} >
                    <img className="icon" src={require('./img/icon-collage.png')} />
                    <div className="main-flex">
                            <span className="qfu-name">千聊女子大学</span>
                            {
                                this.state.newCourseNum?
                                <span>
                                    <span className="course-tips">30天内上新{this.state.newCourseNum||12}门课</span>
                                </span>
                                :null
                            }
                    </div>
                    <div className="right">回大学<i className='icon_enter'></i></div>
                </div>
            </div>
        );
    }
}

QfuEnterModule.propTypes = {

};

export default QfuEnterModule;