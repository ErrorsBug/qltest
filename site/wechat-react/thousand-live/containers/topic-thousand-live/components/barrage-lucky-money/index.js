import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat,formatMoney,dangerHtml } from 'components/util';


class BarrageLuckyMoney extends PureComponent {

    render() {
        // 音视频跟普通话题返回对象不统一
        const name = this.props.rewardBulletList.length > 0? (this.props.rewardBulletList[0].name || this.props.rewardBulletList[0].speakCreateByName) :'';
        const relateName = this.props.rewardBulletList.length > 0? (this.props.rewardBulletList[0].relateName || this.props.rewardBulletList[0].content.replace('赞赏了', (m) => '')) :'';
        const relateContent = this.props.rewardBulletList.length > 0?(this.props.rewardBulletList[0].relateContent || formatMoney(this.props.rewardBulletList[0].rewardMoney)):'';
        const headImgUrl = this.props.rewardBulletList.length > 0?(this.props.rewardBulletList[0].headImgUrl || this.props.rewardBulletList[0].speakCreateByHeadImgUrl):'';

        return (

            <dl className={`lucky-money-bullet ${this.props.isAbsolute?'is-absolute':''}`}>
                {
                    this.props.rewardBulletList.length > 0?
                    <dd className={`lmb-item ${!this.props.isShowBullet?'hide':''} ${this.props.isShootBullet?'on':''} `}>
                        <var className="money">{relateContent}</var>
                        <span className="msg">
                            <b className="b-one" dangerouslySetInnerHTML={dangerHtml(name)}></b>
                            <b className="b-two" dangerouslySetInnerHTML={dangerHtml(relateName)}></b>
                        </span>
                        <img className="head"  src={`${imgUrlFormat(headImgUrl,'?x-oss-process=image/resize,h_100,w_100,m_fill')}`} />
                    </dd>
                    :null
                }
            </dl>
        );
    }
}

BarrageLuckyMoney.propTypes = {

};

export default BarrageLuckyMoney;
