
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Picture from 'ql-react-picture';

import Page from 'components/page';

import { request } from 'common_actions/common';
import { locationTo } from 'components/util';
import { autobind } from 'core-decorators';

function mapStateToProps (state) {
	return {
	}
}

const mapActionToProps = {
};

@autobind
class GiftDetail extends Component {

    state = {
        giftInfo: null
    }

	componentWillMount () {
        this.initDetails()
    }
    
    async initDetails () {
		const res = await request({
			url: '/api/wechat/point/giftInfo',
			method: 'POST',
			body: {
                giftId: this.props.location.query.giftId
			}
        });

        const giftInfo = res && res.state.code === 0 && res.data.giftInfo

        if (!giftInfo || giftInfo.status === 'N') {
            locationTo(`/wechat/page/link-not-found`);
            return
        }

        this.setState({
            giftInfo
        }, () => {
            setTimeout(() => {
                typeof _qla != 'undefined' && _qla.collectVisible();
            }, 0);
        })
    }

    async exchangeGift () {
		const res = await request({
			url: '/api/wechat/point/exchangeGift',
			method: 'POST',
			body: {
                giftId: this.props.location.query.giftId
			}
        });
        
        if (res && res.state.code === 0) {
            if (res.data.result === 'fail') {
                window.toast(res.data.msg)
                return
            }

            window.toast('兑换成功')
            this.setState({
                giftInfo: { ...this.state.giftInfo, receiveStauts: 'R' }
            })
        }
    }

	render() {

        const { giftInfo } = this.state
		return giftInfo ? (
			<Page title="奖品详情" className='gift-detail-page'>
                <div className="container">
                    <div className="header">
                        <div className="poster">
                            <Picture src={`${giftInfo.headImageUrl}?x-oss-process=image/resize,m_fill,limit_0,h_466,w_750`} /> 
                        </div>
                        <p className="title">{giftInfo.giftName}</p>
                        <span className="line-1"></span>
                    </div>

                    <div className="section">
                        <p className="section-title">礼品详情</p>
                        <div className="section-content">
                            <p className="mark">{giftInfo.remark}</p>

                            {
                                giftInfo.descriptionDtos && giftInfo.descriptionDtos.length > 0 && (
                                    <div className="pic-list">
                                        {
                                            giftInfo.descriptionDtos.map( item => <Picture src={item.description} />)
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div> 
                </div>
                <div className="footer">
                    {
                        giftInfo.receiveStauts === 'R' ? (
                            <span 
                                className="btn on-log on-visible" 
                                data-log-region="exchange-gift-btn"
                                data-log-pos="see"
                                onClick={ () => locationTo(giftInfo.url) }
                                >查看我的礼品</span>
                        ) : giftInfo.receiveStauts === 'Y' ? (
                            <span 
                                className="btn on-log on-visible"
                                data-log-region="exchange-gift-btn"
                                data-log-pos="exchange"
                                onClick={ this.exchangeGift }
                                >{giftInfo.changePoint}学分兑换</span>
                        ) : (
                            <span 
                                className="btn disable on-visible"
                                data-log-region="exchange-gift-btn"
                                data-log-pos="not-enough"
                                >学分不足</span>
                        )
                    }
                </div>
			</Page>
		) : null
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(GiftDetail);