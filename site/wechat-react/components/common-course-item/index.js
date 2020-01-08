import React, { Fragment } from 'react';
import classNames from 'classnames';
import { formatMoney, digitFormat,getCookie } from 'components/util';
import Detect from "components/detect";
import Picture from 'ql-react-picture';
import FlagUI from '../flag-ui'


/**
 * 通用课程列表项
 * @author jiajun.li 20180705
 * 
 * @param {object} data 系列课或单课对象
 */

export default class CommonCourseItem extends React.Component {

    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    get flagStr () {
        const flag = this.props.data.flag

        switch (flag) {
            case 'normal':
                return ''
            case 'boutique':
                return '精品'
            case 'recommend':
                return '热推'
            case 'surge':
                return '飙升'
            case 'star':
                return '大咖'
            default:
                return flag
        }
    }

    render() {
        let { data, onClick, href = '', className, isFlag = false, isHome=false, ...otherProps} = this.props;

        let isDashi = data.regionType === 'master';
        let isCamp = data.regionType === 'camp';

        className = classNames('common-course-item', className, {
            'type-dashi': isDashi
        });

        let avatarUrl = data.logo || data.headImage || data.headImageUrl;
        let w, h;
        if (isDashi) {
            w = 160;
            h = 205;
        } else {
            w = 240;
            h = 148;
        }
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
                            <Picture src={avatarUrl}
                                    placeholder={true}
                                    resize={{
                                        w: w,
                                        h: h
                                    }}
                            />
                        </div>
                    </div>
                    {
                        do {
                            if(isCamp){
                                <div className="learn-num">{data.flag}</div>
                            }else if(data.imgDesc){
                                <div className="learn-num">
                                    {data.imgDesc}
                                </div>
                            }else{
                                <div className="learn-num">
                                    {digitFormat(data.learningNum || data.authNum || 0)}次学习
                                </div>
                            }
                        }
                    }
                    {/*<FlagUI flag={ "独家" } />*/}
                    { !!data.flag2 && isFlag && <FlagUI flag={ data.flag2 } /> }
                    
                </div>

                <div className="info">
                    <div className="c-flex-grow1">
                        <div className="name">
                            {
                                this.flagStr &&
                                <span className="hottest">{this.flagStr}</span>
                            }
                            {data.businessName}
                        </div>
                        {
                            isDashi
                            ?
                            <Fragment>
                                {data.remark && <div className="remark">{data.remark}</div>}
                                <div className="live-name">{data.liveName}</div>
                            </Fragment>
                            :
                            <div className="remark">{data.remark || data.liveName}</div>
                        }
                    </div>
                    <div className="other-info">
                        <p>
                            {
                                isDashi && <span className="learn-num">
                                    {data.learningNum ? `${digitFormat(data.learningNum)}次学习 | ` : '0次学习 | '}
                                </span>
                            }
                            {
                                data.businessType === 'channel'
                                    ?
                                    <span>{data.planCount || data.topicNum || 0}课</span>
                                    :
                                    data.businessType === 'topic'
                                        ?
                                        <span>单课</span>
                                        :
                                        false
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



export function CommonCourseItemPlaceholder() {
    return <div className="common-course-item placeholder">
        <div className="img-wrap"></div>
        <div className="info">
            <div>
                <div className="name"></div>
                <div className="remark"></div>
                <div className="live-name"></div>
            </div>
            <div className="other-info">
                <p></p>
                <div className="price"></div>
            </div>
        </div>
    </div>
}