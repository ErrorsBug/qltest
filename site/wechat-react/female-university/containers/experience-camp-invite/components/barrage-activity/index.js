import React, { Component } from 'react';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { imgUrlFormat, formatMoney } from 'components/util'; 

@withStyles(styles)
@autobind
class Barrage extends Component {
    
    state = {
        barrageList: [],
        doingSt: [],
        orderList: [ ]
    }
    componentDidMount() {
        this.initData()
    }
    async initData(){
        await this.setState({
            orderList: this.props.list
        })
        this.updateBarrage();
    }
    updateBarrage() {
        let odr = this.state.orderList;
        let bl = this.state.barrageList;
        if (!odr.length) {
            return
        }
        let idx = 0;
        const len = this.state.doingSt.length - 1;
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
 
    
    render() {
        const { isQlchat, className='',  } = this.props;
        return (
            <div className={`${styles['experience-camp-invite-barrage']} ${styles[className]}`}>
                <ReactCSSTransitionGroup
                    transitionName="experience-activity-animation-barrageListItem"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}>
                    {
                        this.state.barrageList.map((std,idx) => {
                            return (
                                <div className={`${styles['barrage-item']}`} key={`${ std.word }-${idx}`}>
                                    <img src={imgUrlFormat(std.headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} />
                                    <span><b>{std.userName}</b>成功邀请了{std.count}人，获得奖金<span>{formatMoney( std.money )}</span>元</span>
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