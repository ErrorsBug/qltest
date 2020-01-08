import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getVal,imgUrlFormat, locationTo } from 'components/util';
import { request } from 'common_actions/common'

@withStyles(styles)
@autobind
class DialogBarrage extends Component {
    state = {
        barrageList: [],
        doingSt: []
    }
    data = {
        orderList:[],
    }

    componentDidMount() { 
        this.updateBarrage()
    }

    updateBarrage() {
        let odr = this.props.listIdeaSpecData; 
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
            if(!userInfo.word&&this.props.doingSt){
                userInfo.word = this.props.doingSt[_idx]
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
 
    
    render() {
        const { isQlchat } = this.props;
        return (
            <div className={`${styles['dialog-page-barrage']}`}>
                <ReactCSSTransitionGroup
                    transitionName="dialog-university-animation-barrageListItem"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}>
                    {
                        this.state.barrageList.map((std,idx) => {
                            return (
                                <div 
                                    onClick={()=>{locationTo(`/wechat/page/university/community-home?studentId=${std.userId}`)}}
                                    className={`${styles['barrage-item']}`} key={`${ std.word }-${idx}`}>
                                    <img src={imgUrlFormat(std.headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} />
                                    <span>恭喜{std.userName}的想法被评为精选</span>
                                </div>
                            )
                        })
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

DialogBarrage.propTypes = {

};

export default DialogBarrage;