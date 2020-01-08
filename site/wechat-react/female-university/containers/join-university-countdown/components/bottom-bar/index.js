import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { autobind } from 'core-decorators';
import DialogPayment  from '../../../../components/dialog-payment';
import CountComp from '../../../../components/dialog-payment/count-comp'


@withStyles(styles)
@autobind
class BottomBar extends Component {

    state = {
        portalDom:null,
        isShow:false,
        time: ''
    }
    componentDidMount() {
        this.setState({
            portalDom:document.querySelector('.portal-middle')
        })
    }
    updatTime(time) {
        this.setState({
            time: time
        })
    }

    toggle() {
        this.setState({
            isShow:!this.state.isShow
        })
    }
    
    render() { 
        const isVip = localStorage.hasInvaCoupon&& JSON.parse(localStorage.hasInvaCoupon).couponType=='vip'
        return (
            <div className={`${styles['jion-page-bottom-bar']} `}>
                 <span className={`${styles['on-sale-countdown']}`}>
                    <span className={`${styles['title']}`}>优惠剩余</span>
                    <span className={`${styles['time']}`}><CountComp /></span>
                </span> 
                <DialogPayment
                    isDou={ true }
                    updatTime={this.updatTime}
                >
                    <span className={`${styles['btn-jion']}`}>安全支付</span>
                </DialogPayment>

            </div>
        );
    }
}

BottomBar.propTypes = {

};

export default BottomBar;