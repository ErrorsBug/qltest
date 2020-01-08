import React, { Fragment } from 'react';
import ScrollView from 'components/scroll-view';
import classNames from 'classnames';
import SlideInFromBottom from '../slide-in-from-bottom';
import { formatDate, formatMoney, businessTypeCNMap } from 'components/util';
import exposure from 'components/exposure';



export default class SelectOrder extends React.PureComponent {
    render() {
        return <SlideInFromBottom
            entityClassName="p-feedback-select-order"
            in={this.props.in}
            onEntered={this.onEntered}
            onClickBg={this.props.onClose}
            header="选择订单"
            onClickHeaderClose={this.props.onClose}
        >
            {this.renderContent}
        </SlideInFromBottom>
    }

    onEntered = () => {
        exposure.collect();
        exposure.bindScroll({wrap: 'scroll-view-select-order'});
    }

    renderContent = () => {
        return <Fragment>
            <ScrollView
                className="scroll-view-select-order"
                status={this.props.orderList.status}
                onScrollBottom={() => this.props.getOrderList(true)}
            >   
                {
                    this.props.orderList.data && this.props.orderList.data.map((item, index) => {
                        const cln = classNames('order-item on-visible on-log', {active: index == this.props.index});
                        return <div key={index}
                            className={cln}
                            data-log-region="order-item"
                            data-log-pos={index}
                            onClick={() => this.onClickItem(index)}
                        >
                            <div className="type">{businessTypeCNMap[item.purchaseType]}</div>
                            <div className="content">{item.businessName}</div>
                            <div className="other-info">
                                <div>{formatDate(item.payTime, 'yyyy-MM-dd hh:mm:ss')}</div>
                                <div>实付：￥{formatMoney(item.amount)}</div>
                            </div>
                        </div>
                    })
                }
            </ScrollView>
        </Fragment>
    }

    onClickItem = index => {
        typeof this.props.onChange === 'function' && this.props.onChange(index);
        typeof this.props.onClose === 'function' && this.props.onClose();
    }
}