import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { BottomDialog } from 'components/dialog';
@autobind
class CouponBottomActionSheet extends Component {
    state = {
        status: ''
    }
    async onItemClick(status) {
        this.setState({
            status
        })
    }
    handleOnSure() {
        this.props.changeStatus(this.state.status)
        this.props.hide()
    }
    render() {
        return (
            <div className='action-sheet-container coupon-bottom'>
                <BottomDialog
                    show={ this.props.show }
                    theme={ 'list' }
                    items={
                        [
                            {
                                key: '',
                                content: '全部',
                                show: true,
                                region: 'coupon-info',
                                pos: 'filter-all'
                            },
                            {
                                key: 'unused',
                                content: '未使用',
                                show: true,
                                region: 'coupon-info',
                                pos: 'filter-unused'
                            },
                            {
                                key: 'bind',
                                content: '已领取未使用',
                                show: true,
                                region: 'coupon-info',
                                pos: 'filter-received'
                            },
                            {
                                key: 'used',
                                content: '已使用',
                                show: true,
                                region: 'coupon-info',
                                pos: 'filter-used'
                            }
                        ]
                    }
                    title={"优惠券筛选"}
                    close={ false }
                    onClose={ this.props.hide }
                    onItemClick={ this.onItemClick }
                    activeString={this.state.status}
                    showSure={true}
                    onSure={this.handleOnSure}
                    logSure={{
                        region: 'coupon-info',
                        pos: 'filter-confirm'
                    }}
                >
                </BottomDialog>
            </div>
        );
    }
}

CouponBottomActionSheet.propTypes = {
    // 是否显示
    show: PropTypes.bool.isRequired,
};


module.exports = CouponBottomActionSheet