import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind, time } from 'core-decorators';
import animation from 'components/animation';
import { fail } from 'assert';
var classNames = require('classnames');


@autobind
export class TopBar extends Component {
    static propTypes = {
        tabList: PropTypes.array,
        // 当前激活的tab
        activeTab: PropTypes.string,
        // 排序按钮文案，为空时不显示
        sortBtn: PropTypes.string,
        // 排序方式变化时回调函数
        onSortChange: PropTypes.func,
        // tab 变化时回调
        onTabChange: PropTypes.func,
        // 自定义css class
        className: PropTypes.string,
        // 是否隐藏
        hide: PropTypes.bool,
        // 是否显示搜索工具
        showSearchBar: PropTypes.bool,
        // currentBottomTab
        currentBottomTab: PropTypes.string,
    }

    static defaultProps = {
        tabList: [{id: '', name: ''}],
        activeTab: '',
        showSearchBar: false,
        sortBtn: '',
        className: '',
        onSortChange: () => {},
        onTabChange: () => {},
        isScaned: false,
        hide: false,
    }

    componentDidMount = () => {
        // this.checkIfScrollIng();
        // console.log('a',this.refs)
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        const curTabLength = this.props.tabList.length;
        if (curTabLength > 1 && !this.state.isScaned) {
            this.scrollScan(this.refs.tabContainer);
        }
        if (!this.state.isScrolling && this.props.curTabScrollLeft !== this.refs.tabContainer.scrollLeft && this.props.currentBottomTab === 'market_edit') {
            // console.log(this.props.curTabScrollLeft)
            this.refs.tabContainer.scrollLeft = this.props.curTabScrollLeft
        }
    }
    

    constructor(props) {
        super(props)
        
        this.state = {
            isScaned: false,
            isScrolling: false,
        }
    }
    
    onTabClick(e, tabItem) {
        this.props.onTabChange(tabItem);
        this.scorllToMiddle(e.target, this.refs.tabContainer);
    }

    async scrollScan(element) {
        const scrollSpace = element.scrollWidth - element.clientWidth;
        // await this.setState({ 
        //     isScrolling: true,
        // })
        if (scrollSpace == 0) {
            return;
        }

        animation.add({
            startValue: 0,
            endValue: scrollSpace,
            duatation: 1000,
            easing: "easeInOutSine",
            step: (value, key) => {
                element.scrollLeft = value;
            },
            oncomplete: () => {
                animation.add({
                    startValue: scrollSpace,
                    endValue: 0,
                    duatation: 1000,
                    easing: "easeOutQuad",
                    step: (value, key) => {
                        element.scrollLeft = value;
                    },
                    oncomplete: async () => await this.setState({  isScaned: true,})
                })
            }
        })
    }

    scorllToLeft() {
        const tabContainer = this.refs.tabContainer;

        animation.add({
            startValue: tabContainer.scrollLeft,
            endValue: 0,
            duatation: 1000,
            easing: "easeInOutSine",
            step: (value, key) => {
                tabContainer.scrollLeft = value;
            },
        })
    }

    async scorllToMiddle(target, parent) {
        if (!target || !parent) return;
        await this.setState({ isScrolling: true,})
        const parentWidth = parent.clientWidth;
        const parentScrollWidth = parent.scrollWidth;
        const middleWidth = parentWidth / 2;
        const parentScrollLeft = parent.scrollLeft;
        const targetOffsetLeft = target.offsetLeft;
        const targetWidth = target.offsetWidth;

        const canScroll = target.offsetLeft > middleWidth || target.offsetLeft < parentScrollWidth - middleWidth;
        if (canScroll) {
            const middleLeft = parentScrollLeft + middleWidth;
            const moveSpace = targetOffsetLeft - middleLeft + targetWidth / 2;
            const newScrollLeft = parentScrollLeft + moveSpace;
            animation.add({
                startValue: parentScrollLeft,
                endValue: newScrollLeft,
                duatation: 400,
                easing: "easeInOutSine",
                oncomplete: async () => {
                    await this.setState({ isScrolling: false,});
                    if ( this.props.currentBottomTab === 'market_edit') {
                        this.props.onTopBarScroll(newScrollLeft);
                    }
                },
                step: (value, key) => {
                    parent.scrollLeft = value;
                },
            })
        }
    }

    onSortBtnClick(idx) {
        const curSortOrder = this.state.sortBtns[idx].sortOrder;
        const nextSortOrder = curSortOrder === 'asc' ? 'desc' : 'asc';
        const sortBtns = this.state.sortBtns.map((item, index) => {
            return {
                ...item, 
                sortOrder: idx === index ? nextSortOrder : '',
            }
        })
        this.setState({ sortBtns });

        this.props.onSortBtnClick(sortBtns[idx]);
    }

    onTabScroll(e) {
        clearTimeout(this.timer);
        if (!this.state.isScaned) return;
        if (!this.state.isScrolling) {
            this.setState({ isScrolling : true });
        }
        this.timer = setTimeout(() => {
            let newScrollLeft = this.refs.tabContainer.scrollLeft;
            this.setState({ isScrolling: false});
            if ( this.props.currentBottomTab === 'market_edit') {
                this.props.onTopBarScroll(newScrollLeft);
            }
        }, 300);
    }

    render() {
        const topBarClass = classNames({
            "market-top-bar": true,
            "agent-top": this.props.isAgentTop,
            "market-top": this.props.currentBottomTab === 'media_market',
            "hide-top-bar": this.props.hide,
            [this.props.className || '']: true,
        })

        return (
            <div className={topBarClass}>

                <div className="tab-container" ref="tabContainer" onScroll={this.onTabScroll}>
                {
                    this.props.tabList.map((item, idx) => {
                        const activeTab = this.props.activeTab === '' ? this.props.tabList[0].id : this.props.activeTab;

                        const tabClass = classNames({
                            "tab-item": true,
                            "active-tab": activeTab === String(item.id),
                        })
                        return (
                            <span
                                className={`${tabClass} ${item.id}`} 
                                key={item.id}
                                onClick={(e) => this.onTabClick(e, item)}
                            >
                                {item.name}
                            </span>
                        )
                    })
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = {
  
};

export default TopBar;
