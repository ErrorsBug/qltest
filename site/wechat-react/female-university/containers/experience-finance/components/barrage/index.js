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
        load:false
    }
    data = {
        orderList:[],
    }

    componentDidMount() {
        this.updateBarrage();
    }

    updateBarrage() {
        let odr = this.props.orderList;
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
            setTimeout(() => {
                bl.push({ ...userInfo })
                this.setState({
                    barrageList: [{ ...userInfo }],
                    load:true
                })
            }, 500)
        },3000)
    }

    componentWillUnmount() {
      clearInterval(this.barInt)
    }
 
    
    render() {
        const { isQlchat, className } = this.props;
        if(!this.state.load)return false
        return (
            <div className={`${styles['experience-finance-barrage']} ${styles[className]}  `}>
                <ReactCSSTransitionGroup
                    transitionName="join-university-animation-barrageListItem"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}>
                    {
                        this.state.barrageList.map((std,idx) => {
                            return (
                                <div className={`${styles['barrage-item']}`} key={`${ std.word }-${idx}`}>
                                    <img src={imgUrlFormat(std.headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} />
                                    <div className={`${styles['barrage-item-text']}`}><b>{std.userName}</b> <span>{std.word}</span> </div>
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