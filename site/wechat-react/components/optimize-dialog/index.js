import { createPortal } from 'react-dom';
import React, { Component, Fragment } from 'react';

class OptimizeTipDialog  extends Component {
    optimizeTipRender = () => {
        let optimizePoint = this.props.optimizePoint
        if(optimizePoint == 'courseHeadImage'){
            return (
                <Fragment>
                    <div className="title">封面需优化</div>
                    <div className="tip">封面是课程的门面，封面应配合讲师形象、突出课程重点</div>
                    <div className="img p-cover"></div>
                </Fragment>
            )
        }else if(optimizePoint == 'courseTitle'){
            return (
                <Fragment>
                    <div className="title">标题需优化</div>
                    <div className="tip">好的标题应该突出课程特色、用户预期能学到的东西或效果</div>
                    <div className="img p-title"></div>
                </Fragment>
            )
        }else if(optimizePoint == 'courseSummary'){
            return (
                <Fragment>
                    <div className="title">课程概要需优化</div>
                    <div className="tip">课程概要是用户了解课程的主要渠道，直接影响购买率。可填写课程特色、使用人群、课程福利等</div>
                    <div className="img p-summary"></div>
                </Fragment>
            )
        } else if(optimizePoint == 'courseBarrage'){
            return (
                <Fragment>
                    <div className="img p-barrage"></div>
                </Fragment>
            )
        }
    }
    
    render() {
        if(!this.props.showOptimizeDialog){
            return ''
        }
        return createPortal(
            <div className="optimize-tip-dialog">
                <div className="bg" onClick={this.props.hide}></div>
                <div className={`optimize-tip-content${this.props.optimizePoint == 'courseBarrage' ? ' course-barrage' : ''}`}>
                    <span className="close icon_delete" onClick={this.props.hide}></span>
                    <div className="content">{this.optimizeTipRender()}</div>
                </div>
            </div>, document.querySelector('#app')
        )
    }
}

export default OptimizeTipDialog;