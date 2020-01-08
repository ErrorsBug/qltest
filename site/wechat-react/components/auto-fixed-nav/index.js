import React, { Component } from 'react';
import PropTypes from 'prop-types';
import animation from 'components/animation';
import classNames from 'classnames';


/**
 * 下滚到首个导航栏目后显示导航栏，点击导航栏自动滚动到对应栏目
 * @author jiajun.li 20180601
 * 
 * @param {array} config [
 *  {
 *      name
 *      selector
 *      @param {function} getActiveScrollTop 某些需求额外指定显示的临界高度，绝了
 *  }
 * ]
 * @param {string} wrapElSelector
 * @param {function} getEl              此参数为空时，每次滚动都会通过querySelector查询dom；不为空时，查询交给父组件，性能较优
 * @param {function} judgeActiveIndex   getActiveScrollTop引起定制性操作
 */


export default class AutoFixedNav extends Component {
    static propTypes = {
        config: PropTypes.array,
        debounce: PropTypes.any,
        wrapElSelector: PropTypes.string,
        getEl: PropTypes.func,
    }

    state = {
        isShowNav: false,
        activeIndex: undefined,
    }

    constructor(props) {
        super(props);
        this.onScroll = throttleDebounce(this.onScroll, props.debounce || 300)
    }

    render() {
        let { config } = this.props,
            { isShowNav, activeIndex } = this.state;

        return (
            <ul className={`co-auto-fixed-nav${isShowNav ? ' co-auto-fixed-nav-show' : ''}`} ref={r => this.navEl = r}>
                {
                    config.map((item, index) =>
                        <Item
                            key={index}
                            data={item}
                            index={index}
                            isActive={index == activeIndex}
                            onClick={this.onClickItem}
                        />
                    )
                }
            </ul>
        )
    }

    componentDidMount() {
        if (typeof document === 'undefined') return;
        let wrapEl = document.querySelector(this.props.wrapElSelector || 'body');
        if (wrapEl) {
            this.wrapEl = wrapEl;
            wrapEl.addEventListener('scroll', this.onScroll);
            this.onScroll();
        }
    }

    componentWillUnmount() {
        this.wrapEl && wrapEl.removeEventListener('scroll', this.onScroll)
    }

    componentWillReceiveProps({config}) {
        // 不足两个tab的时候隐藏
        if (!config || config.length < 2) {
            this.setState({isShowNav: false})
        }
    }

    onClickItem = index => {
        if (typeof document === 'undefined') return;
        animation.add({
            startValue: this.wrapEl.scrollTop,
            endValue: this.clickItemScrollTopArr[index],
            step: (v) => {
                this.wrapEl.scrollTop = v;
            }
        });
    }

    getEl = selector => {
        return document.querySelector(selector);
    }

    clickItemScrollTopArr = [] // 缓存点击Item时需要滚动的高度

    onScroll = () => {
        // 不足两个tab的时候不触发
        if (!this.props.config || this.props.config.length < 2) return;

        let wrapScrollTop = this.wrapEl.scrollTop;

        // 滚动0时不显示
        if (!wrapScrollTop) return this.setState({isShowNav: false});

        // 所有标题滚动高度存到数组
        let clickItemScrollTopArr = [];
        // 判断是否显示激活状态的高度数组
        let itemActiveScrollTopArr = [];
        let navOffsetHeight = this.navEl.offsetHeight;
        let getEl = this.props.getEl || this.getEl;

        this.props.config.forEach(item => {
            let el = getEl(item.selector);
            let clickItemScrollTop = el ? el.offsetTop - navOffsetHeight : 0;
            clickItemScrollTopArr.push(clickItemScrollTop);
            itemActiveScrollTopArr.push(item.getActiveScrollTop ? item.getActiveScrollTop() : clickItemScrollTop);
        })

        // 判断当前标题
        let activeIndex;

        if (this.props.judgeActiveIndex) {
            activeIndex = this.props.judgeActiveIndex(itemActiveScrollTopArr, wrapScrollTop, this);
        } else {
            for (let i = 0; i < itemActiveScrollTopArr.length; i++) {
                if (wrapScrollTop >= itemActiveScrollTopArr[i]) {
                    activeIndex = i;
                } else {
                    break;
                }
            }
        }

        this.clickItemScrollTopArr = clickItemScrollTopArr;
        this.setState({
            activeIndex,
            isShowNav: activeIndex >= 0
        })
        // 生成邀请卡按钮向下移动
        this.props.shareBtnMove && this.props.shareBtnMove(activeIndex >= 0)
    }
}



class Item extends Component {
    render() {
        let { data, isActive } = this.props;
        let cls = classNames('on-log on-visible', {
            active: isActive
        })
        return (
            <li className={cls}
                data-log-name={data.name}
                data-log-region={data.dataLogRegion || data.name}
                data-log-pos="auto-fixed-nav"
                onClick={this.onClick}>
                {data.name}
            </li>
        )
    }

    onClick = () => {
        this.props.onClick && this.props.onClick(this.props.index);
    }
}




/**
 * 固定不变模块，用于占位
 * 
 * @param {function} getFixedInstance 获取fixed实例，调用里面的onClickItem
 */
export class AutoFixedNavStatic extends React.Component {
    render() {
        let { config, activeIndex } = this.props;

        return (
            <ul className={`co-auto-fixed-nav co-auto-fixed-nav-static`} ref={r => this.navEl = r}>
                {
                    config.map((item, index) =>
                        <Item
                            key={index}
                            data={item}
                            index={index}
                            isActive={index == activeIndex}
                            onClick={this.onClickItem}
                        />
                    )
                }
            </ul>
        )
    }

    /**
     * 本组件不处理，直接调用对应fixed实例里的方法
     */
    onClickItem = index => {
        this.props.getFixedInstance && this.props.getFixedInstance() && this.props.getFixedInstance().onClickItem(index)
    }
}




/**
 * 每隔x秒执行一次，最后延时x秒后执行一次
 */
function throttleDebounce(fun, interval = 200) {
    let timer,
        noStop = false; // 标记timer期间是否有触发

    const setTimer = function (args) {
        if (timer) return;
        timer = setTimeout(function () {
            clearTimeout(timer);
            timer = null;
            if (noStop) {
                noStop = false;
                fun(...args);
                setTimer(args);
            }
        }, interval)
    }

    return function (...args) {
        noStop = true;
        if (!timer) {
            fun(...args);
            setTimer(args);
        }
    }
}