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
class ChineseAlbum extends React.Component {
	/** 页面初始化数据 */
	state = {
        showPayDialog: false,
        qrcodeUrl: '',
        qrCodeBase64: '',
	};
	data = {
        list: [
            {
                liveId: '850000093324594',
                channelId: '2000001522323191',
                title: '从握笔开始，15天写好150个小学生基础字',
                name: '执笔规范/书写技巧/陶冶情操/提升审美',
                studyNum: 84000,
                courseNum: 15,
                price: 9.9,
                imgUrl: require('./imgs/course-1.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1Sz'
            },
            {
                liveId: '80000034071237',
                channelId: '230000517166809',
                title: '每天5分钟，轻松解决拼音学习中的发音难点',
                name: '拼音图片化/记忆动作化/枯燥有趣化',
                studyNum: 43000,
                courseNum: 54,
                price: 19.9,
                imgUrl: require('./imgs/course-2.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1T0'
            },
            {
                liveId: '2000000096351804',
                channelId: '2000001218246241',
                title: '告别死记硬背，朗诵名家精讲60首必背古诗词',
                name: '零差评/内容精/讲解全/诵读乐/轻松学',
                studyNum: 50000,
                courseNum: 60,
                price: 29.9,
                imgUrl: require('./imgs/course-3.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1T1'
            },
            {
                liveId: '2000000065099086',
                channelId: '2000000263484386',
                title: '15个历史故事，给孩子不一样的认知与收获',
                name: '通俗易懂/情商塑造/性格培养/分清善恶',
                studyNum: 28000,
                courseNum: 15,
                price: 19.9,
                imgUrl: require('./imgs/course-4.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1T3'
            },
            {
                liveId: '310000078264419',
                channelId: '2000001040355577',
                title: '边玩边学，最具创造力的道德启蒙课《弟子规》',
                name: '三字韵文/朗朗上口/增强语感/文明礼仪',
                studyNum: 32000,
                courseNum: 50,
                price: 29.9,
                imgUrl: require('./imgs/course-5.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1T4'
            },
            {
                liveId: '310000078264419',
                channelId: '2000000909095497',
                title: '50堂最常用的成语课，让孩子听完就能用',
                name: '场景化教学/有趣过瘾/专业的音效制作',
                studyNum: 46000,
                courseNum: 50,
                price: 29.9,
                imgUrl: require('./imgs/course-6.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1T6'
            },
            {
                liveId: '260000186028670',
                channelId: '2000001361163000',
                title: '39个知识点，从字词造句到成文轻松提高孩子写作能力',
                name: '9种写好句子的方法/15个写好段落的基本功',
                studyNum: 18000,
                courseNum: 39,
                price: 49,
                imgUrl: require('./imgs/course-7.png'),
                jumpUrl: 'http://t.qianliao.tv/SOYTZ1T7'
            },
        ]
    }
	cache = {};

	componentDidMount(){

		this.initShare(); 

        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);
	}

	initShare() {
        const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/album?albumId=0000000002`
        share({
            title: '千聊暑期语文特训课',
            desc: '七大主题，提升孩子朗读、表达、想象、写作等能力，让孩子从此爱上有趣实用的语文',
            shareUrl,
            imgUrl: window.location.protocol + require('./imgs/share-logo.png')
        });
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

    renderAlbumItem (item, index) {
        return (
            <div className="album-list-item on-log on-visible"
                 key={index}
                 data-log-region="album-list"
                 data-log-pos={ `card-${index}` }
                 onClick={ () => { this.jump(item) }}>

                <div className="poster ban-click img-box">
                    <img src={ item.imgUrl } alt=""/>
                    <span className="tag">主题<span className="index">{index + 1}</span></span>
                </div>

                <p className="title">{ item.title }</p>
                <p className="name">{ item.name }</p>
                <p className="desc">{ `共${item.courseNum}课 | ${ (item.studyNum / 10000).toFixed(1) }万次学习` }</p>
                <p className="price-btn on-log"
                   data-log-region="album-list-btn"
                   data-log-business_id={item.channelId}   
                   data-log-pos={ `pay-${index}` }
                   onClick={ (e) => { this.doPay(e, item) }}>
                   <span className="price">{ item.price }</span>
                </p>
            </div>
        )
    }

	render(){
        const { list } = this.data
		return ( 
			<Page title='专题课程' className="co-scroll-to-load">

                <div className="chinese-album-page">
                    <div className="img-box ban-click bg">
                        <img src={ require('./imgs/bg.png') } alt=""/>
                    </div>

                    <div className="album-list">
                        {
                            list.length > 0 && list.map((item, index) => this.renderAlbumItem(item, index))
                        }
                    </div>

                    <div className="img-box ban-click bottom">
                        <img src={require('./imgs/bg-bottom.png')} alt=""/>
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
render(<ChineseAlbum />, document.getElementById('app'));