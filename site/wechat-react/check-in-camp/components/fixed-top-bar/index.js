import React, { Component, Fragment } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import TabBar from './components/tab-bar';

@autobind
export default class FixTopBar extends Component {
    static propTypes = {
        tabList: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        })).isRequired,
        defaultActiveTab: PropTypes.string,
        onTabChange: PropTypes.func,
        // 要监听的滚动层class
        scrollContainer: PropTypes.string,
    }

    static defaultProps = {
        tabList: [],
        defaultActiveTab: null,
        onTabChange: ({type, title}) => {}
    }

    constructor(props) {
        super(props)
        const defaultActiveTab = props.defaultActiveTab || props.tabList[0].type;
        this.state = {
            isScrolling: false,
            activeTabType: defaultActiveTab,
            activeLineWidth: 0,
            activeLineLeft: 0,
            hideFixedTopBar: true,
        }
    }

    componentDidMount = () => {
        const topActiveTab = document.querySelector(".component-active-tab-item");
        const left = topActiveTab && topActiveTab.offsetLeft;
        const width = topActiveTab && topActiveTab.clientWidth;
        this.setState({
            activeLineWidth: width,
            activeLineLeft: left,
        });
        this.topTabDom = findDOMNode(this.tabBar);
        // console.log(this.tabBar)

        this.initScroll();
    }

    initScroll() {
        if (!this.props.scrollContainer) {
            window.onscroll = this.handleScroll;
        } else {
            setTimeout(() => {
                const scrollContainer = document.querySelector(`.${this.props.scrollContainer}`);
                // console.log(scrollContainer)
                if ( scrollContainer ) {
                    // const oldScrollHandler = scrollContainer.onscroll;
                    scrollContainer.addEventListener('scroll', () => {
                        // oldScrollHandler();
                        this.handleScroll();
                    });
                    // scrollContainer.onscroll = this.handleScroll
                }
            },0)
        }
    }

    componentDidUpdate() {
        if (!this.topTabDom) {
            this.topTabDom = findDOMNode(this.tabBar);
        } 

    }


    handleScroll(e) {
        // console.log(1111)
        this.reqAnimateId = requestAnimationFrame(this.checkTabTopIfInViewBox);
    }

    checkTabTopIfInViewBox() {
        if (!this.topTabDom) return
        const box = this.topTabDom.getBoundingClientRect();
        // console.log(box.top);
        if (box.top < 0 && this.state.hideFixedTopBar) {
            this.setState({hideFixedTopBar: false});
        } else if (box.top > 0 && !this.state.hideFixedTopBar){
            this.setState({hideFixedTopBar: true});
        }
        // console.log(1)
        // this.reqAnimateId = requestAnimationFrame(this.checkTabTopIfInViewBox)
    }

    componentWillUnmount = () => {
        cancelAnimationFrame(this.reqAnimateId);
    }
    
    
    onTabClick(e, type) {
        const left = e.target.offsetLeft;
        const width = e.target.clientWidth;
        this.setState({
            activeTabType: type,
            activeLineWidth: width,
            activeLineLeft: left,
        });
        this.props.onTabChange(type);  
    }

    clickTab(type) {
        const tab = document.querySelector(`#${type}`)
        if ( tab ) {
            tab.click();
        } else {
            console.log('没有 type 为' + type + '的 Tab')
        }

        return 
    }

    render() {

        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-low");
        // console.log(portalBody)
        if (!portalBody) return null
        
        // console.log(this.state.hideFixedTopBar)
        return (
            <Fragment>
                {
                    ReactDOM.createPortal(
                        <TabBar
                            hide={this.state.hideFixedTopBar}
                            className={`component-fixed-top-tab ${this.props.className}`}
                            tabList={this.props.tabList}
                            activeTabType={this.state.activeTabType}
                            activeLineWidth={this.state.activeLineWidth}
                            activeLineLeft={this.state.activeLineLeft}
                            onTabClick={this.onTabClick}
                        />,
                        portalBody,
                    )
                }
                <TabBar
                    ref={(el) => this.tabBar = el}
                    hide={false}
                    className={this.props.className}
                    tabList={this.props.tabList}
                    activeTabType={this.state.activeTabType}
                    activeLineWidth={this.state.activeLineWidth}
                    activeLineLeft={this.state.activeLineLeft}
                    onTabClick={this.onTabClick}
                />
            </Fragment>
        )
    }
}
