import React, { Component } from 'react';
import PropTypes from 'prop-types'; 
import { autobind } from 'core-decorators';

@autobind
class HorizontalMarquee extends Component {

    state = {
        // 是否需要轮播滚动
        needScroll: false,
    }

    static propTypes = {
        // 点击滚动项的回调函数
        callback: PropTypes.func,
        // 滚动速度
        speed: PropTypes.number,
    }

    static defaultProps = {
        callback: (index) => {},
        speed: 30,
    }

    marquee() {
        const container = this.refs.container;
        const contentReal = this.refs['content-real'];
        if (container.scrollLeft >= contentReal.offsetWidth) {
            container.scrollLeft = 0;
        }
        container.scrollLeft += 1;
    }

    componentDidMount() {
        const { speed } = this.props;
        const { component, container } = this.refs;
        const contentReal = this.refs['content-real'];
        // 只有当内容的宽度大于容器的宽度时才需要横向轮播滚动
        setTimeout(() => {
            if (contentReal.offsetWidth > container.offsetWidth) {
                this.setState({needScroll: true});
                let timer = setInterval(this.marquee, speed);
                container.onmouseover = () => {
                    clearInterval(timer);
                }
                container.onmouseout = () => {
                    timer = setInterval(this.marquee, speed);
                }
            }
        }, 1000);
    }

    render() {
        const { children } = this.props;
        let content = children;
        // 如果传进来是数组，则对数组项进行包装并绑定事件处理函数
        if (Array.isArray(children)) {
            content = children.map((item, index) => {
                return (
                    <div key={index} onClick={() => {
                        this.props.callback(index);
                    }}>
                        {item}
                    </div>
                )
            });
        }
        return (
            <div className="co-horizontal-marquee" ref="component">
                <div className="horizontal-marquee-container" ref="container">
                    <div className="content" ref="content-real">
                        { content }
                    </div>
                    {
                        this.state.needScroll &&
                        <div className="content">
                            { content }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default HorizontalMarquee;