import React, { PureComponent } from 'react'
import classnames from 'classnames'

/**
 * 下拉显示，或者置顶显示
 * 
 * @export
 * @class
 * @extends {PureComponent}
 */
export default class extends PureComponent {
    state = { 
        isShowNav: false, // 判断是否为下拉
    }
    isOnce = false;
    isTopShow = 0;
    scrollNode = null
    componentDidMount(){
        this.initScroll();
    }
    componentWillUnmount() {
        if(this.scrollNode){
            // 对于主站使用href跳转，路由切换时componentWillUnmount是不会触发。这样无法做一些逻辑上的处理
            this.scrollNode.removeEventListener('scroll',() => {}, false)
        }
    }
    initScroll() {
        const { scrollNode, isDownShow } = this.props
        this.scrollNode = document.querySelector(`.${ scrollNode }`)
        if(this.scrollNode){
            this.scrollNode.addEventListener('scroll', (e) => {
                const { top, height } = this.outerBox.getBoundingClientRect();
                const courTop = isDownShow ? (top + height) : top
                if(courTop > 0){
                    if(top > 0){
                        this.innerBox.classList.remove('scroll')
                            if(this.state.isShowNav){
                            this.setState({isShowNav: false})
                        }
                    }
                } else {
                    this.innerBox.classList.add('scroll')
                    if(this.isTopShow > (top + 10) && !this.isOnce){ // 上
                        this.isOnce = true;
                        this.setState({isShowNav: false})
                    } else if(this.isOnce && (this.isTopShow + 20) < top ){ //  下
                        this.isOnce = false
                        this.setState({isShowNav: true})
                    }
                    this.isTopShow = top;
                }
            },false)
        }
    }
    render() {
        /**
         * outerClass: 外层样式
         * innerClass: 内层样式
         * isDownShow: 是否下拉显示置顶导航
         */
        const { children, outerClass, innerClass, isDownShow, style={} } = this.props;
        const { isShowNav } = this.state;
        const outCls = classnames('roll-down-box',outerClass)
        const innerCls = classnames('roll-down-inner',innerClass, {
            "fixed": isDownShow && !isShowNav,
            "down": isDownShow && isShowNav
        })
        return (
            <div className={ outCls } ref={ r => this.outerBox = r }>
                <div className={ innerCls } style={ style } ref={ r => this.innerBox = r }>
                    <div>
                        { children }
                    </div>
                </div>
            </div>
        );
    }
}