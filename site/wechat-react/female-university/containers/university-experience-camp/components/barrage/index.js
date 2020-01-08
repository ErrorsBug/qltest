import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getVal,imgUrlFormat } from 'components/util';
import { request } from 'common_actions/common'

@withStyles(styles)
@autobind
class Barrage extends Component {
    state = {
        barrageList: [],
        doingSt: [],
        orderList: []
    }
    componentDidMount() {
        this.getOrders();
    }

    updateBarrage() {
        let odr = this.state.orderList;
        let bl = this.state.barrageList;
        if (!odr.length) {
            return
        }
        let idx = 0;
        const len = this.props.doingSt.length - 1;
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
            let _idx = (Math.random() * len).toFixed(0);
            let userInfo = odr[idx];
            idx = idx + 1;
            if(!userInfo.word&&this.props.doingSt){
                userInfo.word = this.props.doingSt[_idx]
            }
            setTimeout( () => {
                bl.push({ ...userInfo })
                this.setState({
                    barrageList: [{ ...userInfo }],
                })
            }, 500)
        },3000)
    }

    loadImg(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url
            img.crossOrigin = 'Anonymous';
            var objectURL = null
            if (url.match(/^data:(.*);base64,/) && window.URL && URL.createObjectURL) {
                objectURL = URL.createObjectURL(dataURL2blob(url))
                url = objectURL
            }
            img.onload = () => {
                objectURL && URL.revokeObjectURL(objectURL)
                resolve(img)
            }
            img.onerror = () => {
                reject(new Error('That image was not found.:' + url.length))
            }
        })
    }

    componentWillUnmount() {
      clearInterval(this.barInt)
    }

    // 获取购买历史
    async getOrders() {
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/actOrderDisplay',
            method: 'POST',
            body: {
                type: 'ufw_camp',
                actId: this.props.actId,
                page: {
                    page: 1,
                    size:20
                }
            }
        }).then(res => {
            let orderList = getVal(res, 'data.orderList', []);
            this.setState({
                orderList: orderList
            })
            this.updateBarrage();
            
		}).catch(err => {
			console.log(err);
		})
    }
    
    render() {
        const { className='' } = this.props;
        return (
            <div className={`${styles['jion-experience-page-barrage']} ${styles[className]}`}>
                <ReactCSSTransitionGroup
                    transitionName="join-university-animation-barrageListItem"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}>
                    {
                        this.state.barrageList.map((std,idx) => {
                            return (
                                <div className={`${styles['barrage-item']}`} key={`${ std.word }-${idx}`}>
                                    <img src={imgUrlFormat(std.headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} />
                                    <span>{ std.userCity || '广州' }的 <b>{std.userName && (std.userName.length > 4 ? `${ std.userName.slice(0, 4) }**` : std.userName ) }</b> {std.word}</span>
                                </div>
                            )
                        })
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

Barrage.propTypes = {

};

export default Barrage;