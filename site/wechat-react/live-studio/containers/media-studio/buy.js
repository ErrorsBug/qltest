import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { locationTo } from 'components/util';
import Detect from '../../../components/detect';
import { formatDate } from '../../../components/util';
import { doPay } from 'common_actions/common'
import { createLiveroom } from '../../actions/coupon'

@autobind
class MediaStudioBuy extends Component {
    data = {
        liveId: '',
    }

    doPayCallback(){
        console.log('pay callback invoked');
        locationTo(`/wechat/page/media-studio-paid`);
    }

    makeOrder(){
        if (this.props.isLiveMedia) {
            window.toast('您已经拥有自媒体版直播间，无需重复购买');
            return ;
        }
        this.props.doPay({
            userId: this.props.userInfo.userId,
            liveId: this.props.liveId || this.data.liveId,
            type: this.props.isLiveAdmin === 'Y' ? 'SELF_MEDIA_UPDATE' : 'SELF_MEDIA_BUY',
            total_fee: 1024,
            callback: this.doPayCallback
        });
    }

    componentDidMount = async () => {
        // 如果当前用户没有直播间，则为Ta先创建一个默认的基础班直播间
        if (this.props.isLiveAdmin === null) {
            const result = await this.props.createLiveroom();
            if (result.state && result.state.code === 0) {
                const liveId = result.data.liveId;
                this.data.liveId = liveId;
            } else {
                console.log('创建默认直播间失败');
            }
        }
    }

    render(){
        const {userInfo, isLiveAdmin, isLiveMedia, livePrice} = this.props;
        return (
            <Page title="服务升级" className="media-studio-container">
                {/* 头部：版本信息 */}
                <header className="media-studio-header">
                    <div className="header-item">
                        <span className="header-tip">账号</span>
                        <div className="header-detail">
                            <img className="head-image" src={userInfo.headImgUrl} alt={userInfo.username}/>
                            <div className="studio-info">
                                <span className="username">{userInfo.username}</span>
                                {
                                    isLiveMedia || isLiveAdmin === 'Y' ? 
                                        <div className="org-edition-wrap">
                                            <span className="edition-tip">当前版本:</span><span className="org-edition">{isLiveMedia ? '自媒体版' : '专业版'}</span><span className="vertical-separator">|</span><span className="overdue-date">{formatDate(this.props.liveAdminOverDue,'yyyy/MM/dd')}到期</span>
                                        </div>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className="header-item">
                        <span className="header-tip">版本</span>
                        <div className="header-detail">
                            <div className="media-edition-text">千聊自媒体版</div>
                            {
                                !isLiveMedia && isLiveAdmin === 'Y' ?
                                    <div className="price">
                                        <span className="price-delta"><i className="icon-rmb">￥</i>{livePrice.selfMediaUpdate}</span>
                                        <span className="price-original">￥{livePrice.selfMediaBuy}</span>
                                    </div>
                                :
                                    <div className="price">
                                        <span className="price-delta"><i className="icon-rmb">￥</i>{livePrice.selfMediaBuy}</span>
                                    </div>
                            }
                        </div>
                    </div>
                </header>
                {/* 自媒体版本的优势 */}
                <div className="media-edition-wrap">
                    <div className="media-edition-intro">
                        <h1 className="media-tip">千聊自媒体版</h1>
                        <p>千聊自媒体版，专业为自媒体打造专属知识店铺，独具“知识通商城”，链接千聊平台优质内容和流量渠道，为自媒体量身定制内容变现解决方案!</p>
                    </div>
                    <div className="media-edition-benefits">
                        <h1 className="media-tip">您将获得:</h1>
                        <ul className="benefits-list">
                            <li>
                                <div className="benifit-icon icon-shop"></div>
                                <div className="benefit">
                                    <h1>知识店铺</h1>
                                    <span>一键搭建知识店铺，打造独立内容品牌</span>
                                </div>
                            </li>
                            <li>
                                <div className="benifit-icon icon-mall"></div>
                                <div className="benefit">
                                    <h1>知识通商城</h1>
                                    <span>无限分发热门领域优质内容，从零开始知识变现</span>
                                </div>
                            </li>
                            <li>
                                <div className="benifit-icon icon-fans"></div>
                                <div className="benefit">
                                    <h1>粉丝独立</h1>
                                    <span>自有粉丝不会流失，并可不断获取外部优质粉丝</span>
                                </div>
                            </li>
                            <li>
                                <div className="benifit-icon icon-analysis"></div>
                                <div className="benefit">
                                    <h1>数据分析</h1>
                                    <span>多维数据监测，精准触达粉丝</span>
                                </div>
                            </li>
                            <li>
                                <div className="benifit-icon icon-market"></div>
                                <div className="benefit">
                                    <h1>超强营销</h1>
                                    <span>加快粉丝裂变，提升转化率，做大知识变现事业</span>
                                </div>
                            </li>
                            <li>
                                <div className="benifit-icon icon-flow"></div>
                                <div className="benefit">
                                    <h1>流量扶持</h1>
                                    <span>平台1.2亿内容用户精准投放，加速知识变现</span>
                                </div>
                            </li>
                            <li>
                                <div className="benifit-icon icon-vip"></div>
                                <div className="benefit">
                                    <h1>特权专享</h1>
                                    <span>专业运营指导，共享平台资源</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* 购买须知 */}
                <div className="purchase-tips-wrap">
                    <h1 className="media-tip">购买须知</h1>
                    <div className="purchase-tips">
                        <div className="purchase-tip">
                            <div className="number-icon">1</div>
                            <div className="purchase-tip-text">开通后，由运营人员为您设置分成比例，即可马上进入知识通商城，选择优质内容进行转载。</div>
                        </div>
                        <div className="purchase-tip">
                            <div className="number-icon">2</div>
                            <div className="purchase-tip-text">专业版用户只需补充{livePrice.selfMediaUpdate}元，即可完成升级，有效期为开通成功后1年。</div>
                        </div>
                    </div>
                </div>
                {/* 购买按钮 */}
                <div className="purchase-button-wrap">
                    <button type="button" className="purchase-button" onClick={this.makeOrder}>{!isLiveMedia && isLiveAdmin === 'Y' ? `${livePrice.selfMediaUpdate}元升级` : '立即开通'}</button>
                </div>
            </Page>
        )
    }
}

function mapStateToProps(state){
    return {
        userInfo: state.common.userInfo,
        liveId: state.common.liveId,
        livePrice: state.common.livePrice,
        isLiveMedia: state.common.isLiveMedia,
        isLiveAdmin: state.common.isLiveAdmin,
        liveAdminStart: state.common.liveAdminStart,
        liveAdminOverDue: state.common.liveAdminOverDue,
    }
}

const mapDispatchToProps = {
    doPay,
    createLiveroom,
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaStudioBuy);
