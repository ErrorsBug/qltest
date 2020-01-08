import * as React from 'react';
import './dialog.scss';
import api from '../../../../utils/api';
import * as ui from '../../../../utils/ui'
import { ReactEventHandler, MouseEvent } from 'react';
interface DialogProps {
    show: boolean;
    isFocus?: string;
    data: {
        id?: string;
        businessId?: string; //业务id
        likeNum?: number; //投票数量
        content?: string; //内容
        name?: string; //名称
        headImg?: string; //头像
        isLike?: string; //是否投票过
        isFocus?: string; //是否关注过
        couponId?: string; //优惠券id
        isHave?: string;
        money?: number;
        liveName?: string;
        overTime?: string;
        logo?: string;
    };
    onClose: () => void
}

interface DialogState {
    isFocus?: string;
    isHave?: string
}

export default class Dialog extends React.PureComponent<DialogProps, DialogState> {
    constructor(props: DialogProps) {
        super(props);
        this.state = {
            isFocus: this.props.data.isFocus,
            isHave: this.props.data.isHave
        }
    }

    componentWillReceiveProps(nextProps: DialogProps) {
        this.setState({
            isFocus: nextProps.data.isFocus,
            isHave: nextProps.data.isHave
        })
    }

    focusLive = async () => {
        let result = await api('/api/wechat/channel/live-focus', {
            method: 'GET',
            body: {
                status: 'Y',
                liveId: this.props.data.businessId
            }
        })
        if (result.state.code === 0) {
            this.setState({
                isFocus: 'Y'
            })
        } else {
            ui.toast(result.state.msg);
        }
    }

    getCoupon = async () => {
        const result = await api('/api/wechat/live/bindLiveCoupon',{
			method: 'POST',
			body: {
				codeId: this.props.data.couponId
			}
		})
		if (result.state.code === 0) {
			this.setState({
                isHave: 'Y' //显示优惠券已领取，此处是本地新增的状态值，不计入数据库
            })
		}
		else {
			ui.toast(result.state.msg)
		}
    }

    uiCoupon = () => {
        let {money, liveName, overTime, logo} = this.props.data;
        let {isHave} = this.state;
        return (
            <div>
            <div className="body">
                <div className="coupon">
                    <div className="coupon-money">
                        <span className="unit">¥</span> {parseInt(String(money/100))}
                    </div>
                    <div className="coupon-info">
                        <img className="coupon-img" src={logo}/>
                        <div className="coupon-info-right">
                            <div className="name">
                                {liveName}
                            </div>
                            <div className="intro">
                                适用直播间全部课程
                            </div>
                            <div className="time">
                                { overTime && (new Date(overTime)).toLocaleDateString() + "前使用"}
                            </div>
                        </div>
                    </div>
                </div>
                {
                    isHave === 'Y' ? 
                    <div className="btn-wrap">
                        <div className="btn has-focus">
                            已领取
                        </div>
                    </div> :
                    <div className="btn-wrap" onClick={this.getCoupon}>
                        <div className="btn">
                            立即领券
                        </div>
                    </div>
                }
            </div>
            <div className="footer">
                领取直播间通用券购买更多精彩内容
            </div>
            </div>
        )
    }

    uiLive = () => {
        let {name, headImg} = this.props.data;
        let {isFocus} = this.state;
        return (
            <div>
            <div className="body">
                <img className="avatar" src={headImg}/>
                <div className="nickname">
                    {name}
                </div>
                {
                    isFocus === 'Y' ? 
                    <div className="btn-wrap">
                        <div className="btn has-focus">
                            已关注
                        </div>
                    </div> :
                    <div className="btn-wrap" onClick={this.focusLive}>
                        <div className="btn">
                            立即关注
                        </div>
                    </div>
                }
            </div>
            <div className="footer">
                关注老师直播间了解更多精彩内容
            </div>
            </div>
        )
    }

    cancelClick = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
    }
    
    render () {
        let {isHave} = this.state;
        let {couponId} = this.props.data;
        return (
            <div className="dialog-mask" style={{display: (this.props.show ? '' : 'none')}} onClick={this.props.onClose}>
                <div className="dialog" onClick={this.cancelClick}>
                    <div className="title">
                        <img src={require('../../assets/yes.png')} alt="" className="yes"/>
                        <span>投票成功</span>
                        <div className="close" onClick={this.props.onClose}></div>
                    </div>
                    {
                        !couponId ?  
                            this.uiLive()
                        : 
                        this.uiCoupon()

                    }       
                </div>
            </div>
        )
    }
}