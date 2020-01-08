import React, { Component } from "react";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import errorCatch from "components/error-boundary";
import { formatMoney } from "components/util";

@errorCatch()
@autobind
class LimitPrice extends Component {
    state = {};

    async componentDidMount() {}

    render() {
        const {data} = this.props
        return data && data.discountStatus === 'Y' ? (
            <div className="limit-price-wrap">
                <span className="sale">{formatMoney(data.discount * 100)}</span>
                <ul className="price-box">
                    <li>
                        <var className="price">￥{formatMoney(data.amount * 100)}</var>
                    </li>
                    <li>
                        <var className="title">限时特价</var>
                    </li>
                </ul>
                <span className="right special-price"></span>
            </div>
        ) : null
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(LimitPrice);
