import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import api from '../../../../utils/api';
import { IInitData } from "../../interfaces";

import './style.scss'

interface IProps {

}

interface IState {
    /** 总列表 */
    list: Array<Item>
    /** 当前显示的列表 */
    showList: Array<Item>
    /** 当前列表的第一个数据在总列表的位置 */
    point: number
}

interface Item {
    /** 获奖用户微信呢称 */
    name: string
    /** 电话号码 */
    mobile: string
}

export default class TabContentLuckyMan extends React.Component<IProps, IState> {

    /** 页面初始化数据 */
    private initData: IInitData = (window as any).INIT_DATA

    /** 假名字列表 */
    private fakeNames = [
        "他腐朽年華＊ ",
        "你是我的幸运儿 ",
        "花花花、小伙 ",
        "Au revoir、 ",
        "墨尔本╮情 ",
        "女人、玩的是命",
        "妞╮笑个 ",
        "一半╮眼线 ",
        "这样就好╮ ",
        "豆芽菜╮ ",
        "過客。 ",
        "無盡透明的思念 ",
        "solo　- ",
        "忘了他╮ ",
        "粉红。顽皮豹 ",
        "小心翼翼 ",
        "°別敷衍涐 ",
        "恋人爱成路人 ",
        "昔日餘光。 ",
        "放肆丶小侽人 ",
        "微信网名 ",
        "今非昔比’ ",
        "孤单*无名指 ",
        "莫名的青春 ",
        "灬一抹丶苍白 ",
        "笑叹★尘世美 ",
        "爱你心口难开 ",
        "那傷。眞美 ",
        "命運不堪浮華 ",
        "々爱被冰凝固ゝ ",
        "一生承诺 ",
        "↘▂_倥絔 ",
        "只求一份安定 ",
        "哭花了素颜、 ",
        "浮殇年華 ",
        "焚心劫 ",
        "ー 半 憂 傷 ",
        "余温散尽 ぺ ",
        "执念，爱 ",
        "漫长の人生 ",
        "迷路的男人 ",
        "ˉ夨落旳尐孩。 ",
        "蝶恋花╮ ",
        "。婞褔ｖīｐ ",
        "丶演绎悲伤 ",
        "怀念·最初 ",
        "回忆未来 ",
        "簡單灬愛 ",
        "请在乎我１秒 ",
        "昂贵的、背影 ",
        "日久见人心 ",
        "无可置疑◆ ",
        "*丶 海阔天空 ",
        "虚伪了的真心 ",
        "最迷人的危险 ",
        "有妳，很幸福 ",
        "相知相惜 ",
        "◆乱世梦红颜 ",
        "残花为谁悲丶 ",
        "淡淡の、清香 ",
        "代价是折磨╳ ",
        "吥↘恠侑噯↘ ",
        "?、花容月貌 ",
        "﹎℡默默的爱 ",
        "穿越古代 ",
        "习惯 ",
        "在你的世界走不出去# ",
        "就再多一秒的爱 ",
        "石头剪子布 ",
        "﹂生﹂世﹂双人ら ",
        "言己 ",
        "石头队长再见了 ",
        "爱你太久i ",
        "很有粪量的人 ",
        "慢热型男 ",
        "爱我所爱@ ",
        "疯格@ ",
        "纣王偏宠妲己妖 ",
        "姐抽的是寂寞",
    ]

    private timerFetchList: any

    private timerListLooper: any

    state = {
        list: new Array<Item>(),
        showList: new Array<Item>(),
        point: Math.floor(Math.random() * this.fakeNames.length),
    }

    componentDidMount() {

        this.generateFakeList();

        // 每10秒获取真实数据
        this.timerFetchList = setInterval(() => {
            this.fetchMoreList();
        }, 10000);

        // 更新显示的数据列表        
        this.timerListLooper =  setInterval(() => {
            this.updateShowList();
        }, 3000);
    }
    
    componentWillUnmount() {
        clearInterval(this.timerFetchList)
        clearInterval(this.timerListLooper)
    }

    updateShowList() {
        let curPoint = this.state.point + 3;
        if (curPoint >= this.fakeNames.length) {
            curPoint = 0
        }

        this.setState({
            showList: this.state.list.slice(this.state.point, this.state.point + 3),
            point: curPoint
        })
    }

    /** 获取真数据 */
    async fetchMoreList() {
        const result = await api('/api/activity/assist/rewardList', {
            method: 'POST',
            body: {
                activityId: this.initData.actid,
                page: 1,
                size: 9,
            }
        })

        if (result.state.code === 0) {
            let realList = result.data.list;
            let list = this.state.list;

            if (!realList || realList.length === 0) {
                return;
            }
            realList = realList.map((item: any) => {
                return {
                    ...item,
                    mobile: item.mobile.replace(/^(\w{3})\w*(\w{4})$/, '$1****$2')
                }
            });

            Array.prototype.splice.apply(list, [this.state.point, 0].concat(realList))

            this.setState({
                list
            });
        }
    }

    /** 随机生成假数据 */
    generateFakeList(): void {
        const radomIndex = Math.floor(Math.random() * this.fakeNames.length);

        const list = this.state.list.concat(this.fakeNames.map(item => ({
            name: item,
            mobile: this.getMoble(),
        })))

        this.setState({
            list
        }, () => {
            this.updateShowList();
        });
    }

    getMoble() {
        let prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
        let i = Math.floor(10 * Math.random());
        let prefix = prefixArray[i];

        prefix += '****';
    
        for (let j = 0; j < 2; j++) {
            prefix = prefix + Math.floor(Math.random() * 99);
        }

        return prefix;
    }

    render() {
        return (
            <div className='tab-content-lucky-man'>
                <header className='lucky-man-title'>
                    <img src={ require('../../images/lucky-man-title.png') } />
                </header>

                <main className="lucky-man-content">
                    <header className='table-header'>
                        <span>微信昵称</span>
                        <span>手机号码</span>
                    </header>

                    <ul>
                        {
                            this.state.showList.map((item, index) => (
                                <li key={`lucky-item-${index}`}>
                                    <span className='with-border'>{ item.name }</span>
                                    <span>{ item.mobile }</span>
                                </li>
                            ))
                        }
                        {/* <ReactCSSTransitionGroup
                            transitionName="lucky-item"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}>
                                
                            
                        </ReactCSSTransitionGroup> */}
                    </ul>
                </main>
            </div>
        )
    }
}