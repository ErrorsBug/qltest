import React, { Component } from 'react';
import classNames from 'classnames';


/**
 * 自动收缩视图
 * 
 * 住：异步加载的内容获得前不要渲染本组件
 * 
 * @param maxHeight {number} 收缩临界高度
 */
export default class FoldView extends Component {
    state = {
        isNeedFold: true,
        isFolded: true,
    }

    componentDidMount() {
        this.fixImgWidth();
        this.judgeIsNeedFold();
    }

    render() {
        let { className, maxHeight } = this.props;

        let isFolded = this.state.isNeedFold && this.state.isFolded;
        let cls = classNames(className, '__fold-view', {
            '__fold-view-disabled': !this.state.isNeedFold,
            '__fold-view-folded': isFolded
        });

        return (
            <div className={cls}>
                <div className="__fold-view-container" style={{maxHeight: isFolded ? maxHeight : false}}>
                    <div className="__fold-view-content" ref={r => this.contentEle = r}>{this.props.children}</div>
                    <div className="__fold-view-controller" onClick={this.toggleFolded}>
                        <p>{this.state.isFolded ? '查看全部' : '收起'}<i className="icon_up"></i></p>
                    </div>
                </div>
            </div>
        )
    }

    // 修正图片宽度
    fixImgWidth = () => {
        Array.prototype.slice.call(this.contentEle.querySelectorAll('img')).forEach(img => {
            img.addEventListener('load', this.imgOnloadCallback);
        })
    }

    imgOnloadCallback = e => {
        let target = e.target,
            width = target.clientWidth;
        target.style.width = width >= 800 ? '100%' : (width * window.dpr + 'px');
        target.removeEventListener('load', this.imgOnloadCallback);

        // 图片加载完再判断一次是否需要折叠
        this.judgeIsNeedFold();
    }

    judgeIsNeedFold = () => {
        // 已判断过需要折叠的，可以跳过再次判断
        if (this._hasJudgeIsNeedFold) return;

        let isNeedFold = this.contentEle.offsetHeight > (this.props.maxHeight || 600);
        if (isNeedFold) {
            this._hasJudgeIsNeedFold = true;
        }
        this.setState({
            isNeedFold
        })
    }

    toggleFolded = () => {
        this.setState({
            isFolded: !this.state.isFolded
        })
    }
}

