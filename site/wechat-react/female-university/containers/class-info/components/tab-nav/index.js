import React, { Component, Fragment } from 'react'
import { autobind, throttle } from 'core-decorators';
const tabs = [ '班级同学', '学习动态', '学霸榜' ]
const ranks = [ '周榜', '总榜' ]

/**
 * Tab 导航栏
 * @export
 * @class TabNav
 * @extends {Component}
 */
@autobind
export default class TabNav extends Component {
    state = { 
        idx : 0,
        rankIndx: 0,
        isShowRack: false
    }
    isRankShow = 0;
    isOnce = false
    componentDidMount() { 
        this.handleScroll();
    }
    // 监听滚动
    handleScroll() {
        const scrolNode = document.querySelector('.ln-scroll-box');
        scrolNode.addEventListener('scroll',(e) => {
            const { top, height } = this.tabNode.getBoundingClientRect();
            if(!!this.rankBox){
                const rankTop = this.rankBox.getBoundingClientRect().top;
                if(rankTop > 0){
                    if(rankTop > height){
                        this.rankFixed.classList.remove('scroll')
                        if(this.state.isShowRack){
                            this.setState({isShowRack: false})
                        }
                    }
                } else {
                    this.rankFixed.classList.add('scroll')
                    if(this.isRankShow > (rankTop + 10) && !this.isOnce){ // 上
                        this.isOnce = true;
                        this.setState({
                            isShowRack: false
                        })
                    } else if(this.isOnce && (this.isRankShow + 20) < rankTop ){ //  下
                        this.isOnce = false
                        this.setState({
                            isShowRack: true
                        })
                    }
                    this.isRankShow = rankTop;
                }
            }
            if(top > 0){
                this.fixedNode.classList.remove('scroll')
            } else {
                this.fixedNode.classList.add('scroll')
            }
        })
    }
    // 切换tab
    changeTab(idx) {  
        this.setState({idx: idx})
        this.props.changeTab(idx)
    }
    // 切换排行
    @throttle(300)
    changeRankIdx(idx) {
        if(this.state.rankIndx === idx) return false
        this.setState({rankIndx: idx})
        this.props.changeRankIdx(idx === 1);
    }
    render() {
        const { idx,rankIndx, isShowRack } = this.state;
        const { tabIdx } = this.props
        return (
            <Fragment>
                <div className="cl-tab-box" ref={ r => this.tabNode = r }>
                    <div className="cl-tab-lists" ref={ r => this.fixedNode = r }>
                        {
                            tabs.map((item,index)=> (
                                <div
                                    onClick={ () => this.changeTab(index) }
                                    className={ `cl-tab-item on-log on-visible ${ tabIdx === index ? 'active' : '' }` }  
                                    data-log-name='班级导航'
                                    data-log-region={`class-info-tab-${index}`}
                                    data-log-pos="0"
                                    key={`${ item }-${index}`} >
                                    <span>{ item }</span>
                                </div>
                            ))
                        }
                    </div>
                </div> 
                { tabIdx === 2 && (
                    <div className="cl-ranking-box" ref={ r => this.rankBox = r }>
                        <div className={ `cl-ranking-cont ${ isShowRack ? 'show' : 'hide' }` } ref={ r => this.rankFixed = r }>
                            <div className="cl-ranking-left">
                                { ranks.map((item, index) => (
                                    <span 
                                        key={`${ item }-${index}`}
                                        onClick={ () => this.changeRankIdx(index) }
                                        data-log-name='班级导航'
                                        data-log-region={`class-info-rank-${index}`}
                                        data-log-pos="0"
                                        className={ `on-log on-visible ${ rankIndx === index ? 'action' : '' }` }>{ item }</span>
                                )) }
                                <div className={ `cl-ranking-bg action-${ rankIndx }` }></div>
                            </div>
                            <div className="cl-ranking-rule on-log on-visible"
                                data-log-name='排名规则'
                                data-log-region={`cl-ranking-rule`}
                                data-log-pos="0"
                                 onClick={ this.props.hideRankRule }></div>
                        </div>
                    </div>
                ) }
            </Fragment>
        );
    }
}