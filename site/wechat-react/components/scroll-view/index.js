import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { debounce } from 'lodash';
import EmptyPage from 'components/empty-page';


/**
 * 滚动组件，滚动到底部回调
 * 
 * @author jiajun.li
 * @date 20180402
 */



export default class ScrollView extends Component {
    static propTypes = {
        onScrollBottom: PropTypes.func,         // 滚动到底部回调方法
        lowerThreshold: PropTypes.number,       // 距离底部多少px值时触发回调

        // 内嵌组件的属性
        status: PropTypes.string,               // 底部状态文案 pending|end
        isEmpty: PropTypes.any,                 // 是否显示空列表组件
        emptyComp: PropTypes.any,           // 空列表组件属性，string则定制提示文案，object则具体配置
    }

    static defaultProps = {
        lowerThreshold: 0,
    }

    constructor(props) {
        super(props);
        this.scrollBottomHandler = debounce(this.scrollBottomHandler, 100);
    }

    render() {
        return (
            <div
                className={classNames("co-scroll-view", this.props.className)}
                onScroll={this.onScroll}
                ref={el => this.dom = el}
            >
                <div>
                    {
                        this.props.children
                    }
                    {
                        this.props.status !== undefined && !this.props.isEmpty &&
                        <LoadStatus 
                            status={this.props.status}
                            onClickMore={this.props.onScrollBottom}
                        />
                    }
                </div>
                {
                    this.props.isEmpty &&
                    this.renderEmptyList()
                }
            </div>
        )
    }

    renderEmptyList() {
        let emptyComp = this.props.emptyComp;

        if (typeof emptyComp === 'string') {
            emptyComp = {
                emptyMessage: emptyComp
            };
        }

        return <EmptyPage className="co-scroll-view-empty" show {...emptyComp}/>
    }

    onScroll = e => {
        if (e.target !== this.dom) return;

        this.props.onNativeScroll && this.props.onNativeScroll(e);
        this.props.onScrollBottom && this.scrollBottomHandler();
    }

    scrollBottomHandler = () => {
        if (this.dom.scrollTop + this.dom.clientHeight + this.props.lowerThreshold >= this.dom.scrollHeight) {
            // console.log('scroll to bottom');
            this.props.onScrollBottom();
        }
    }

    // componentDidMount() {
    //     this.handleLackOfHeight();
    // }

    // componentDidUpdate() {
    //     this.handleLackOfHeight();
    // }

    // 首屏加载完后高度不足以滚动时，继续加载
    // handleLackOfHeight = debounce(() => {
    //     if (!this.props.isHandleLakeOfHeight) return;
    //     if (this.dom.clientHeight < this.dom.scrollHeight) return;
    //     console.log('lack of height, load more.');
    //     this.props.onScrollBottom && this.props.onScrollBottom();
    // }, 200)
}



export class LoadStatus extends React.PureComponent {
    static propTypes = {
        status: PropTypes.string,
        onClickMore: PropTypes.func,
    }

    render() {
        const status = this.props.status;

        return <div className="co-load-status">
            {
                status === 'pending'
                    ? 
                    <span>拼命加载中<span className="co-loading-ellipsis"></span></span>
                    :
                    status === 'end'
                        ? 
                        <span>没有更多了</span>
                        :
                        <div onClick={this.props.onClickMore}>加载更多</div>
            }
        </div>
    }
}
