import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import {
    Link
} from 'react-router';
import classnames from 'classnames';
import {
    findDOMNode
} from 'react-dom';

import {
    locationTo
} from '../util';


class CategoryMenu extends Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        autoScroll: PropTypes.bool, // 是否开启自动滚动
    }
    static defaultProps = {
        autoScroll: false,
    }

    state = {
        activeId: ''
    }

    trackPosOfItem = {
        1: 'recommend',
        18: "high-reward",
        22: "children-enlightenment",
        8: "small-primary-high",
        3: "parents-course",
        5: "job-market",
        9: "becoming-beauty",
        7: "educational-training",
        10: "emotion",
        14: "healthy",
        16: "business",
        11: "financing",
        2: "personal-improvement",
        6: "living-interest",
        12: "reading-culture",
        21: "English",
        19: "new-media",
        20: "top-new",
    }

    componentWillMount() {
        let activeId = this.props.activeId;
        if (activeId) {
            this.props.items.forEach((item) => {
                // 如果activeId是二级分类，则取当前分类的父级id作为activeId；
                if (item.id === activeId && item.parentId && item.parentId !== '0') {
                    activeId = item.parentId
                }
            });
        } else {
            activeId = this.props.items.length && this.props.items[0].id;
        }
        this.setState({
            activeId
        });
    }

    componentDidMount() {
        this.activeItemScrollToCenter(this.state.activeId);
        // console.log(this.props.autoScroll)
        if (this.props.autoScroll) {
            this.autoScroll();
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.activeId !== this.props.activeId) {
            this.setState({
                activeId: nextProps.activeId,
            });
        }
    }

    handleItemClick(id, e) {

        if (id === this.state.activeId) {
            return;
        }

        this.setState({
            activeId: id
        });

        if (this.props.onItemClick) {
            this.props.onItemClick(id, e);
        }

        this.activeItemScrollToCenter(id);
    }

    // 滑动激活元素到中间位置
    activeItemScrollToCenter(activeId) {
        let menuDom = findDOMNode(this.refs.categorys);
        let disToLeft = 0;

        for (let i = 0, len = menuDom.children.length; i < len; i++) {
            let itemDom = menuDom.children[i];
            disToLeft += itemDom.offsetWidth || 0;

            if (('' + itemDom.getAttribute('data-id')) === ('' + activeId)) {
                disToLeft -= (itemDom.offsetWidth / 2);
                break;
            }
        }

        disToLeft = disToLeft - findDOMNode(this.refs.categoryMenu).offsetWidth / 2;

        this.menuScrollTo(disToLeft);
    }

    // 将menu滑动一段距离
    menuScrollTo(dis) {
        let menuDom = findDOMNode(this.refs.categoryWrap);
        let scrollLeft = menuDom.scrollLeft;

        // 设置计时器
        this.menuScrollLeftTimer && clearInterval(this.menuScrollLeftTimer);
        this.menuScrollLeftTimer = setInterval(() => {

            // 设置速度，用等式而不用具体数值是为了产生缓动效果；
            scrollLeft = scrollLeft + Math.ceil((dis - scrollLeft) / 3);

            // 作差，产生缓动效果；
            menuDom.scrollLeft = scrollLeft;

            // 判断是否抵达顶部，若是，停止计时器；
            if (Math.abs(dis - scrollLeft) <= 4) {
                menuDom.scrollLeft = dis;
                clearInterval(this.menuScrollLeftTimer);
            }
        }, 60);
    }

    // 获取分类元素列表
    getCategoryLiElements() {
        let ItemList = [];
        this.props.items.filter((item, index) => {
            if (item.type) {
                // if(item.type == "couponCenter") {
                //     ItemList.push((
                //         <li className={`on-log${this.props.showRedPoint ? " redPoint" : ""}`} key={"category-activity"}
                //             onClick={(e) => { locationTo("/wechat/page/coupon-center")}}
                //             data-log-region="menu"
                //             data-log-name={"领券中心"}
                //             data-log-business_type={'tag'}
                //         >
                //             <span>领券中心</span>
                //         </li>
                //     ));
                // }
            } else if (item.parentId === '0' || !item.parentId) {
                ItemList.push((
                    <li key={item.id}
                        className={`on-log ${this.state.activeId === item.id ? 'active': ''}`}
                        onClick={(e) => this.handleItemClick(item.id, e)}
                        data-id={item.id}
                        data-log-region="top-kind"
                        data-log-pos={this.trackPosOfItem[item.id]}
                        data-log-tag_id={item.id}
                        data-log-tag_name={item.name}
                        data-log-business_id={item.id}
                        data-log-name={item.name}
                        data-log-business_type={'tag'}>
                        <span>{item.name}</span>
                    </li>
                ));
            }
        });
        return ItemList;
    }

    // 自动滚动tabs
    autoScroll() {
        let menuDom = this.refs.categorys,
            categoryWrap = this.refs.categoryWrap,
            scrollWidth = categoryWrap.scrollWidth,
            scrollLeft = categoryWrap.scrollLeft,
            offsetWidth = categoryWrap.offsetWidth,
            translateDistance = scrollWidth - offsetWidth - scrollLeft; // translate的距离

        setTimeout(function() {

            menuDom.style.cssText =
                '-moz-transform: translate3d(' + (-translateDistance) + 'px, 0, 0);' +
                '-webkit-transform: translate3d(' + (-translateDistance) + 'px, 0, 0);'
            'transform: translate3d(' + (-translateDistance) + 'px, 0, 0);';

            setTimeout(function() {
                menuDom.style.cssText = '-moz-transition-duration: 0.2s; -webkit-transition-duration: 0.2s; transition-duration: 0.2s;';
            }, 2200);
        }, 1800);
    }

    render() {
        let categoryList = this.getCategoryLiElements();

        return (
            <div ref="categoryMenu" className={classnames("co-category-menu" , this.props.className)}>
                {/*分类列表*/}
                <div ref="categoryWrap" className="category-wrap">
                    <ul ref="categorys" className="categorys">
                        {categoryList}
                    </ul>
                </div>
                {/* <div ref="searchBtn" className="search-btn on-log"
                    onClick={e => locationTo('/wechat/page/search/index')}
                    data-log-region="search"
                    data-log-pos="bar"
                    data-log-name="搜索"
                    data-log-business_type="tab"
                    data-log-business_id="搜索">
                    <i></i>
                </div> */}
            </div>
        );
    }

    componentWillUnmount() {
        clearInterval(this.menuScrollLeftTimer);
    }
};

CategoryMenu.propTypes = {
    items: PropTypes.array,
    activeId: PropTypes.any,
    onItemClick: PropTypes.func,
};

export default CategoryMenu;