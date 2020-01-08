import React, { Component, Fragment } from 'react'
import { autobind, throttle } from 'core-decorators';

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
        const scrolNode = document.querySelector('.ch-scroll-box');
        scrolNode&&scrolNode.addEventListener('scroll',(e) => {
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
    // 切换排行
    @throttle(300)
    changeRankIdx(idx) {
        if(this.state.rankIndx === idx) return false
        this.setState({rankIndx: idx})
        this.props.changeRankIdx(idx === 1);
    }
    render() { 
        const { } = this.state;
        const {tabs = [  ] , tabIdx=0 ,logs } = this.props 
        if(tabs.length==0)return false
        return (
            <Fragment>
                <div className="un-tab-box" ref={ r => this.tabNode = r }>
                    <div className="un-tab-lists" ref={ r => this.fixedNode = r }>
                        {
                            tabs.map((item,index)=> (
                                <div
                                    onClick={ () => this.props.changeTab(index) }
                                    className={ `un-tab-item on-log on-visible ${ tabIdx === index ? 'active' : '' }` }  
                                    data-log-name={'导航'}
                                    data-log-region={logs}
                                    data-log-pos={index}
                                    key={`${ item }-${index}`} >
                                    <div dangerouslySetInnerHTML={{ __html: item}}></div>
                                </div>
                            ))
                        }
                    </div>
                </div>  
            </Fragment>
        );
    }
}