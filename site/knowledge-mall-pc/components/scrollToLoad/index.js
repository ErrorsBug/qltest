
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';

import Empty from '../empty-page';
import styles from './style.scss'

class ScrollToLoad extends Component {

    state = {
        loading: false,
    }

    componentWillReceiveProps(nextProps) {
        
    }

    onScroll(e) {
        if (this.props.disable) return;

        const {
            toBottomHeight,
            className,
            loadNext = () => {},
        } = this.props;

        if (this.state.loading || this.props.noMore) {
            return;
        }

        const event = e || window.event;
        const el = event.target;

        // 防止事件冒泡（子元素横向滚动也会触发onscroll事件）
        if (Array.prototype.join.call(el.classList, ',').indexOf('co-scroll-to-load') < 0) {
            return;
        }

        let distanceScrollCount = el.scrollHeight,
            distanceScroll = el.scrollTop,
            topicPageHight = el.clientHeight,
            ddt = distanceScrollCount - distanceScroll - topicPageHight,
            defaultToBottomHeight = 3;

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

    render() {
        var emptyDiv='';
        return (
            <div
                className={classnames(styles['co-scroll-to-load'], this.props.className)}
                onScroll={this.onScroll.bind(this)}
            >
                { this.props.children }

                { !this.props.disable && !this.props.noMore && this.state.loading && <div className={styles['list-loading']}>加载中...</div> }
                { !this.props.disable && this.props.noMore && !this.props.notShowLoaded && <div className={styles['list-nomore']}>没有更多了</div> }
                { !this.props.disable && this.props.noneOne && !this.props.notShowLoaded && <div className={styles['list-nomore']}><Empty show="true" /></div> }
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
    noMore: PropTypes.bool.isRequired,

    //第几页
    page:PropTypes.number,

    //第几页
    noneOne:PropTypes.bool,

    className: PropTypes.string,

    notShowLoaded: PropTypes.bool,
};

ScrollToLoad.defaultProps = {
    disable: false,
}

export default ScrollToLoad;
