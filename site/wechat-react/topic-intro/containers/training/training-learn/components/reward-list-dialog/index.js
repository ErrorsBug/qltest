import React, { Component } from "react";
import { connect } from 'react-redux';
import { get } from 'lodash';
import { autobind } from "core-decorators";
import errorCatch from "components/error-boundary";
import { MiddleDialog } from 'components/dialog';

@errorCatch()
@autobind
class RewardListDialog extends Component {
  
    renderTypeName(couponType) {
        let name = '优惠券'
        switch (couponType) {
            case 'live':
                name = '直播间通用券'
                break;
            case 'topic':
                name = '话题优惠券'
                break;
            case 'channel':
                name = '系列课优惠券'
                break;
            case 'global_vip':
                name = '通用vip券'
                break;
            case 'custom_vip':
                name = '定制vip券'
                break;
        }
        return name
    }

    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                titleTheme={'white'}
                className="reward-list-dialog"
                onClose={this.props.onClose}
            >
                <div className='main reward-list-content'>
                    <p className="title">打卡有奖</p>

                    <div className="reward-list">
                        {
                            this.props.userReword.map(reward => (
                                <div className={`item coupon ${reward.isReceive === 'Y' ? 'have' : ''}`}>
                                    <div className="info">
                                        <p className="price">{reward.money}<span>￥</span></p>
                                        <div className="condition">
                                            <p>打卡满{reward.affairNum}天奖励</p>
                                            <p>{this.renderTypeName(reward.couponType)}</p>
                                        </div>
                                    </div>
                                    <div className="name">
                                        <p>{reward.businessName}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </MiddleDialog>
        )
    }
}

const mapStateToProps = function (state) {

    return {
        userReword: get(state, 'training.userReword') || [],
        userAffairInfo: get(state, 'training.userAffairInfo') || {},
    }
};

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(RewardListDialog);