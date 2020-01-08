import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import ReactSwipe from 'react-swipe';
import Indicators from './indicators';

@autobind
class Carousel extends Component {

    data = {
        // 定时器id
        timer: null,
    }

    state = {
        // 当前展示slide的index
        activeSlideIndex: this.props.options.startSlide,
    }

    // slide滑动时候的回调函数
    callback(index, elem) {
        if (typeof this.props.options.callback == 'function') {
            this.props.options.callback(index, elem);
        }
        this.setState({
            activeSlideIndex: index
        });
    }

    // slide滑动完毕时的回调函数
    transitionEnd(index, elem) {
        if (typeof this.props.options.transitionEnd == 'function') {
            this.props.options.transitionEnd(index, elem);
        }
        if (this.props.options.continuous) {
            clearTimeout(this.data.timer);
            this.data.timer = setTimeout(() => {
                this.refs['carousel'].slide(index + 1, this.props.options.speed || 400);
            }, this.props.options.auto || 3000)
        }
    }

    onIndicatorClick(event, index) {
        this.refs['carousel'].slide(index, this.props.options.speed || 400);
    }

    componentDidMount() {
        if (!Array.isArray(this.props.children)) {
            console.error('this.props.children of Carousel component should be a array');
            return false;
        }
    }

    render() {
        const {
            show,
            className,
            options,
            children,
            indicators,
            ref,
        } = this.props;
        return (
            show && Array.isArray(children) && children.length > 0 &&
            <div className={classnames("co-carousel-container", className)}>
                <ReactSwipe swipeOptions={{...options, callback: this.callback, transitionEnd: this.transitionEnd}} key={children.length} ref="carousel">
                    { children }
                </ReactSwipe>
                {
                    indicators && children.length > 1 &&
                    <Indicators count={children.length} activeIndex={this.state.activeSlideIndex} onItemClick={this.onIndicatorClick}/>
                }
            </div>
        )
    }
}

Carousel.propTypes = {
    show: PropTypes.bool,
    className: PropTypes.string,
    options: PropTypes.object,
    indicators: PropTypes.bool,
}

Carousel.defaultProps = {
    // 是否显示轮播区域
    show: true,
    // 自定义类名称
    className: 'co-carousel',
    // 轮播特性配置，配置选项参考https://github.com/thebird/swipe#config-options
    options: {},
    // 是否显示指示点
    indicators: true,
}

export default Carousel;