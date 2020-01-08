
import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { formatMoney, locationTo } from 'components/util';
import classnames from 'classnames';

@autobind
class BuyBtn extends Component {
    handleEnter() {
        
    }
	render () {
        const Btn = (props) => {
            const { className, children, onClick } = props
            return (
                <div className={classnames('_buy-button', className)} onClick={onClick}>
                    <div className="btn buy-btn">
                        {children}
                    </div>
                </div>
            )
        }

        const {
            periodInfo,
            isBought,
            enterCourse,
            showDiscount,
            campInfo,
            allowMGLive,
            hasJoin,
            ...props
        } = this.props
        if (!periodInfo.channelId) return <Btn {...props} onClick={() => locationTo(`/wechat/page/live/${campInfo.liveId}`)} >新一期筹备中，看看其他</Btn>
        if (allowMGLive) return <Btn {...props} onClick={() => enterCourse(periodInfo.channelId)} >进入课程</Btn>;

        if (periodInfo.vipInfo) {
            if(periodInfo.vipInfo.isVip === 'N') {
                if(isBought) {
                    return <Btn {...props} onClick={() => enterCourse(periodInfo.channelId)} >进入课程</Btn>;
                } else {
                    return <Btn {...props} onClick={() => enterCourse(periodInfo.channelId, true)} >立即报名 &yen;{showDiscount ? periodInfo.discount : periodInfo.amount}</Btn>
                }
            } else {
                if(hasJoin === 'Y') {
                    return <Btn {...props} onClick={() => enterCourse(periodInfo.channelId)} >进入课程</Btn>;
                } else {
                    return <Btn {...props} onClick={() => enterCourse(periodInfo.channelId)} >去报名</Btn>
                }
            }
        }

        return <Btn {...props} onClick={() => enterCourse(periodInfo.channelId, true)} >立即报名 &yen;{showDiscount ? periodInfo.discount : periodInfo.amount}</Btn>
	}
}

export default BuyBtn