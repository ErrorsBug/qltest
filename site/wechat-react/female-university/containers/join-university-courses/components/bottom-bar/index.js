import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { autobind } from 'core-decorators';
import { getVal }from 'components/util';
import DialogPayment  from '../../../../components/dialog-payment';


@withStyles(styles)
@autobind
class BottomBar extends Component {

    state = {
        sale:0,
        portalDom:null,
        isShow:false
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
    
    render() {
        const { keyE = [] } = this.props;
        const isInteger = parseInt(this.props.price - this.state.sale, 10) === this.props.price - this.state.sale
        return (
            <div className={`${styles['jion-page-bottom-bar']} `}>
                <div className={`${styles['on-sale-info']}`}>
                    <span>共<var>{this.props.courseNum}</var>门课，可省<var>{Number((this.props.price - this.state.sale)).toFixed(isInteger ? 0 : 2)}</var>元</span>   
                    {/* <p>每天投资1.1元，收获幸福未来</p> */}
                </div>
                <DialogPayment
                    isCourses={ true }
                    updateCharge={this.updateCharge}
                >
                    <span className={`${styles['btn-jion']}`}>立即报名</span>
                </DialogPayment>

            </div>
        );
    }
}

BottomBar.propTypes = {

};

export default BottomBar;