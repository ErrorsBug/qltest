import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getVal,imgUrlFormat } from 'components/util';
import { request } from 'common_actions/common'
import PortalCom from '../../../../components/portal-com';
// import './style.scss'

@autobind
class Barrage extends Component {
    state = {
        barrageList: [],
        doingSt: ['刚收到入学通知书', '报名加入了女子大学','开始前往大学报到','邀请你一起抱团成长','已经开始学习','已加入千聊学习营']
    }
    data = {
        orderList:[],
    }

    componentDidMount() {
        this.getOrders();
    }

    updateBarrage() {
        let odr = this.data.orderList;
        let bl = this.state.barrageList;
        if (!odr.length) {
            return
        }
        let idx = 0;
        this.barInt = setInterval(() => {
            if (bl.length) {
                bl.splice(0,1);
                this.setState({
                    barrageList: []
                })
            }
            if(odr.length <= idx) {
                idx = 0;
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
        },3000)
    }

    componentWillUnmount() {
      clearInterval(this.barInt)
    }

    // 获取购买历史
    async getOrders() {
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/orderDisplay',
            method: 'POST',
            body: {
                page: {
                    page: 1,
                    size:20
                }
            }
        }).then(res => {
            let orderList = getVal(res, 'data.orderList', []);
            this.data.orderList = orderList;
            this.updateBarrage();
            
		}).catch(err => {
			console.log(err);
		})
    }
    
    render() {
        const { isQlchat } = this.props;
        return (
            <PortalCom className={`jion-page-barrages ${ isQlchat ? 'appTop' : '' }`}>
                <ReactCSSTransitionGroup
                    transitionName="join-university-animation-barrageListItem"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}>
                    {
                        this.state.barrageList.map((std,idx) => {
                            return (
                                <div className="barrage-item" key={`${ std.word }-${idx}`}>
                                    <img src={imgUrlFormat(std.headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} />
                                    <span><b>{std.userName}</b>{std.word}</span>
                                </div>
                            )
                        })
                    }
                </ReactCSSTransitionGroup>
            </PortalCom>
        );
    }
}

Barrage.propTypes = {

};

export default Barrage;