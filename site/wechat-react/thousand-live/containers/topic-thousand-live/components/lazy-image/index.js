import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { throttle, autobind } from 'core-decorators';

@autobind
class LazyImage extends PureComponent {
    scroller = null;

    state = {
        unitId: null,
    }

    componentDidMount() {
        const unitId = ~~(Math.random()*1000000);
        this.setState({
            unitId
        }, () => {
            this.context.lazyImg.push(this.refs[unitId]);
        });
    }

    // 删去已完成懒加载的图片
    onLoad() {
        if (this.refs[this.state.unitId].src.trim() == this.refs[this.state.unitId].getAttribute('data-real-src').trim()) {
            this.context.lazyImg.remove(this.state.unitId);
        }
    }

    componentWillUnmount() {
        this.context.lazyImg.remove(this.state.unitId);
    }

    imgOnClick(e) {
        this.props.onClick && this.props.onClick(e);
    }

    render() {
        return (
            <div className={this.props.className} >
                <img ref={this.state.unitId} 
                    id={this.state.unitId} 
                    alt=''
                    data-real-src={this.props.src} 
                    onLoad={this.onLoad}
                    onClick={this.imgOnClick}
                />
            </div>
        );
    }
}

LazyImage.propTypes = {
};

LazyImage.contextTypes = {
  lazyImg: PropTypes.object,
};


export default LazyImage;