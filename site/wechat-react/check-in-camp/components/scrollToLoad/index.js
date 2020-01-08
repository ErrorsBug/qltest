
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Empty from '../empty-page';


class ScrollToLoad extends Component {

    state = {
        loading: false,
        noMore: this.props.noMore,
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            noMore: nextProps.noMore,
        })
    }

    onScroll(e) {
        if (this.props.disable) return;

        const {
            toBottomHeight,
            className,
            loadNext = () => {},
        } = this.props;

        const event = e || window.event;
        const el = event.target;

        let distanceScrollCount = el.scrollHeight,
            distanceScroll = el.scrollTop,
            topicPageHight = el.clientHeight,
            ddt = distanceScrollCount - distanceScroll - topicPageHight,
            defaultToBottomHeight = 3;

        //在滚动的时候自定义操作
        /**
         * @param e 事件对象
         * @param distanceScroll 滚动的距离
         * @param distanceScrollCount 总高度
         * @param scrollHeight 节点的滚动高度
         * 在判断是否正在加载和是否无更多数据之前执行的原因是
         * 在无更多数据不做加载操作还能做自定义的操作
         */
        if (this.props.scrollToDo) {
            this.props.scrollToDo(e, distanceScroll, topicPageHight, distanceScrollCount);
        }

        // 添加noneOne的判断
        if (this.state.loading || this.state.noMore || this.props.noneOne) {
            return;
        }

        

        // 防止事件冒泡（子元素横向滚动也会触发onscroll事件）
        if (Array.prototype.join.call(el.classList, ',').indexOf('co-scroll-to-load') < 0) {
            return;
        }

        

        if (toBottomHeight) {
            defaultToBottomHeight = toBottomHeight;
        }

        if (ddt < defaultToBottomHeight) {
            this.setState({
                loading: true,
            });

            loadNext(() => {
                this.setState({
                    loading: false,
                });
            });
        }
    }

    disableScroll(e){
        if (this.props.disableScroll) {
            e.preventDefault();
        }
    }

    render() {
        var emptyDiv='';
        return (
            <div
                className={classnames('co-scroll-to-load', this.props.className)}
                onScroll={this.onScroll.bind(this)}
                onTouchMove={this.disableScroll.bind(this)}
                onWheel={this.disableScroll.bind(this)}
            >
                <main>
                    { this.props.children }
                </main>

                { !this.props.disable && this.state.loading && <div className='list-loading'>加载中...</div> }
                { !this.props.disable && this.state.noMore && !this.props.notShowLoaded && <div className='list-nomore'>没有更多了</div> }
                { !this.props.disable && this.state.noMore && !this.props.notShowLoaded && this.props.bottomText !== null && <div className='list-nomore'>{this.props.bottomText}</div> }
                {!this.props.disable && this.props.noneOne && !this.props.notShowLoaded && <div className='list-nomore'>
                    <Empty show={true} emptyPicIndex={this.props.emptyPicIndex||0} emptyMessage={this.props.emptyMessage||''} />
                    {/* emptyPicIndex 空页面icon自定义参数， emptyMessage  空页面自定义文案    */}
                </div> }
                { (!(!this.props.disable && this.state.loading) && !(!this.props.disable && this.state.noMore && !this.props.notShowLoaded)) && this.props.footer && <div className='need-space'></div> }

                { this.props.footer && this.props.footer }

            </div>
        );
    }
}

ScrollToLoad.propTypes = {

    // 滚动触发者，默认是id为app的元素
    // trigger: PropTypes.string,

    disable: PropTypes.bool,

    // 滚动到底部时调用
    loadNext: PropTypes.func,

    // 距离底部多少时触发
    toBottomHeight: PropTypes.number,

    // 是否还有更多
    noMore: PropTypes.bool,

    //第几页
    page:PropTypes.number,

    //是否暂无数据
    noneOne: PropTypes.bool,
    //空页面icon自定义参数，
    emptyPicIndex: PropTypes.number,  
    //空页面自定义文案 
    emptyMessage: PropTypes.string,

    className: PropTypes.string,

    notShowLoaded: PropTypes.bool,
    // 滚动事件自定义操作函数
    scrollToDo: PropTypes.func,

    // 是否禁用滚动
    disableScroll: PropTypes.bool,
    // 底部自定义文案
    bottomText: PropTypes.string,
};

ScrollToLoad.defaultProps = {
    disable: false,
    disableScroll: false,
    bottomText: null,
}

export default ScrollToLoad;
