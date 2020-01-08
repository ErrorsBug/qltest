import React, { Component, Fragment } from 'react';

class OptimizeTipDialog  extends Component {
    state = {
        
    }

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
        }
    }
    
    render() {
        if(!this.props.showOptimizeDialog){
            return ''
        }
        return (
            <div className="optimize-tip-dialog">
                <div className="bg" onClick={this.props.hide}></div>
                <div className="optimize-tip-content">
                    <span className="close icon_delete" onClick={this.props.hide}></span>
                    <div className="content">{this.optimizeTipRender()}</div>
                    {
                        this.props.optimizePoint == 'courseHeadImage' ? 
                        <div className="btn on-log" data-log-region="course_optimize" data-log-pos="cover_upload" onClick={this.props.jump}>重新上传封面</div> : (
                            this.props.optimizePoint == 'courseTitle' ? 
                            <div className="btn on-log" data-log-region="course_optimize" data-log-pos="title_edit" onClick={this.props.jump}>去更改标题</div> : (
                                this.props.optimizePoint == 'courseSummary' ? 
                                <div className="btn on-log" data-log-region="course_optimize" data-log-pos="introduce_edit" onClick={this.props.jump}>修改课程概要</div> : null
                            )
                        )
                    }
                </div>
            </div>
        );
    }
}

export default OptimizeTipDialog;