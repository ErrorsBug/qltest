import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getVal,imgUrlFormat, formatMoney } from 'components/util';
import { request } from 'common_actions/common'
import { initConfig } from '../../../../actions/common'

@withStyles(styles)
@autobind
class Barrage extends Component {
    
    state = {
        barrageList: [],
        doingSt: [],
        orderList: [
            {"userName":"朵儿","headImgUrl":"https://img.qlchat.com/qlLive/business/LWFBNG5F-9YK5-DKPT-1573808014323-HQ3VB4PDP9LZ.jpg"},
            {"userName":"迪迪奶奶","headImgUrl":"https://img.qlchat.com/qlLive/business/8TKXWO72-4TCK-RQ4F-1573808016290-WQSHEEBLEOPK.jpg"},
            {"userName":"海燕","headImgUrl":"https://img.qlchat.com/qlLive/business/PJI5TW64-8NWC-877U-1573808018264-HS69QJFEH1DI.jpg"},
            {"userName":"阳光生活","headImgUrl":"https://img.qlchat.com/qlLive/business/UQLJB77I-DDE5-3QZJ-1573808020062-CON2KJFDO3UU.jpg"},
            {"userName":"小鱼儿","headImgUrl":"https://img.qlchat.com/qlLive/business/D4KUDV2C-4KUY-5OSE-1573808021874-91XAILHQROAW.jpg"},
            {"userName":"Lucky","headImgUrl":"https://img.qlchat.com/qlLive/business/UA499DJ3-ALB6-GGKY-1573808024164-X5N2R3C1WQZX.jpg"},
            {"userName":"慧姐","headImgUrl":"https://img.qlchat.com/qlLive/business/8FDQRH79-SPNT-665C-1573808025950-1XELSUUFLRUE.jpg"},
            {"userName":"水灵","headImgUrl":"https://img.qlchat.com/qlLive/business/CX1DI8J1-6ZHD-WC63-1573808057688-8129FFBLFLGF.jpg"},
            {"userName":"糖豆","headImgUrl":"https://img.qlchat.com/qlLive/business/B1BI71QF-2R1K-1JVT-1573808059938-TVWHK45QCZS3.jpg"},
            {"userName":"竹子","headImgUrl":"https://img.qlchat.com/qlLive/business/8ZPCRUBS-Q9NY-9NOV-1573808061798-H39WT7CG7E7C.jpg"},
            {"userName":"细品岁月","headImgUrl":"https://img.qlchat.com/qlLive/business/25P6X7K9-J7XD-E8EU-1573808063593-VCCU9J4SPTZU.jpg"},
            {"userName":"走自己的路","headImgUrl":"https://img.qlchat.com/qlLive/business/CZAKUBJF-BRA7-O7P7-1573808065650-TYBDOG3B4Y49.jpg"},
            {"userName":"燕子","headImgUrl":"https://img.qlchat.com/qlLive/business/K56OWQJF-BSTL-CUMG-1573808067421-M65ADIZD327W.jpg"},
            {"userName":"秋丽","headImgUrl":"https://img.qlchat.com/qlLive/business/LRS9OZOR-2H55-M929-1573808069286-YXJ362AFDQH2.jpg"},
            {"userName":"若雪","headImgUrl":"https://img.qlchat.com/qlLive/business/S9LX2KQR-3223-LGBY-1573808071305-HK41H3ORRZRD.jpg"},
            {"userName":"娟姐","headImgUrl":"https://img.qlchat.com/qlLive/business/4L7NVN19-JHLZ-9UFZ-1573808073831-X9ARFTFBFA4L.jpg"},
            {"userName":"蒋莉","headImgUrl":"https://img.qlchat.com/qlLive/business/KANDPYN3-2A8T-BHR4-1573808076463-TY8IAQDT5GQZ.jpg"},
            {"userName":"candy","headImgUrl":"https://img.qlchat.com/qlLive/business/I4UI7TN5-B2R1-PLEV-1573808079139-EYE1QNDY74WL.jpg"},
            {"userName":"山茶花","headImgUrl":"https://img.qlchat.com/qlLive/business/M2RL79LW-BS3E-KVVS-1573808081209-ZBPY2EHOPBHW.jpg"},
            {"userName":"朱","headImgUrl":"https://img.qlchat.com/qlLive/business/EO7S3HER-PANE-EOXZ-1573808083206-2MAL7738IZ5I.jpg"},
            {"userName":"麦子","headImgUrl":"https://img.qlchat.com/qlLive/business/VJL2G9OY-Y4EB-9X9Z-1573808086071-YNGYMPMAMRZK.jpg"},
            {"userName":"Cat","headImgUrl":"https://img.qlchat.com/qlLive/business/GWB6D25I-8FNN-MP8G-1573808088089-HTAVDVDPCZ1U.jpg"},
            {"userName":"刘利华","headImgUrl":"https://img.qlchat.com/qlLive/business/SIW513QA-YF4N-R1EM-1573808090280-OVB662X8ZA4V.jpg"},
            {"userName":"爱笑的眼睛 ","headImgUrl":"https://img.qlchat.com/qlLive/business/WCQI6KXE-OBME-KE3Q-1573808092264-LSPZZSVDE1WR.jpg"},
            {"userName":"淡然若水","headImgUrl":"https://img.qlchat.com/qlLive/business/YHKV6A4X-WZZ6-DH9M-1573808094204-D17791XOJRXH.jpg"},
            {"userName":"lili🌹","headImgUrl":"https://img.qlchat.com/qlLive/business/PH7O1AXE-PAXB-L893-1573808096942-VV2NJCK7LMLY.jpg"},
            {"userName":"师慧","headImgUrl":"https://img.qlchat.com/qlLive/business/L8AOVW68-H7RV-ZGWG-1573808099354-78R9J74I94LM.jpg"},
            {"userName":"梁芸","headImgUrl":"https://img.qlchat.com/qlLive/business/7MPG538S-5TXC-P6US-1573808101956-ZHDFPS84B7N9.jpg"},
            {"userName":"刘一玲","headImgUrl":"https://img.qlchat.com/qlLive/business/SBUEYSS1-EAAE-B51G-1573808104271-DT3ELH2Y48KO.jpg"},
            {"userName":"珠珠","headImgUrl":"https://img.qlchat.com/qlLive/business/BI6H3RGM-QLEG-R2BC-1573808107239-QAUMOEE3OYAZ.jpg"},
            {"userName":"赖梦如","headImgUrl":"https://img.qlchat.com/qlLive/business/GHUE5Y8L-Y7EO-EHP9-1573808109377-6FQ99G7A9N1S.jpg"},
            {"userName":"秋霞","headImgUrl":"https://img.qlchat.com/qlLive/business/ZVL5TRIY-NI1U-5ZD3-1573808111352-9G94RUSTS2PF.jpg"},
            {"userName":"黄萍萍","headImgUrl":"https://img.qlchat.com/qlLive/business/9P12YAHP-3T6O-4JL9-1573808113249-PW23OWEOYIEE.jpg"},
            {"userName":"月儿妈","headImgUrl":"https://img.qlchat.com/qlLive/business/LZIKCTRX-1AVF-UTGW-1573808115201-I6PJS2HTYV9W.jpg"},
            {"userName":"邀月","headImgUrl":"https://img.qlchat.com/qlLive/business/4A7WLK2Z-ADR3-G3PH-1573808117244-CNFDQEJ7X5MA.jpg"},
            {"userName":"了了","headImgUrl":"https://img.qlchat.com/qlLive/business/CRESNSI4-74SU-86C2-1573808119649-SSUQNU4JHVTK.jpg"},
            {"userName":"July","headImgUrl":"https://img.qlchat.com/qlLive/business/DC5S2G3P-FDOC-GGHO-1573808121760-HDYBG79OUFF1.jpg"},
            {"userName":"似水流年","headImgUrl":"https://img.qlchat.com/qlLive/business/FTIM78U9-STKC-CYHT-1573808123842-6Y3JX284FKR9.jpg"},
            {"userName":"Mo.","headImgUrl":"https://img.qlchat.com/qlLive/business/WMTUFO64-AH4H-5K25-1573808125935-WAG6R9F6I9L7.jpg"},
            {"userName":"我叫Angel","headImgUrl":"https://img.qlchat.com/qlLive/business/RZTFE5DA-NHAL-NHZ6-1573808128063-ETLI9BEQGSEG.jpg"},
            {"userName":"Lily","headImgUrl":"https://img.qlchat.com/qlLive/business/5TXA86Z2-WT8X-DZC5-1573808130220-TLLFFR17EBS9.jpg"},
            {"userName":"静静","headImgUrl":"https://img.qlchat.com/qlLive/business/MA665SIH-CMBE-MPUM-1573808132814-ZR5XTDMYZ3TD.jpg"},
            {"userName":"宝宝妈妈","headImgUrl":"https://img.qlchat.com/qlLive/business/PFRXYRBF-VQL2-YLB5-1573808135170-FDYNUB9R4TAH.jpg"},
            {"userName":"几重山水","headImgUrl":"https://img.qlchat.com/qlLive/business/1U646BI8-BSPE-LMW7-1573808137027-EOWCDJLDSP7Z.jpg"},
            {"userName":"小谢","headImgUrl":"https://img.qlchat.com/qlLive/business/BSG4JLF4-5UHH-DRQQ-1573808139208-U9Y9LWB9JPG4.jpg"},
            {"userName":" 南半球的风","headImgUrl":"https://img.qlchat.com/qlLive/business/UB33HQ1D-5793-ZT3I-1573808141628-AOPGCPLJ7XGQ.jpg"},
            {"userName":"影子","headImgUrl":"https://img.qlchat.com/qlLive/business/MZ5PMV11-9AZV-T26V-1573808143771-1I79PPOX2Y73.jpg"},
            {"userName":"子非鱼","headImgUrl":"https://img.qlchat.com/qlLive/business/D1PLCS2U-C5YG-Y6D1-1573808146281-OS8BDSMATLQN.jpg"},
            {"userName":"岁月如歌","headImgUrl":"https://img.qlchat.com/qlLive/business/CLAZ7MQD-Q46J-4W2E-1573808148615-5UKGEYX1HTX9.jpg"},
            {"userName":"小巷晒阳","headImgUrl":"https://img.qlchat.com/qlLive/business/8IDIOT3E-ZPH3-11EE-1573808155870-E4VQRZ6617SW.jpg"},
            {"userName":"为你带盐","headImgUrl":"https://img.qlchat.com/qlLive/business/A9FKBE5F-61DE-2KPT-1573808157988-BD98LIDYYHD4.jpg"} 
        ]
    }
    componentDidMount() {
        this.initData()
    }
    async initData(){
        let doingSt= [`获得了${formatMoney( this.props.scholarship)}元奖学金`,'提现了xxxx元奖学金']
        if(this.props.campType=='ufw_camp'){
            const {UFW_INVITE_AMOUNT} = await initConfig({businessType:'UFW_CONFIG_KEY'})
            doingSt.push(`喜获${UFW_INVITE_AMOUNT}元伯乐奖`)
        }
        await this.setState({
            doingSt
        })
        this.updateBarrage();
    }
    updateBarrage() {
        let odr = this.state.orderList;
        let bl = this.state.barrageList;
        if (!odr.length) {
            return
        }
        let idx = 0;
        const len = this.state.doingSt.length - 1;
        this.barInt = setInterval(() => {
            if (bl.length) {
                bl.splice(0,1);
                this.setState({
                    barrageList: []
                })
            }
            if(odr.length <= idx) {
                idx = 0;
            }
            let _idx = (Math.random() * len).toFixed(0);
            let userInfo = odr[idx];
            idx = idx + 1;
            if(!userInfo.word&&this.state.doingSt){
                userInfo.word = this.state.doingSt[_idx].replace('xxxx',Math.ceil(Math.random()*4500)+500)
            }
            setTimeout( () => {
                bl.push({ ...userInfo })
                this.setState({
                    barrageList: [{ ...userInfo }],
                })
            }, 500)
        },3000)
    }

    loadImg(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url
            img.crossOrigin = 'Anonymous';
            var objectURL = null
            if (url.match(/^data:(.*);base64,/) && window.URL && URL.createObjectURL) {
                objectURL = URL.createObjectURL(dataURL2blob(url))
                url = objectURL
            }
            img.onload = () => {
                objectURL && URL.revokeObjectURL(objectURL)
                resolve(img)
            }
            img.onerror = () => {
                reject(new Error('That image was not found.:' + url.length))
            }
        })
    }

    componentWillUnmount() {
      clearInterval(this.barInt)
    }
 
    
    render() {
        const { isQlchat, className='',  } = this.props;
        return (
            <div className={`${styles['experience-activity-barrage']} ${styles[className]}`}>
                <ReactCSSTransitionGroup
                    transitionName="experience-activity-animation-barrageListItem"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}>
                    {
                        this.state.barrageList.map((std,idx) => {
                            return (
                                <div className={`${styles['barrage-item']}`} key={`${ std.word }-${idx}`}>
                                    <img src={imgUrlFormat(std.headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} />
                                    <span><b>{std.userName}</b>{std.word}</span>
                                </div>
                            )
                        })
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

Barrage.propTypes = {

};

export default Barrage;