import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators'
import Swiper from 'swiper/dist/js/swiper.min.js';
// import Swiper from 'swiper';
import { MiddleDialog } from 'components/dialog';
import CoralJoinBox from 'components/dialogs-colorful/coral-join/index';

@autobind
class OrgBenefits extends Component {
    state = {
        show: false,
        seId:0,
        
    }

    data = {
        icons: [
            {
                iconName: 'icon_Lb',
                title: '音视频实时直播',
                content:'音频直播：实时语音分享、互动不间断，再不用一条条语音操作发送。视频直播：支持电脑录屏、摄像、或多种内容模式组合的实时视频直播'
            },
            {
                iconName: 'icon_Punch',
                title:'打卡训练营',
                content:'使用打卡瓜分奖金+社群强互动+轻量小图文教学，提高学员粘性与到课率，降低拓新成本。'
            },
            {
                iconName: 'icon_cm',
                title: '个性定制',
                content:'自定义分享模板，自定义logo样式、页底标记等等，打造专属品牌，实现专属定制。'
            },
            {
                iconName: 'icon_Applets',
                title:'直播间小程序',
                content:'直播间小程序，无需开发，轻量化，使用更流畅，快速提升用户体验度。'
            },
            {
                iconName: 'icon_mcc',
                title:'会员卡定制',
                content:'实现课程可分类打包，实现会员分层管理，拥有尊贵特权，带有VIP标识。'
            },
            {
                iconName: 'icon_sc',
                title:'店铺装修',
                content:'自主设置轮播图、整体配色方案、功能定制、首页标题、模块标题内容、页面排版，塑造独一无二的知识小铺。'
            },
            {
                iconName: 'icon_sbr',
                title:'无限开播',
                content:'基础版同时进行中的课程上限为50个，而专业版对直播课程数没有限制，所有课程可同时直播。'
            },
            {
                iconName: 'icon_HDvideo',
                title:'高清视频',
                content:'支持上传分辨率为720P的高清视频，细节内容呈现更清晰，授课体验更优质，更能彰显课程专业度。'
            },
            {
                iconName: 'icon_More',
                title:'更多课代表',
                content:'课代表是收费系列课、收费单课的助推器，借助分销商的分发实现收入翻几番。专业版可设高达5000名课代表。'
            },
            {
                iconName: 'icon_Hne',
                title:'隐藏学习人次',
                content:'担心新课程学习人次太少影响用户购买？别担心，您可以把学习人次进行隐藏，让用户在考虑是否购买时不受学习人次干扰。'
            },
            {
                iconName: 'icon_rw',
                title:'实时提现',
                content:'实时结算、实时到账，单日提现高达20万，实现资金快速周转。'
            },
            {
                iconName: 'icon_pe',
                title:'抢先体验',
                content:'抢先体验所有新功能、享受最新优惠政策。'
            },
            {
                iconName: 'icon_videoNotLimit',
                title: '视频上传无限制',
                content:'不受每日10G上传限制，PC端上传视频课程支持每日最多上传80G。'
            },
            {
                iconName: 'icon_freeMsg',
                title: '免费推送短信',
                content:'短信推送0.05元/条，购买专业版半年赠送1000条，购买1年赠送2000条，购买2年赠送4000条。'
            },
            {
                iconName: 'icon_studentExport',
                title: '学员数据导出',
                content:'支持导出表单采集的学员数据和学员管理列表数据。'
            }
        ]
    }

    componentDidMount() {
        
    }

    swiperSlideTo(idx) {
        this.switcSwiperDisplay();
        this.setState({
            seId:idx
        })
        setTimeout(() => {
            this.mySwiper.slideTo(idx, 0, false);
        },0)
        
    }
    
    switcSwiperDisplay() {
        let that = this;
        this.setState({
            show:!this.state.show
        }, () => {
            this.mySwiper= new Swiper('.swiper-container', {
                on: {
                    slideChange: function () {
                        that.setState({
                            seId:this.activeIndex
                        })  
                    },
                },
            });
        })
    }


    render() {
        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-low");

        if (!portalBody) {
            return null;
        }



        return (
            <div className='org-edition-benefits'>
                <div className="title"><img src={require('./imgs/title.png')} /></div>

                <ul className="icon-list">
                    {
                        this.data.icons.map((item,index) => {
                            return <li key={'oeb' + index} onClick={()=>{this.swiperSlideTo(index)}}>
                                <span className="item-icon"><img src={require(`./imgs/${item.iconName}.png`)} /></span>
                                <span className="name">{item.title}</span>
                            </li>
                            
                        })
                    }    
                
                </ul>

                {
                    this.state.show?
                    createPortal(
                        <div className='benefits-detail-card'>
                            <div className="bg" onClick={this.switcSwiperDisplay}></div>
                            <div className="swiper-container">
                                <div className="swiper-wrapper">
                                {
                                    this.data.icons.map((item,index) => {
                                        return <div className={`swiper-slide ${this.state.seId == index?'on':''}`}  key={'swiper-'+index}>
                                            <div className="card">
                                                <div className="id-close-modal" onClick={this.switcSwiperDisplay} ></div>       
                                                <div className="top">
                                                    <span className="item-icon"><img src={require(`./imgs/${item.iconName}.png`)} /></span>
                                                    <span className="name">{item.title}</span>
                                                </div>
                                                <div className="content">{item.content}</div>
                                            </div>
                                        </div>
                                        
                                    })
                                }     
                                </div>
                            </div>
                        </div>
                            , portalBody)
                    :null    
                }

            </div> 
        );
    }
}

OrgBenefits.propTypes = {

};

export default OrgBenefits;