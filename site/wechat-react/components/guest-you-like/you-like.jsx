import React, { Fragment, Component } from 'react';
import classNames from 'classnames';
import { formatMoney, digitFormat } from 'components/util';
import Detect from "components/detect";
import Picture from 'ql-react-picture';
import { autobind } from 'core-decorators'

@autobind
export default class LikeYou extends Component {
    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    render() {
        let { data, onClick, href = '', className, ...otherProps } = this.props;

        let isDashi = data.regionType === 'master';

        className = classNames('like-mini-box', className, {
            'type-dashi': isDashi
        });

        let avatarUrl = data.logo || data.headImage;
        return (
            <a
                className={className}
                href={href}
                onClick={this.onClick}
                {...otherProps}
            >
                <div className="img-wrap">
                    <div className={classNames('poster', `flag-${data.flag}`)}>
                        <div className="c-abs-pic-wrap">
                            <Picture src={avatarUrl} placeholder={true} resize={{w:'162',h:"101"}}  />
                        </div>
                    </div>
                </div>

                <div className="info">
                    <div className="c-flex-grow1">
                        <div className="name">
                            {
                                (isDashi && data.flag) &&
                                <span className="hottest">{data.flag}</span>
                            }
                            {data.businessName}
                        </div>
                    </div>

                    <div className="other-info">
                        <p>
                            {
                                <span className="learn-num">
                                    {data.learningNum ? `${digitFormat(data.learningNum)}次学习 | ` : '0次学习 | '}
                                </span>
                            }
                            {
                                data.businessType === 'channel' ?
                                <span>{data.planCount || data.topicNum || 0}课</span> :
                                <span>单课</span>
                            }
                        </p>

                        {
                            data.money > 0
                            ?(
                                ((!Detect.os.ios&&this.isWeapp)|| !this.isWeapp)?
                                <div className="price">
                                    {
                                        data.discount == -1 ||
                                        (
                                            data.discountStatus === 'K' &&
                                            data.shareCutStartTime > data.currentTime &&
                                            data.shareCutEndTime < data.currentTime
                                        ) 
                                        ?
                                        <span className="current">￥{formatMoney(data.money)}</span>
                                        :
                                        <span>
                                            <span className="origin">¥{formatMoney(data.money)}</span>
                                            <span className="current">¥{formatMoney(data.discount)}</span>
                                        </span>
                                    }
                                </div>
                                :null
                            )
                            :
                            <div className="price">
                                <div className="free">免费</div>
                            </div>
                        }
                    </div>
                </div>
            </a>
        )
    }

    onClick = e => {
        if (this.props.onClick) {
            e.preventDefault();
            this.props.onClick(e);
        }
    }
}