import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getVal,imgUrlFormat,getCookie } from 'components/util';
import { request } from 'common_actions/common'

@withStyles(styles)
@autobind
class Barrage extends Component {
    state = {
        barrageList: [],
        doingSt: ['2秒前', '3秒前','1秒前','10秒前','1分钟前','3分钟前']
    }
    data = {
        orderList:[],
    }

    componentDidMount() {
        if (this.props.type&&getCookie('userId')) {
            this.init();
        }
    }

    init () {
        request({
            url: '/api/wechat/transfer/h5/courseExtend/getCourseConfig',
            method: 'POST',
            body: {
                businessType: this.props.type,
                businessId: this.props.type === 'channel' ? this.props.channelId : this.props.topicId,
                function: 'intro_barrage_switch'
            }
        }).then(res => {
            if (res?.data?.flag === 'Y') {
                this.getOrders();
            }
            
		}).catch(err => {
			console.log(err);
		})
    }

    updateBarrage() {
        let odr = this.data.orderList;
        let bl = this.state.barrageList;
        if (!odr.length) {
            return
        }
        let idx = 0;
        const func = () => {
            if (bl.length) {
                bl.splice(0,1);
                this.setState({
                    barrageList: []
                })
            }
            if(odr.length <= idx) {
                if (odr.length > 3) {
                    idx = 0;
                } else {
                    clearInterval(this.barInt)
                    return
                }
            }

            let _idx = (Math.random() * 5).toFixed(0);
            let userInfo = odr[idx];
            idx = idx + 1;
            if(!userInfo.word){
                userInfo.word = this.state.doingSt[_idx]
            }
            setTimeout(() => {
                bl.push({ ...userInfo })
                this.setState({
                    barrageList: [{ ...userInfo }],
                })
            }, 500)
        }

        this.barInt = setInterval(func, 3000)
    }

    componentWillUnmount() {
      clearInterval(this.barInt)
    }

    // 获取购买历史
    async getOrders() {
        let url = null
        let params = {
            pageSize: 20,
            pageNum: 1
        }
        if (this.props.type === 'channel') {
            url = '/h5/channel/introBarrageList'
            // url = '/h5/channel/authList'
            params.channelId = this.props.channelId
        } else {
            // url = '/h5/topic/introBarrageList'
            url = '/h5/topic/authList'
            params.topicId = this.props.topicId
        }

        await request({
            url: '/api/wechat/transfer' + url,
            method: 'POST',
            body: params
        }).then(res => {
            console.log(res)
            let orderList = [];
            if (this.props.type === 'channel') {
                orderList = getVal(res, 'data.userList', [])
            } else {
                orderList = getVal(res, 'data.list', [])
            }
            this.data.orderList = orderList;
            this.updateBarrage();
		}).catch(err => {
			console.log(err);
		})
    }
    
    render() {
        return (
            <div className={`${styles['jion-page-barrage']}`}>
                <ReactCSSTransitionGroup
                    transitionName="join-university-animation-barrageListItem"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}>
                    {
                        this.state.barrageList.map((std,idx) => {
                            return (
                                <div className={`${styles['barrage-item']}`} key={`${ std.word }-${idx}`}>
                                    <img src={imgUrlFormat(std.headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} />
                                    <span><b>{std.userName.slice(0, 2)}**</b>{std.word}报名了课程</span>
                                </div>
                            )
                        })
                    }
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

Barrage.propTypes = {

};

export default Barrage;