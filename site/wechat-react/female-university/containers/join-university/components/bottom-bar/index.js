import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { createPortal } from 'react-dom';
import { MiddleDialog } from 'components/dialog';
import { getVal, locationTo } from 'components/util';
import { autobind } from 'core-decorators';
import DialogPayment from '../../../../components/dialog-payment';


@withStyles(styles)
@autobind
class BottomBar extends Component {

    state = {
        portalDom:null,
        isShow: false,
        sale: 0,
        price:0,
        isCouponLoad: false,
    }

    
    componentDidMount() {
        this.setState({
            portalDom:document.querySelector('.portal-middle')
        })
    }

    toggle() {
        this.setState({
            isShow:!this.state.isShow
        })
    }

    updateCharge(charge) {
        let amount = getVal(charge, 'UFW_TICKET_AMOUNT');
        let totalPrice = getVal(charge, 'totalPrice');
        if (amount) {
            this.setState({
                price: amount,
                sale:totalPrice
            })
        }
    }
    changeCouponLoad(flag) {
        this.setState({
            isCouponLoad: flag
        })
    }
    
    render() {
        if (!this.state.portalDom) {
            return null
        }
        const { isTab, isWithIcon,ExperienceCampIcon } = this.props;
        const isInteger = parseInt(Number(this.state.sale), 10) === Number(this.state.sale) 
        typeof _qla != 'undefined' && _qla.collectVisible();
        return (
            <div className={`${styles['jion-page-bottom-bar']} ${this.props.show?styles.show:''} ${ (this.props.show && isTab) ? styles['tab'] : '' }`}>
                {
                    (isTab||isWithIcon)&&ExperienceCampIcon?.keyA?
                    <div className={styles['jion-page-container-with-icon']}>
                        <div className={styles['jpbb-left-with-icon']}>
                            <img 
                            className={`${styles['un-exper-icon']}  on-log on-visible`}
                            data-log-name="限时体验"
                            data-log-region="un-exper-btn"
                            data-log-pos="0"
                            onClick={()=>{ExperienceCampIcon?.keyB&&locationTo(ExperienceCampIcon?.keyB)}}
                            src={ExperienceCampIcon.keyA}/>
                        </div>
                        <div className={styles['jpbb-right']}> 
                            <DialogPayment
                                updateCharge={this.updateCharge}
                                changeCouponLoad={ this.changeCouponLoad }
                            >
                                <span className={`${styles['btn-jion-with-icon']}  on-log on-visible`}
                                    data-log-name="报名入学"
                                    data-log-region="un-apply-btn"
                                    data-log-pos="0">报名入学</span>
                            </DialogPayment> 
                        </div>
                    </div> 
                    :
                    <div className={styles['jion-page-container']}>
                        <div className={styles['jpbb-left']}>
                            <span 
                                className={`${styles['seek-advice']} on-log on-visible`}
                                data-log-name="咨询"
                                data-log-region="un-advisory-btn"
                                data-log-pos="0"
                                onClick={ this.toggle}
                            >
                                <img src={require('./img/icon-wechat.png')} alt=""/>
                                咨询
                            </span>
                            <span className={`${styles['price-box']}`}>
                                <span className={`${styles['on-sale']}`}>￥{Number((this.state.sale)).toFixed(isInteger ? 0 : 2)}/年</span>
                                {/* <span className={`${styles['price']}`}>每天仅需<strong>1.1元</strong></span> */}
                            </span>
                        </div>
                        <DialogPayment
                            updateCharge={this.updateCharge}
                            changeCouponLoad={ this.changeCouponLoad }
                        >
                            <span className={`${styles['btn-jion']} on-log on-visible`}
                                data-log-name="立即报名"
                                data-log-region="un-apply-btn"
                                data-log-pos="0">报名加入</span>
                        </DialogPayment> 
                    </div> 
                }
                {
                    createPortal(       
                        <MiddleDialog
                            show={this.state.isShow}
                            theme='empty'
                            bghide
                            titleTheme={'white'}
                            buttons={null}
                            close={true}
                            title="请添加微信咨询"
                            className={`${styles['jion-page-seek-advice-dialog']}`}
                            onClose={ this.toggle}>
                            <div className={`${styles['main']}`}>
                                <img src={getVal(this.props,'adviceData.keyA')||''} className={`${styles['qrcode']}`} alt="" />
                                <span className={`${styles['jion-page-decs']}`}>长按识别工作人员二维码</span>
                                {/* <span>或拨打：{getVal(this.props,'adviceData.keyB')||''} </span> */}
                            </div>
                        </MiddleDialog>
                        ,this.state.portalDom
                    )
                }
            </div>
        );
    }
}

BottomBar.propTypes = {

};

export default BottomBar;