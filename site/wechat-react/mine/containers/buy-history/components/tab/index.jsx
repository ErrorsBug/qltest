import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';

export default class TabLabel extends Component {
    static propTypes = {
        // 数组中的元素为{labelName: '', sign: '一个标识的内容', belongParentIndex: 上级标签的位置(子集标签才有)}
        listInfo: PropTypes.array,
        // li节点类名
        liClassName: PropTypes.string,
        // section节点类
        sectionClassName: PropTypes.string,
        // ul节点类
        ulClassName: PropTypes.string,
        // 点击处理
        labelClickFunc: PropTypes.func,
        // 是否收起
        isPickedUp: PropTypes.bool,
        // activeLabelSign: 当前激活标签的对应标记
        // 是否要点击标签自动移动到中间
        useAutoCenter: PropTypes.bool,
    }
    static defaultProps = {
        listInfo: [],
        liClassName: '',
        sectionClassName: '',
        ulClassName: '',
        isPickedUp: false,
        useAutoCenter: true,
    }
    data = {
        menuScrollLeftTimer: null,
        firstScrollCenter: true, // 第一次
        didMount: false,
    }

    componentDidMount() {
        this.data.didMount = true;
    }
    componentWillReceiveProps(nextProps) {
        if (this.data.didMount && this.data.firstScrollCenter && this.props.useAutoCenter) {
            if (this.refs.categorys.children.length > 0) {
                this.data.firstScrollCenter = false;
                this.activeItemScrollToCenter(nextProps.activeLabelSign);
            }
        }
    }

    switchLabel(e, sign, belongParentIndex) {
        e.preventDefault();
        e.stopPropagation();

        if (this.props.useAutoCenter) {
            this.handelItemClick(sign, e);
        }

        // 处理父级函数
        this.props.labelClickFunc(sign, belongParentIndex);
    }

    handelItemClick(sign, e) {

        if (sign === this.props.activeLabelSign) {
            return;
        }

        this.activeItemScrollToCenter(sign);
    }

    // 滑动激活元素到中间位置
    activeItemScrollToCenter(activeSign) {
        let menuDom = findDOMNode(this.refs.categorys);
        let disToLeft = 0;

        for (let i = 0, len = menuDom.children.length; i < len; i++) {
            let itemDom = menuDom.children[i];
            disToLeft += itemDom.offsetWidth || 0;

            if (('' + itemDom.getAttribute('data-sign')) === ('' + activeSign)) {
                disToLeft -= (itemDom.offsetWidth / 2);
                break;
            }
        }

        disToLeft = disToLeft - findDOMNode(this.refs.categoryMenu).offsetWidth / 2;

        this.menuScrollTo(disToLeft);
    }

    // 将menu滑动一段距离
    menuScrollTo(dis) {
        let menuDom = findDOMNode(this.refs.categorys);
        let scrollLeft = menuDom.scrollLeft;

        // 设置计时器
        this.data.menuScrollLeftTimer && clearInterval(this.data.menuScrollLeftTimer);
        this.data.menuScrollLeftTimer = setInterval(() => {
            // 设置速度，用等式而不用具体数值是为了产生缓动效果；
            scrollLeft = scrollLeft + Math.ceil((dis - scrollLeft) / 3);

            // 作差，产生缓动效果；
            menuDom.scrollLeft = scrollLeft;

            // 判断是否抵达顶部，若是，停止计时器；
            if (Math.abs(dis - scrollLeft) <= 4) {
                menuDom.scrollLeft = dis;
                clearInterval(this.data.menuScrollLeftTimer);
            }
        }, 60);
    }
    render() {
        var liDOM = null;
        if (this.props.listInfo instanceof Array) {
            liDOM = this.props.listInfo.map((item, index) => {
                return (
                    <li
                        className={classnames('on-log', this.props.liClassName, 'label-item', {active: this.props.activeLabelSign == item.sign})}
                        key={`olabel${index}`}
                        data-sign={item.sign}
                        onClick={(e) => {this.switchLabel(e, item.sign, item.belongParentIndex)}}
                        data-id={item.sign}
                        data-log-region={this.props.region}
                        data-log-tag_id={item.sign}
                        data-log-tag_name={item.labelName}
                        data-log-business_id={item.sign}
                        data-log-name={item.labelName}
                        data-log-business_type={'tag'}
                        >
                        <span className="label-item-link">
                            {item.labelName}
                        </span>
                    </li>
                );
            });
        }
        return (
            <section className={classnames("one-level-label-box", this.props.sectionClassName, {'pick-up': this.props.isPickedUp})} ref="categoryMenu">
                <ul className={classnames("one-level-label-inner", this.props.ulClassName)} ref="categorys">
                    {liDOM}
                </ul>
            </section>
        );
    }
}
