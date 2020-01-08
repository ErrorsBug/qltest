import React from 'react';
import Page from 'components/page';
import { apiService } from "components/api-service";
import Clipboard from 'clipboard';

import './style.scss';

export default class ServiceNumberDocking extends React.Component {

    state = {
        showPcManageBox: false,
        liveInfo: null,
        liveBind: null
    }

    get liveId() {
        return this.props.location.query.liveId
    }

    componentDidMount () {
        this.init()
        this.initCopy()
    }

    async init () {
		const [liveSetting, liveBind] = await Promise.all([
			apiService.get({
				url: '/h5/live/revonsitution/manage',
				body: {
					liveId: this.liveId,
				}
            }),
            apiService.post({
                url: '/h5/live/revonsitution/liveIsBindApp',
                body: {
                    liveId: this.liveId
                }
            })
        ]);

        this.setState({
            liveInfo: liveSetting && liveSetting.data && liveSetting.data.liveEntityView || null,
            liveBind: liveBind && liveBind.data || null
        })
    }
    
	initCopy () {
		let that = this;
		//复制链接
		var clipboard = new Clipboard(".fuzhi");
		clipboard.on('success', function(e) {
			window.toast('复制成功！');
		});
		clipboard.on('error', function(e) {
			window.toast('复制失败！请手动复制');
		});
    }
    
    hidePcManageBox = () => {
        this.setState({
            showPcManageBox: false
        })
    }

    get hasBindComponents () {
        return [
            <div className="module" key="has-bind">
                <p className="module-title">已绑定服务号</p>
                <div className="module-content has-bind-list">
                    <div className="has-bind-item">
                        <img src={this.state.liveBind.headImg} alt="" className="cover"/>
                        <p>{this.state.liveBind.appName}</p>
                    </div>
                </div>
            </div>,
            <div className="module" key="use-teacher">
                <p className="module-title">使用教程</p>
                <div className="module-content use-teacher">
                    <ul className="quick-entry">
                        <a href="https://mp.weixin.qq.com/s/u6JsTR87cALXhdaz1cR57g"><li className="icon-of">设置服务号菜单></li></a>
                        <a href="https://mp.weixin.qq.com/s/o8daGr1HUzdmln98gBdelg"><li className="icon-push">服务号推送课程></li></a>
                        <a href="https://mp.weixin.qq.com/s/nTR0W7_rKjKZh95M37EKiw"><li className="icon-fan">新增粉丝的消息队列></li></a>
                        <a href="https://mp.weixin.qq.com/s/N5UYwYZeaQuSDd4lNpoUrw"><li className="icon-tic">设置任务邀请卡></li></a>
                    </ul>
                    <h3>如需解除绑定，请登录微信公众号后台进行解绑。<br/>解绑操作流程：</h3>
                    <div className="">
                        <p>1、电脑端登录mp.weixin.qq.com；</p>
                        <p>2、点击“功能”栏目的“添加功能插件”；</p>
                        <p>3、点击“授权管理”；</p>
                        <p>4、点击千聊栏目的“查看平台详情”取消授权。</p>
                    </div>
                </div>
            </div>
        ]
    }

    get notBindComponents () {
        return [
            <div className="module" key="func-intro">
                <p className="module-title">功能介绍</p>
                <div className="module-content func-list">
                    <div className="func-item-card">
                        <div className="func-icon tic"></div>
                        <div className="func-title">借助任务邀请卡<br/>裂变涨粉</div>
                        <div className="func-desc">任务邀请卡是服务号粉丝裂变神器，学员邀请指定人数的好友关注你的服务号，可以免费听课。对接服务号后，即可免费使用。</div>
                    </div>
                    <div className="func-item-card">
                        <div className="func-icon efficient"></div>
                        <div className="func-title">更高效的服务和<br/>触达学员</div>
                        <div className="func-desc">绑定服务号后，新课上线通知和开播通知将会通过自己的服务号下发</div>
                    </div>
                    <div className="func-item-card">
                        <div className="func-icon flow"></div>
                        <div className="func-title">建立你的自有私域流量</div>
                        <div className="func-desc">
                            <p>1、学员在直播间主页可以关注你的服务号</p>
                            <p>2、学员报名课程后，如果未关注服务号，会引导关注</p>
                        </div>
                    </div>
                    <div className="func-item-card">
                        <div className="func-icon func"></div>
                        <div className="func-title">其他功能</div>
                        <div className="func-desc">
                            <p>1、自定义服务号菜单</p>
                            <p>2、自定义新增粉丝的消息队列</p>
                            <p>3、无限推送模板消息和粉丝消息，突破每月推送4次限制</p>
                            <p>4、服务号粉丝数据</p>
                        </div>
                    </div>
                </div>
            </div>,
            <div className="module" key="join-intro">
                <p className="module-title">加入须知</p>
                <div className="module-content join">
                    <p>1、服务号必须通过了微信认证且开通了模板消息功能；</p>
                    <p>2、模板消息的行业必须设置为：一级行业“IT科技/互联网|电子商务”，二级行业“教育/培训”</p>
                    <p>3、订阅号由于微信没有提供带参数二维码功能，无法实现接入绑定；</p>
                </div>
            </div>,
            <div className="not-bind-tips" key="not-bind-tips">
                没有认证的服务号？您可以上传公众号二维码，会在直播间主页展示给学员，为公众号增粉。<a href={`/live/entity/bindgong/${this.liveId}.htm`}>立即上传></a>
            </div>
        ]
    }

    render () {
        const {
            liveInfo,
            liveBind
        } = this.state
        return liveInfo ? (
            <Page title="服务号对接" className="service-number-docking">
                <div className="docking-container">
                    <div className="header">
                        <div className="flex flex-vcenter" style={{flex: 1}}>
                            <img className="live-cover" src={liveInfo.logo} alt=""/>
                            <p className="live-name">{liveInfo.name}</p>
                        </div>
                        {
                            liveBind && liveBind.liveIsBindApp ? 
                            <span className="docking-btn disable">已对接服务号</span>
                            :
                            <span className="docking-btn" onClick={() => {
                                this.setState({
                                    showPcManageBox: true
                                })
                            }}>未对接服务号</span>
                        }
                    </div>

                    {
                        liveBind && liveBind.liveIsBindApp ? this.hasBindComponents : this.notBindComponents
                    }
                </div>

                <div className="footer">
                    <span className="btn" onClick={() => {
                        this.setState({
                            showPcManageBox: true
                        })
                    }}>{liveBind && liveBind.liveIsBindApp ? '登录电脑端管理服务号' : '马上加入'}</span>
                </div>
                
                {
                    this.state.showPcManageBox ?
                    <div className="open-pc-manage-dialog">
                        <div className="_layer" onClick={this.hidePcManageBox}></div>
                        <div className="_container">
                            <span className="close-btn" onClick={this.hidePcManageBox}></span>
                            <div className="open-pc-manage-content">
                                <h2>对接服务号</h2>
                                <p className="p28">请登录“电脑端-千聊讲师管理后台” <br/>进行服务号对接</p>
                                <div className="stroke-style">
                                    <p>方式一</p>
                                    <p>打开浏览器搜索“千聊管理后台”</p>
                                </div>
                                <div className="stroke-style">
                                    <p>方式二</p>
                                    <p className="fuzhi" data-clipboard-text="http://v.qianliao.tv/">打开浏览器输入以下<br/>地址v.qianliao.tv<s>（点击复制）</s></p>
                                </div>
                                <div className="qr-code">
                                    <img src={require('./img/qr-code.png')} alt=""/>
                                </div>
                                <p className="p22">关注<s>“千聊知识店铺”</s>，回复关键字<s>“服务号对接”</s>为你提供一对一客服支持，带你玩转服务号</p>
                            </div>
                        </div>
                    </div> : null
                }
            </Page>
        ) : null
    }
}