import React,{Component} from 'react';
import { createPortal } from 'react-dom';
import Page from 'components/page';
import {connect} from 'react-redux';
import { locationTo } from 'components/util';
import { getQr, getMyLiveEntity } from '../../actions/common';
import MiddleDialog from 'components/dialog/middle-dialog';
import { autobind } from 'core-decorators';
import Swiper from 'react-id-swiper';
import { share } from 'components/wx-utils';




const posterList = [
    {
        name: 'Office职场大学',
        img : 'https://img.qlchat.com/qlLive/activity/image/XD8QECDA-R2ZF-TW6Y-1565865200825-CRTW833JCHWP.jpg'
    },
    {
        name: '拼多多',
        img : 'https://img.qlchat.com/qlLive/activity/image/298H8TQW-XOQ3-CYTN-1565254515350-T657WFR2U54T.jpg'
    },
    {
        name: '罗云裳理财',
        img : 'https://img.qlchat.com/qlLive/activity/image/AXUMQKND-2JNT-AVW2-1565254523555-928D1HEE1CLY.png'
    },
    {
        name: '今日头条',
        img : 'https://img.qlchat.com/qlLive/activity/image/Q1JDP9VL-UKTZ-GEJ1-1565254527341-BDVT164YTIJJ.png'
    },
    {
        name: '有点牛',
        img : 'https://img.qlchat.com/qlLive/activity/image/145OJ4TM-YTCQ-YKXS-1565254530228-5FPEZHOJWHR3.jpg'
    },
    {
        name: '趣头条',
        img : 'https://img.qlchat.com/qlLive/activity/image/QYV1UVGZ-X43X-4CBX-1565254533416-DZOB7BWGH5ZF.png'
    },
    {
        name: '大脑派',
        img : 'https://img.qlchat.com/qlLive/activity/image/J425M8T4-IW98-OS1Y-1565254536550-N9ODMGON1P7Q.jpg'
    },
    {
        name: '丁香医生',
        img : 'https://img.qlchat.com/qlLive/activity/image/TFOFQN7E-OBSV-9SG9-1565254540495-GQ5TL58AYJZH.jpg'
    },
    {
        name: '吴国平财经',
        img : 'https://img.qlchat.com/qlLive/activity/image/JYSUSANQ-JAVP-1USB-1565254544189-WI9CR3LGOBNT.jpg'
    },
    {
        name: '花镇',
        img : 'https://img.qlchat.com/qlLive/activity/image/ZB5GS8LD-1W8J-8PUK-1565254547160-Q7EGJUIGDJFR.jpg'
    },
    {
        name: '地心引力工场',
        img : 'https://img.qlchat.com/qlLive/activity/image/BC5JPI3X-9X87-LFZC-1565254550298-JWZ7E6L6NQ4J.jpg'
    },
    {
        name: '开森心理',
        img : 'https://img.qlchat.com/qlLive/activity/image/D4GVMRVP-7B4P-6GCN-1565254552170-V9CDTWPTH84Q.jpg'
    },
    {
        name: '常春藤',
        img : 'https://img.qlchat.com/qlLive/activity/image/MZDKJGJM-WDI9-4AZC-1565254553960-56UF7GMNC4WU.jpg'
    },
    {
        name: '陈列共和',
        img : 'https://img.qlchat.com/qlLive/activity/image/YD5W8EID-X975-F8WM-1565254555750-2MYACX6JP7HW.jpg'
    },
    {
        name: '郑在秀',
        img : 'https://img.qlchat.com/qlLive/activity/image/TRB41SK5-L2EH-EEM6-1565254559934-X9T948HD51U2.jpg'
    },
    {
        name: '7分钟理财',
        img : 'https://img.qlchat.com/qlLive/activity/image/MMU2Y1PA-LOQ5-D7MI-1565254561925-SVYQBDCUFPEX.jpg'
    },
    {
        name: '菜菜美食日记',
        img : 'https://img.qlchat.com/qlLive/activity/image/T48UHDYY-MEZI-IPQX-1565254563936-95UXF1NTQORF.jpg'
    },
    {
        name: '干货帮',
        img : 'https://img.qlchat.com/qlLive/activity/image/8EW4ZVKH-AJXX-GNIV-1565254567813-W1SHRT8THL9F.jpg'
    },
    {
        name: '创业邦',
        img : 'https://img.qlchat.com/qlLive/activity/image/367T71KV-WGQL-MC8W-1565254595119-ZGR2L625UVGW.jpg'
    },
    {
        name: '米拍摄影公开课',
        img : 'https://img.qlchat.com/qlLive/activity/image/FVFDF9A4-I5ZO-LA2V-1565254598520-4E7WJQSC7N2O.png'
    },
]

const swiperParams = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false
    },
    spaceBetween: 20,
    initialSlide: 1
}

function mapStateToProps(state) {
    return {
    };
}
const mapDispatchToProps = {
    getQr,
    getMyLiveEntity
};

@autobind
class ActivityEntrance extends Component {
    constructor(props){
        super(props);
    }

    state = {
        qrUrl: undefined,
        showQrDialog: false,
        liveEntity: undefined
    }

    data = {
        caroul: null,
        afId: null,
        caroulTop: 0,
        loopItemHeight: undefined,
        currentLoopIndex: 0,
        timer: null
    }

    async componentDidMount() {
        share();
        this.getQr();
        this.getMyLiveEntity();
        this.runCaroul();        
    }

    componentWillUnmount() {
        clearInterval(this.data.timer);
    }

    goCreate() {
        // 带上创建入口标识
        if(this.state.liveEntity && this.state.liveEntity.entityPo) {
            locationTo(`/wechat/page/topic-create?liveId=${ this.state.liveEntity.entityPo.id }&fromCreateClass=Y`);
            return ;
        } 
        locationTo('/wechat/page/topic-create?fromCreateClass=Y');
    }

    showServiceQrDialog() {
        this.setState({
            showQrDialog: true
        })
    }

    hideServiceQrDialog() {
        this.setState({
            showQrDialog: false
        })
    }

    async getQr() {
        const res = await this.props.getQr({
            channel: 'pushTopicBefNewCreate',
            appId: 'wxd01870839c0996c8'
        });

        if(res.state.code === 0) {
            this.setState({
                qrUrl: res.data.qrUrl
            })
        }
    }

    async getMyLiveEntity() {
        const res = await this.props.getMyLiveEntity();
        if(res.state.code === 0) {
            if(res.data && res.data.entityPo !== null) {
                locationTo('/wechat/page/backstage');
            }
            this.setState({
                liveEntity: res.data
            })
        }
    }

    runCaroul() {
        this.data.caroul = document.querySelector('.loop-list');
        this.data.loopItemHeight = document.querySelector('.loop-item').offsetHeight;
        this.data.timer = setInterval(() => {
            this.data.currentLoopIndex += 1;
            this.data.caroulTop -= this.data.loopItemHeight;
            this.data.caroul.style.top = this.data.caroulTop + 'px';
            
            if(this.data.currentLoopIndex > 3) {
                this.data.currentLoopIndex = 0;
                this.data.caroulTop = 0;
                this.data.caroul.style.top = this.data.caroulTop + 'px';
            } 
            
        }, 5000);
    }

    render() {
        return (
            <Page title="创建课程" className='activity-entrance'>
                <div className="content">
                    <div className="header">
                        <div className="logo">
                            <img src={require('./img/logo.png')} alt=""/>
                        </div>
                        <p className="product-name">
                            千聊-免费开课工具
                        </p>
                        <div className="desc">
                            {'腾讯投资  3亿人在用'}
                        </div>
                        <div className="header-bottom"></div>
                    </div>
                    <Section 
                        className="swiper-wrap"
                        title="满足你多样化的应用场景"
                    >
                        <Swiper {...swiperParams}>
                            <div className="sense-card">
                                <img src={require('./img/icon_Knowledge.png')} alt=""/>
                                <div className="title">
                                    知识付费
                                </div>
                                <div className="desc">
                                    个体老师、自媒体、出版社
                                </div>
                            </div>
                            <div className="sense-card">
                                <img src={require('./img/icon_Online training.png')} alt=""/>
                                <div className="title">
                                    线上培训
                                </div>
                                <div className="desc">
                                    电商代理培训、企业内训、政府机构、家校培训
                                </div>
                            </div>
                            <div className="sense-card">
                                <img src={require('./img/icon_online education.png')} alt=""/>
                                <div className="title">
                                在线教育
                                </div>
                                <div className="desc">
                                学历考证、K12教育、职业技能、出国留学
                                </div>
                            </div>
                        </Swiper>
                    </Section>
                    <Section 
                        title="千聊工具六大能力"
                        className="power-section"
                    >
                        <div className="power-card-list">
                            <PowerCard
                                img={require('./img/btn_Startform.png')}
                                title="开课形式"
                                text="支持纯语音、PPT、音视频录播及直播等8大类型"
                            />
                            <PowerCard
                                img={require('./img/btn_Enrollment.png')}
                                title="招生引流"
                                text="全民分销、拼团、限时特惠、砍价等工具助力，千聊3亿流量赋能"
                            />
                            <PowerCard
                                img={require('./img/btn_Enrollment.png')}
                                title="师生触达"
                                text="自动化创建微信社群，公众号、短信、APP等多渠道推送"
                            />
                            <PowerCard
                                img={require('./img/btn_classroom.png')}
                                title="课堂互动"
                                text="作业、考试、打卡、训练营监督学习；红包、分享榜、评论上墙等带动氛围"
                            />
                            <PowerCard
                                img={require('./img/btn_Student.png')}
                                title="学员管理"
                                text="学员CRM系统，满足学员信息采集、管理、分析、个性化推送等需求"
                            />
                            <PowerCard
                                img={require('./img/btn_data.png')}
                                title="数据分析"
                                text="完课率、访客趋势、购买转化、渠道分布等全流程分析"
                            />
                        </div>
                    </Section>
                    <Section 
                        title="他们都在用"
                    >
                        <div className="teacher-card-list-wrap">
                            <div className="teacher-card-list">
                                {
                                    posterList.map((item, index) => {
                                        return (
                                        <TeacherCard
                                            img={item.img}
                                            name={item.name}
                                            key={index}
                                        ></TeacherCard>)
                                    })
                                }
                            </div>
                        </div>
                        <div className="loop">
                            <span className="clock-icon">
                                <img src={require('./img/Icon_time.png')} alt=""/>
                            </span>
                            <div className="loop-wrap">
                                <div className="loop-list">
                                    <div className="loop-item">
                                        截止目前，累计已注册讲师140万人+
                                    </div>
                                    <div className="loop-item">
                                        截止目前，千聊已创建话题数1500万+
                                    </div>
                                    <div className="loop-item">
                                        截止目前，千聊已创建的系列课数500万+
                                    </div>
                                    <div className="loop-item">
                                        截止目前，日均话题的创建数10000+
                                    </div>
                                    <div className="loop-item">
                                        截止目前，累计已注册讲师140万人+
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Section>
                    <Section 
                        className="aboutus"
                        title="关于我们"
                    >
                        <p>
                        微信知识变现第一工具，超过140万知识服务者使用，团队成员包括了阿里及腾讯等顶级互联网人才，并已获腾讯战略投资。
                        </p>
                        <p>
                        自媒体、机构、教育行业、大V等群体的知识分享及变现工具。我们的愿景是致力于成为中国最大的知识分享平台。
                        </p>
                    </Section>
                </div>
                <div className="bottom">
                    <div className="service on-log" 
                    data-log-region="new_customer_service"
                    onClick={this.showServiceQrDialog}>
                        <img className="icon-customer" src={require('./img/icon_Customer.png')} alt=""/>
                        <span>客服</span>
                    </div>
                    <div className="go-create on-log" 
                    data-log-region="new_create_topic" onClick={this.goCreate}>
                        创建我的第一门课
                    </div>
                </div>
                
                <MiddleDialog
                    show={this.state.showQrDialog}
                    className="qr-dialog"
                    onClose={this.hideServiceQrDialog}
                >
                    <div className="qr-wrap">
                        <span className="close" onClick={this.hideServiceQrDialog}>
                            <img src={require('./img/close.png')} alt="" />
                        </span>
                        <img src={this.state.qrUrl} alt=""/>
                        <p className="title">扫码关注我们，为您在线答疑</p>
                        <p className="desc">更多千聊教程及服务，请通过【千聊知识店铺】公众号菜单查看</p>
                    </div>
                </MiddleDialog>
                    
                
            </Page>
        )
    }
};


module.exports = connect(mapStateToProps, mapDispatchToProps)(ActivityEntrance);


function Section(props) {
    return (
        <section className={["section", props.className].join(' ')}>
            <div className="title">
                <p className="text">
                    <span className="deco-wrap left">
                        <img src={require('./img/btn_ztitle.png')} alt="" className="deco"/>
                    </span>
                    {props.title}
                    <span className="deco-wrap right">
                        <img src={require('./img/btn_ytitle.png')} alt="" className="deco"/>
                    </span>
                </p>
            </div>
            {
                props.children
            }
        </section>
    );
}

function PowerCard(props) {
    return (
        <div className="power-card">
            {
                props.img && 
                <div className="img-wrap">
                    <img src={props.img} alt="power"/>
                </div>
            }
            <div className="text-wrap">
                <p className="title">{props.title}</p>
                <p className="text">{props.text}</p>
            </div>
        </div>
    )
}

function TeacherCard(props) {
    return (
        <div className="teacher-card">
            <img src={props.img} alt=""/>
            <div className="teachername">
                {props.name}
            </div>
        </div>
    )
}