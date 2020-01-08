import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../modal';
import LoginQr from '../login-qr';
import {autobind} from 'core-decorators'
import { setPromotionModalShow } from "../../actions/common";
import { YorN } from '../../models/course.model';
import * as styles from './style.scss';
import { Tabs,Radio } from 'antd';
import {pushDistributionCardMaking} from './post-card';
import Clipboard from 'clipboard';
import { getVal, imgUrlFormat } from "../util";
import { apiService } from '../api-service';
import QRCode from 'qrcodejs2';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface setPromotionModalShow {
    (show: YorN): void;
}

export interface ModalPromotionProps {
    setPromotionModalShow: setPromotionModalShow;
    showPromotionModal: any;
    promotionData: any;
    channelInfo: any;
    userIdentity: string;
}

@autobind
class ModalPromotion extends React.Component<ModalPromotionProps, any> {
    constructor(props) {
        super(props)
    }

    state={
        sharedata:{},
        // activeKey:1,
        // activeNum: "1",
        curPanel: 'distribution',
        haibao2: null,
        haibao1: null,
        qrcodeUrl: '',
        // 推广二维码图片的Base64链接
        base64OfPromoteQrcode: '',
    };

    data = {
        // 缓存推广二维码图片的Base64链接
        promoteQrcodes: {}
    }

    /**
     * 获取需要展示的二维码的图片URL
     * @param data {object} 推广系列课信息
     */
    getQr(data) {
        apiService.post({
            url: '/h5/live/getQr',
            body: {
                channel: 'knowledgeQr',
                channelId: data.businessId,
            },
            showError: true,
        }).then(result => {
            if (result.state.code === 0) {
                this.setState({
                    qrcodeUrl: result.data.qrUrl
                }, () => {
                    // 绘制推广海报
                    this.getShareCard(data);
                });
            } else {
                console.error(result.state.msg);     
            }
        }).catch(result => {
            console.error(result.state.msg);
        });
    }

    /** 
     * 生成推广二维码图片的Base64链接
     * @param {Object} props - 组件props对象
     * @param {Function} callback - 回调函数
    */
    generatePromoteQrcode(props, callback) {
        const channelId = props.promotionData.data.businessId;
        if (!channelId) {
            return;
        }
        const channelUrl = `${window.location.origin}/live/channel/channelPage/${channelId}.htm`;
        const cacheSrc = this.data.promoteQrcodes[channelId];
        if (cacheSrc) {
            this.setState({
               base64OfPromoteQrcode: cacheSrc 
            }, callback);
        } else {
            const options = {
                width: 300,
                height: 300
            };
            const div = document.createElement('div');
            const qrcode = new QRCode(div, options);
            qrcode.makeCode(channelUrl);
            setTimeout(() => {
                const src = div.querySelector('img').src;
                this.data.promoteQrcodes[channelId] = src;
                this.setState({
                    base64OfPromoteQrcode: src
                }, callback);
            }, 0);
        }
    }

    componentDidMount() {
        //复制链接
        var clipboard = new Clipboard("#copy");   
        clipboard.on('success', function(e) {
            window.message.success('复制成功！');
        });  
        clipboard.on('error', function(e) { 
            window.message.error('复制失败！请手动复制');
        });
    }

    componentWillUpdate(nextProps){
        const curBusinessId = getVal(this, 'props.promotionData.data.businessId', '');
        const nextBusinessId = getVal(nextProps, 'promotionData.data.businessId', '');
        // console.log(this.props.promotionData.datas.businessId, nextProps.promotionData.datas.businessId)
        // console.log(curBusinessId, nextBusinessId)
        if(curBusinessId !== nextBusinessId){
            this.setState({
                sharedata:nextProps.promotionData.data,
                activeNum:nextProps.activeNum,
            });
            // this.getQr(nextProps.promotionData.data);
            this.generatePromoteQrcode(nextProps, () => {
                this.getShareCard(nextProps.promotionData.data);
            });
        }
    }

    async getShareCard(sharedata){
        pushDistributionCardMaking("",sharedata,this.setImgFunc1.bind(this), true,"H",900,475,this.state.base64OfPromoteQrcode);
        // pushDistributionCardMaking("", sharedata, this.setImgFunc1.bind(this), true, "H", 900, 475, this.state.qrcodeUrl);
    }

    setImgFunc1(url){
        this.setState({
            haibao1:url,
        });
        pushDistributionCardMaking("",this.state.sharedata,this.setImgFunc2.bind(this), true,"W",900,970,this.state.base64OfPromoteQrcode);
        // pushDistributionCardMaking("",this.state.sharedata,this.setImgFunc2.bind(this), true,"W",900,970, this.state.qrcodeUrl);
    }
    setImgFunc2(url){
        this.setState({
            haibao2:url,
        });
    }

    closeModal() {
        this.props.setPromotionModalShow('N');
        this.setState({ curPanel: 'distribution'})
    }

    onRadioChange(e) {
        // console.log(e.target.value)
        this.setState({ curPanel: e.target.value})
    }
    render() {
        const { 
            tweetId,
            reprintLiveId,
            reprintLiveName,
            reprintChannelId,
            reprintChannelName,
            reprintChannelImg,
            reprintChannelAmount,
            reprintChannelDiscount,
            selfMediaPercent,
            selfMediaProfit,
            chargeMonths,
            discountStatus,
        } = this.props.channelInfo;


        const priceTag = discountStatus === 'Y' ? "特惠" : "售价";
        let priceAmount = '0';
        if (chargeMonths != 0) {
            priceAmount =  reprintChannelAmount + "/" + chargeMonths + "月";
        } else {
            priceAmount = discountStatus === 'Y' ? reprintChannelDiscount : reprintChannelAmount;
        }
        const priceTip = this.props.userIdentity === 'super-agent' ? '' : `分成比例 ${selfMediaPercent != 0 ? selfMediaPercent + '%' : '70%'}`

        return (
            <Modal
                header={{
                    title: '推广课程',
                    type: 'SMALL',
                    show: 'Y',
                    showCloseBtn: 'Y',
                }}
                show={this.props.showPromotionModal} 
                onClose={this.closeModal}
                className={styles.pushDailog}
                >   
                    <div className={styles.reprintChannelDetail}>
                        <div className={styles.headImg} style={{backgroundImage: `url(${imgUrlFormat(reprintChannelImg, "?x-oss-process=image/resize,m_fill,limit_0,h_122,w_200")})`}} ></div>
                        <div className={styles.right}>
                            <div className={styles.title}>{reprintChannelName}</div>
                            <div className={styles.bottomInfo}>
                                <div className={styles.price}>{`${priceTag}：￥${priceAmount}（${priceTip}）`}</div>
                                <div className={styles.income}>预计收益：<span className={styles.money}>￥{selfMediaProfit}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.radioArea}>
                        <RadioGroup onChange={this.onRadioChange} defaultValue="distribution">
                            <RadioButton value="distribution">分销推广</RadioButton>
                            <RadioButton value="post">推广海报</RadioButton>
                        </RadioGroup>
                    </div>
                    <div className={styles.contentArea}>
                        {
                            this.state.curPanel === 'distribution' ? 
                            <div className={styles.distributeFuncRow}>
                                <div className={styles.distributeFuncBox}>
                                    <div className={styles.contentDetial}>
                                        <div className={styles.title}>方式1：推广链接</div>
                                        <div className={styles.tips}>分享此链接完成购买即可获得收益</div>
                                        <div className={styles.url}>{this.props.promotionData.shareUrl}</div> 
                                    </div>
                                    <div className={`${styles.saveBox}`}><span id="copy" data-clipboard-text={`${window.location.origin}/live/channel/channelPage/${this.props.promotionData.data.businessId}.htm`}>复制链接</span></div>
                                </div>
                                <div className={styles.distributeFuncBox}>
                                    <div className={styles.contentDetial}>
                                        <div className={styles.title}>方式2：推广二维码</div>
                                        <div className={styles.tips}>您的转载课专属二维码，学员扫码购买后，您可获得收益。</div>
                                        {/* <div className={styles.qr}>
                                            <img src={this.state.qrcodeUrl} alt=""/>
                                        </div> */}
                                        <div className={styles.qr}><img src={this.state.base64OfPromoteQrcode} alt=""/></div>
                                    </div>
                                    {/* <div className={styles.saveBox}><a href={this.state.qrcodeUrl} download="推广二维码">点击保存</a></div> */}
                                    <div className={styles.saveBox}><a href={this.state.base64OfPromoteQrcode} download="推广二维码">点击保存</a></div>
                                </div>
                            </div> :
                            <div className={styles.distributeFuncRow}>
                                <div className={styles.distributeFuncBox}>
                                    <div className={styles.contentDetial}>
                                        <div className={styles.title}>方式1：横版推广海报</div>
                                        <div className={styles.tips}>900px × 475px</div>
                                        <img className={styles.haibao1} src={imgUrlFormat(this.state.haibao1, "?x-oss-process=image/resize,m_fill,limit_0,h_149,w_282")} alt=""/>
                                    </div>
                                    <div className={styles.saveBox}><a href={this.state.haibao1} download="横版推广海报">保存海报</a></div>
                                </div>
                                <div className={styles.distributeFuncBox}>
                                    <div className={styles.contentDetial}>
                                        <div className={styles.title}>方式2：竖版推广海报</div>
                                        <div className={styles.tips}>900px × 475px</div>
                                        <img className={styles.haibao2} src={imgUrlFormat(this.state.haibao2, "?x-oss-process=image/resize,m_fill,limit_0,h_305,w_282")} alt=""/>
                                    </div>
                                    <div className={styles.saveBox}><a href={this.state.haibao2} download="竖版推广海报">保存海报</a></div>
                                </div>
                            </div>

                        }
                    </div>
            </Modal>
        );
    }

}

const mapState2Props = state => {
    return {
        showPromotionModal: state.common.modal.showPromotionModal,
        promotionData: state.course.promotionData,
        channelInfo: state.course.reprintChannelInfo,
        userIdentity: state.common.userIdentity,
    };
}

const mapActionToProps = {
    setPromotionModalShow
}

export default connect(mapState2Props,mapActionToProps)(ModalPromotion);
