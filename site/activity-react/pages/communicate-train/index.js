import * as React from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
import Page from '../../components/page';
import { doPay, getChannelConfigs, getCourseList } from '../../components/common';
import { locationTo, getUrlParam } from '../../utils/util';
import './style.scss';
import { share } from '../../utils/wx-utils';
import QRCode from 'qrcode.react';
import Detect from '../../utils/detect';

@autobind
class CommunicateTrain extends React.Component {
	/** 页面初始化数据 */
	state = {
        showPayDialog: false,
        qrcodeUrl: '',
        qrCodeBase64: '',
	};
	data = {
        block1: {
            liveId: '530000037180931',
            channelId: '2000001509583525',
            title: '高情商聊天术，5招彻底治愈你嘴笨',
            name: '魏雯 | 人际关系训练师，资深撰稿人',
            liveName: '千聊课堂',
            studyNum: 46896,
            courseNum: 5,
            price: 6.9,
            imgUrl: require('./imgs/weiwen.png'),
            jumpUrl: 'http://t.qianliao.tv/SOYTZ1RP'
        },
        block2: [
            {
                liveId: '530000037180931',
                channelId: '2000001563972856',
                title: '营销高手的6节赞美课，人缘好、机会多、拿大单',
                studyNum: 2187,
                courseNum: 5,
                price: 6.9,
                imgUrl: require('./imgs/block-2-1.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1RQ'
            },
            {
                liveId: '530000037180931',
                channelId: '2000001551467443',
                title: '不是领导，也能撬动资源',
                studyNum: 324,
                courseNum: 5,
                price: 6.9,
                imgUrl: require('./imgs/block-2-2.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1RS'
            }
        ],
        block3: {
            liveId: '530000037180931',
            channelId: '2000001480788603',
            title: '麦肯锡员工必修课',
            studyNum: 4177,
            courseNum: 5,
            price: 6.9,
            imgUrl: require('./imgs/block-3.png'),
            jumpUrl: 'http://t.qianliao.tv/SOYTZ1RT'
        },
        block4: {
            liveId: '530000037180931',
            channelId: '2000001519712534',
            title: '6步向上沟通法，在老板面前脱颖而出',
            name: '丁健 | 思维训练师 资深撰稿人',
            studyNum: 1790,
            courseNum: 6,
            price: 6.9,
            imgUrl: require('./imgs/block-4.png'),
            jumpUrl: 'http://t.qianliao.tv/SOYTZ1RU'
        },
    };
	cache = {};

	componentDidMount(){

		this.initShare(); 

        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);
	}

	initShare() {
        const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/album?albumId=0000000001`
        share({
            title: '高情商职场沟通强训课',
            desc: '不用大段时间，不用昂贵学费，抛开晦涩理论。高效有用，手把手教你怎么说，怎么做。独创听觉记忆法，深度借鉴课堂教学设计，专门解决“听完记不住”。',
            shareUrl,
            imgUrl: window.location.protocol + require('./imgs/share-logo.png')
        });
	}

    renderCard1 (item) {
        return (
            <div className="card-1">
                <div className="poster img-box flex-0">
                    <img src={ item.imgUrl } alt=""/>
                </div>
                <div className="info flex-1">
                    <p className="title">{ item.title }</p>
                    <div className="flex-1">
                        <p className="name">{ item.name }</p>
                        <p className="liveName">{ item.liveName }</p>
                    </div>
                    <p className="desc">{ `${item.studyNum}次学习 | 共${item.courseNum}课` }</p>

                    <p className="buy price-btn on-log"
                       data-log-region="album-list-btn"
                       data-log-business_id={item.channelId}
                       data-log-pos="pay-1"
                       onClick={ (e) => { this.doPay(e, item) }}>{ item.price }</p>
                </div>
            </div>
        )
    }

    renderCard2 (item, index) {
        return (
            <div className="card-2 on-log on-visible"
                 key={index}
                 data-log-region="album-list"
                 data-log-pos={ `card-${index + 2}` }
                 onClick={ () => { this.jump(item) }}>
                <div className="poster img-box">
                    <img src={ item.imgUrl } alt=""/>
                    <p className="studyCount flex-1">{ `${item.studyNum}次学习` }</p>
                </div>
                <div className="info flex-1">
                    <p className="title">{ item.title }</p>
                    <p className="buy price-btn on-log"
                       data-log-region="album-list-btn"
                       data-log-business_id={item.channelId}
                       data-log-pos={ `pay-${index + 2}` }
                       onClick={ (e) => { this.doPay(e, item) }}>{ item.price } <span className="label">共{ item.courseNum}课</span></p>
                </div>
            </div>
        )
    }

    renderCard3 (item) {
        return (
            <div className="card-3">
                <div className="poster img-box">
                    <img src={ item.imgUrl } alt=""/>
                </div>
                <div className="info">
                    <div>
                        <p className="title">{ item.title }</p>
                        <p className="desc">{ `共${item.courseNum}课 | ${item.studyNum}次学习` }</p>
                    </div>
                    <p className="buy price-btn on-log"
                       data-log-region="album-list-btn"
                       data-log-business_id={item.channelId}
                       data-log-pos="pay-4"
                       onClick={ (e) => { this.doPay(e, item) }}>{ item.price }</p>
                </div>
            </div>
        )
    }
    
    renderCard4 (item) {
        return (
            <div className="card-4">
                <div className="poster img-box flex-0">
                    <img src={ item.imgUrl } alt=""/>
                    <p className="studyCount flex-1">{ `${item.studyNum}次学习` }</p>
                </div>
                <div className="info flex-1">
                    <p className="title">{ item.title }</p>
                    <div className="flex-1">
                        <p className="name">{ item.name }</p>
                    </div>
                    <p className="desc">{ `共${item.courseNum}课` }</p>

                    <p className="buy price-btn on-log"
                       data-log-region="album-list-btn"
                       data-log-business_id={item.channelId}
                       data-log-pos="pay-5"
                       onClick={ (e) => { this.doPay(e, item) }}>{ item.price }</p>
                </div>
            </div>
        )
    }
    
    /**
     * 二维码弹框点击判断
     * @param {Event} e
     */
    onQrCodeTouch (e) {
        const event = e.nativeEvent;
        const appDom = document.querySelector('#app');
        const qrConfirm = document.querySelector('.qrcode-wrap');

        const qrHeight = qrConfirm.clientHeight;
        const qrWidth = qrConfirm.clientWidth;
        const appHeight = appDom.clientHeight;
        const appWidth = appDom.clientWidth;
        const pointX = event.changedTouches[0].clientX;
        const pointY = event.changedTouches[0].clientY;

        const top = (appHeight - qrHeight) / 2;
        const bottom = (appHeight - qrHeight) / 2 + qrHeight;
        const left = (appWidth - qrWidth) / 2;
        const right = (appWidth - qrWidth) / 2 + qrWidth;

        if (pointX > right || pointX < left || pointY > bottom || pointY < top) {
            this.closePayDialog();
        }
    }

    async doPay (e, item) {
        e.stopPropagation();

        const configs = await getChannelConfigs({channelId: item.channelId})

        const chargeConfig = configs.chargeConfigs.filter(config => {
            return config.status === 'Y';
        })[0] || null

        doPay({
            liveId: item.liveId,
            channelId: item.channelId,
            type: 'CHANNEL',
            topicId: '0',
            channelNo: 'qldefault',
			ch: getUrlParam('ch') || getUrlParam('wcl') || '',
            chargeConfigId: chargeConfig && chargeConfig.id || '',
            total_fee: chargeConfig && (chargeConfig.discountStatus === 'Y' ? chargeConfig.discount : chargeConfig.amount) || 0,
            qrToggle: (qcodeUrl) => {
                if (qcodeUrl) {
                    this.showPayDialog(qcodeUrl)
                } else {
                    this.closePayDialog()
                }
            },
            callback: async () => {
                const result = (await getCourseList(item.channelId, '', 1, 1))[0]

                if (!result) {
                    locationTo(`/wechat/page/channel-intro-cend-auth?channelId=${item.channelId}`)
                    return
                } else {
                    locationTo(`/wechat/page/topic-intro-cend-auth?topicId=${result.id}`)
                }
            }
        })
    }

    showPayDialog (qrcodeUrl) {
        this.setState({
            showPayDialog: true,
            qrcodeUrl,
        }, () => {
            const canvas = this.refs['qr-canvas'].getElementsByTagName('canvas')[0]
            const qrCodeBase64 = canvas.toDataURL('image/png')
            this.setState({
                qrCodeBase64
            })
        });
    }

    closePayDialog () {
        this.setState({
            showPayDialog: false
        })
    }

    jump (item) {
        locationTo(item.jumpUrl)
    }

	render(){
        const { block1, block2, block3, block4 } = this.data
		return ( 
			<Page title='专题课程' className="co-scroll-to-load">

                <div className="communicate-train-page">
                
                    <div className="bg img-box">
                        <img src={ require('./imgs/bg.png') } alt=""/>
                    </div>
                    
                    <div className="content">
                        <div className="block on-log on-visible"
                             data-log-region="album-list"
                             data-log-pos="card-1"
                             onClick={ () => { this.jump(block1) }}>
                            <div className="block-title img-box">
                                <img src={ require('./imgs/title-1.png') } alt=""/>
                            </div>

                            <div className="block-content mr">
                                {
                                    this.renderCard1(block1)
                                }
                            </div>
                        </div>

                        <div className="block">
                            <div className="block-title img-box">
                                <img src={ require('./imgs/title-2.png') } alt=""/>
                            </div>
                            
                            <div className="block-content p20 ml row">
                                {
                                    block2.map((item, index) => this.renderCard2(item, index))
                                }
                            </div>
                        </div>

                        <div className="block on-log on-visible"
                             data-log-region="album-list"
                             data-log-pos="card-4"
                             onClick={ () => { this.jump(block3) }}>
                            <div className="block-title img-box">
                                <img src={ require('./imgs/title-3.png') } alt=""/>
                            </div>
                            
                            <div className="block-content mr">
                                {
                                    this.renderCard3(block3)
                                }
                            </div>
                        </div>

                        <div className="block on-log on-visible"
                             data-log-region="album-list"
                             data-log-pos="card-5"
                            onClick={ () => { this.jump(block4) }}>
                            <div className="block-title img-box">
                                <img src={ require('./imgs/title-4.png') } alt=""/>
                            </div>
                            
                            <div className="block-content ml">
                                {
                                    this.renderCard4(block4)
                                }
                                <div className="additional">
                                    <p>1. 向上汇报抓重点，三秒钟引起老板注意</p>
                                    <p>2. 如何用正确的方法和老板谈加薪…</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={ `pay-dialog ${this.state.showPayDialog ? '' : 'none'}` }>
                    <div className="mark" onClick={ this.closePayDialog }></div>
                    <div className="content">
                        <p className="title">使用微信扫码支付</p>
                        <main>
                            <div className='qrcode-wrap' ref="qr-canvas">
                                <img
                                    style={{pointerEvents: !Detect.os.phone && 'none'}}
                                    className='qrcode-image'
                                    onTouchStart={this.onQrCodeTouch.bind(this)}
                                    src={this.state.qrCodeBase64} />

                                <QRCode
                                    style={{display: 'none'}}
                                    value={this.state.qrcodeUrl} />
                                <p className='qrcode-tip'>扫描二维码，识别图中二维码</p>
                            </div>
                        </main>
                    </div>
                </div>

			</Page>
		)
	}
}
render(<CommunicateTrain />, document.getElementById('app'));