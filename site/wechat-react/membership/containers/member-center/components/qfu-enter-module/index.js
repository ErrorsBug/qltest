import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { request } from 'common_actions/common'
import { locationTo } from 'components/util';

class QfuEnterModule extends Component {

    state = {
        menuNode:{}
    }

    componentDidMount() {
        this.getUniversityStatus();
        this.getQfuSettings();
        this.hasPayVip();
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
            let authStatus = res?.data ?.authStatus;
            this.setState({
                authStatus:authStatus==='Y'?true:false
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
            let menuNode = res ?.data ?.menuNode ?.children;
            if (menuNode && menuNode.length) {
                let memberCopuon = menuNode.find(item => item.nodeCode === 'QL_NZDX_DLRK_MEMBER_COUPON');
                let normalCopuon = menuNode.find(item => item.nodeCode === 'QL_NZDX_DLRK_NORMAL_COUPON');
                this.setState({
                    memberCopuon,
                    normalCopuon
                })
            }

            
		}).catch(err => {
			console.log(err);
		})
    }

    /**
     * 获取是否购买过千聊会员
     *
     * @memberof MineCourse
     */
    async hasPayVip() {
        await request({
            url: '/api/wechat/transfer/h5/member/hasPay',
            method: 'POST',
            body: {
                courseId:''
            }
        }).then(res => {
            let status = res ?.data ?.status;
            this.setState({
                hasPayVip:status==='Y'?true:false
            })
		}).catch(err => {
			console.log(err);
		})
    }


    render() {
        if(this.state.authStatus){
            return null
        }
        return (
            <div className='qfu-enter-moudule on-log on-visible'
                data-log-name="会员中心"
                data-log-region={ `un-${ this.state?.hasPayVip ? 'vip': 'unvip' }-university` }
                data-log-pos="0"  
                onClick={()=>{locationTo( this.state?.hasPayVip ? this.state?.memberCopuon?.keyC : this.state?.normalCopuon?.keyC)}}>
                {
                    this.state?.hasPayVip ?
                        <img className='dl-img' src={this.state?.memberCopuon?.keyA} />
                    :<img className='dl-img' src={this.state?.normalCopuon?.keyA} />
                }
                
            </div>
        );
    }
}

QfuEnterModule.propTypes = {

};

export default QfuEnterModule;