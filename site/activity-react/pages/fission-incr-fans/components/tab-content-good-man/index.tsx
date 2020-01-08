import * as React from 'react';
import api from '../../../../utils/api';
import { autobind } from 'core-decorators'
import { IInitData } from '../../interfaces'

import './style.scss'

interface IGoodMan {
    /** 主键 */
    id: number
    /** 助力用户id */
    helperId:number,
    /** 助力用户呢称 */
    name:string,
    /** 助力用户头像 */
    headImgUrl:string,
    /** 助力时间 */
    createTime?:string,
    /** 助力分数(可以是负数) */
    score:number,
}

interface IState {
    list: Array<IGoodMan>

    page: number

    noMore: boolean
}

@autobind
export default class TabContentGoodMan extends React.Component<{}, IState> {

    /** 服务端带回来的数据 */
    private initData: IInitData = (window as any).INIT_DATA

    /** 加载下一页 */
    private loading: boolean = false

    state = {
        list: new Array<IGoodMan>(),

        page: 0,

        noMore: false,
    }

    componentDidMount(): void {
        this.getGoodManList();
        // if (this.state.list.length == 0) {
        //     this.getGoodManList();
        // }
    }

    async getGoodManList() {
        this.loading = true;
        const result = await api('/api/activity/assist/helpList', {
            method: 'POST',
            body: {
                activityUserId: this.initData.uid || this.initData.curUserId,
                activityId: this.initData.actid,
                page: {
                    page: 1,
                    size: 10,
                }
            }
        });

        this.loading = false;

        if (result.state.code === 0) {
            // let noMore = result.data.list.length === 0;

            this.setState({
                list: this.state.list.concat(result.data.list),
                // page: this.state.page + 1,
                // noMore,
            });
        }
    }

    // onScroll(e: any) {
    //     if (this.loading || this.state.noMore) {
    //         return;
    //     }

    //     const event = e || window.event;
    //     const el = event.target;

    //     let distanceScrollCount = el.scrollHeight,
    //         distanceScroll = el.scrollTop,
    //         topicPageHight = el.clientHeight,
    //         ddt = distanceScrollCount - distanceScroll - topicPageHight,
    //         defaultToBottomHeight = 3;

    //     if (ddt < defaultToBottomHeight) {
    //         this.getGoodManList();
    //     }
    // }

    render() {
        return (
            <div className='tab-content-good-man'>
                <header className='good-man-title'>
                    <img src={ require('../../images/good-man-title.png') } />
                </header>

                <main className="good-man-content">
                    <ul>
                        {
                            this.state.list.length === 0 && 
                                <p className='empty-text'>暂时还没有人帮你加饭哦！</p>
                        }
                        {
                            this.state.list.map((item, index) =>(
                                <li key={ `good-man-item-${index}` }>
                                    <span className='portrail'>
                                        <img src={`${item.headImgUrl}?x-oss-process=image/resize,h_60,w_60,m_fill`} />
                                    </span>
                                    <div className='user-info'>
                                        <span className='user-name'>{ item.name }</span>
                                        {
                                            item.score > 0 ?
                                                <span className='score-info'>特别厉害，给你添了{ item.score }碗饭~</span>
                                                :
                                                <span className='score-info'>特别厉害，偷吃了你{ Math.abs(item.score) }碗饭！</span>
                                        }
                                        
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </main>
            </div>
        )
    }
}
