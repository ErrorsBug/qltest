import * as React from 'react';
import { createPortal } from 'react-dom';

import { IActivity, IInitData, IUSer } from '../../interfaces'

import './style.scss'

interface IProps {
    /** 是否显示dialog */
    show: boolean

    /** 关闭弹框的事件 */
    onCloseRuleDialog: () => void
}

export default class RuleDialog extends React.Component<IProps, {}> {

    /** 页面初始化数据 */
    private initData: IInitData = (window as any).INIT_DATA


    // constructor (props: IProps) {
    //     super(props);

    //     this.initData = {
    //         uid: '123',
    //         /** 当前登录的用户ID */
    //         curUserId: '123',
    //         /** 活动id */
    //         actid: '123',
    //         /** 活动用户状态： N未完成活动，Y已完成活动，R已领取奖品 */
    //         status: 'N',
    //         /** 活动用户已获得的活动分值 */
    //         score: 12,
    //         /** 活动信息对象 */
    //         activity: {
    //             /* 主键 */
    //             id: '123',
    //             /* 活动标题 */
    //             title: 'hahahah',
    //             /* 活动总分值 */
    //             score: 20,
    //             /* 活动关联的公众号 */
    //             appId: '123',
    //             /* 关注二维码图片链接 */
    //             qrcode: 'fdfa',
    //             /* Y：已上线 N：已下线 */
    //             status: 'Y'
    //         },
    //         /** 活动用户对象 */
    //         user: {
    //             /* 用户呢称 */
    //             name: 'xiha',
    //             /* 用户ID */
    //             userId: '123',
    //             /* 用户头像 */
    //             headImgUrl: 'sadf'
    //         },
    //         /** 当前用户查看别人的活动时候，会返回， Y：已经助力过，N 还没助力过 */
    //         isHelped: 'N'
    //     }
    // }


    componentDidMount() {
        
    }

    render() {
        return createPortal(
            <section className={'rule-dialog-container ' + (this.props.show ? '' : 'hide')}>
                <aside className='bg-mask'></aside>

                <main className='dialog-content'>
                    <img src={ require('../../images/rule-dialog-title.png') } className='dialog-title'/>

                    <section className='rule-content'>
                        <ul className='rule-list'>
                            <li>
                                【发起活动】你点击“开始收集”就发起活动啦。
                            </li>
                            <li>
                                【邀请好友】发起活动后，邀请好友帮忙给你添
                                饭，<span className='imp'>加满{ this.initData.activity.score }碗，你即中奖</span>。好友帮忙可能使美
                                食增加也可能减少。概率随机。一个好友只能帮
                                忙一次。
                            </li>
                            <li>
                                【怎么领奖】即日起至2017年12月23号16时。
                                当你中奖，页面会自动进入领奖资料填写页面。
                                我们将在活动结束后的15个工作日内审核中奖资
                                格并发放奖品，<span className="imp">奖品包邮，颜色随机。</span>
                            </li>
                            <li>
                                【其他须知】1个ID、1个微信号、1个手机、1个
                                地址、1个用户仅限领1份奖品，如发现刷奖、作
                                弊将取消领奖资格。
                            </li>
                        </ul>

                        <p className='feedback-info'>*本活动最终解释权归广州沐思信息科技有限公司<br />*如有疑问，可添加千聊亲子微信客服（ID: qlfeng7）</p>
                    </section>

                    <img src={ require('../../images/close-dialog.png') } 
                        className='close-btn'
                        onClick={ this.props.onCloseRuleDialog }
                    />
                </main>
            </section>
        , document.body)
    }
}