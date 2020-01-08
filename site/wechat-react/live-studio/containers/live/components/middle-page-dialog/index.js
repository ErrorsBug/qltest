import React, { Component } from 'react';
import { logQRCodeTouchTrace } from 'components/log-util';

class MiddlePageDialog extends Component {

    constructor(props){
        super(props)
    }

    state = {
        isOpenRedPackage: false,
        isOpening: false,
    }

    isTouching = false

    componentDidMount = () => {
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 400)
    }

    touchStartHandle = () => {
        this.isTouching = true;
        this.touchTimer = setTimeout(() => {
            if(this.isTouching){
                logQRCodeTouchTrace('focusmiddlepage');
            }
        }, 700)
    }

    touchEndHandle = () => {
        if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
    }

    openRedPackage = () => {
        this.setState({isOpening: true}, () => {
            setTimeout(() => {
                this.setState({isOpenRedPackage: true}, () => {
                    setTimeout(() => {
                        typeof _qla != 'undefined' && _qla.collectVisible();
                    }, 100)
                })
            }, 900)
        });  
    }

    render() {
        const { 
            userInfo,
            middlePageQrcodeUrl,
            appId
        } = this.props;

        const openBtnImg = this.state.isOpening ? require('./img/coin.png') : require('./img/open-btn.png');
        const userIdLen = this.props.userInfo.userId && this.props.userInfo.userId.length;
        const ABtestForA = (this.props.userInfo.userId && Number(this.props.userInfo.userId.substr(userIdLen-1, userIdLen)) >= 5) ? 'N' : 'Y';      

        return (
            <section 
                className="on-log focus-qrcode-dialog"
                data-log-region="turnoff-middlepage"
                onClick={this.props.hide}
            >
                {
                    (this.state.isOpenRedPackage || ABtestForA === 'N') && 
                    <div className="main-unfold on-visible"  /* B */
                        onClick={e => e.stopPropagation()}
                        data-log-name="二维码"
                        data-log-region={ABtestForA === 'Y' ? 'visible-middlepageA' : 'visible-middlepage'}
                        data-log-pos={ABtestForA === 'Y' ? 'middlepageA' : 'middlepage'}
                        data-log-index={appId}
                    >
                        <img src={userInfo.headImgUrl} className="head-img" />
                        <p className="name">{userInfo.name}</p>
                        <img 
                            src={middlePageQrcodeUrl} 
                            className="qrcode" 
                        />
                    </div>
                }
                {    
                    (this.props.userInfo.userId && !this.state.isOpenRedPackage && ABtestForA === 'Y') &&
                    <div className="main-fold" /* A */
                        onClick={e => e.stopPropagation()}
                    >
                        <img src={userInfo.headImgUrl} className="head-img" />
                        <p className="name">{userInfo.name}</p>
                        <img 
                            src={openBtnImg} 
                            className="open-btn on-log on-visible"
                            data-log-name="开红包按钮"
                            data-log-region='middlepageA'
                            onClick={this.openRedPackage}
                        />
                    </div> 
                }
            </section>
        )
    }
}

export default MiddlePageDialog;
