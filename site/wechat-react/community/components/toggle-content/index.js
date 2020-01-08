import React, { Component } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'  

 

@autobind
export default class extends Component {
    state = {
        isPush:false,
        tcContentHeight:0
    } 
    componentDidMount() { 
        this.setState({
            tcContentHeight:this.tcContent.offsetHeight,
            tcContentPathHeight:this.tcContentPath.offsetHeight,
        })  
    } 
    componentWillReceiveProps(){ 
        this.setState({
            tcContentHeight:this.tcContent.offsetHeight,
            tcContentPathHeight:this.tcContentPath.offsetHeight,
        })  

    }
    async togglePush(e){
        e.stopPropagation()
        const isPush = !this.state.isPush
        await this.setState({
            isPush
        })
    }  
    render() {
        const { isPush, tcContentHeight, tcContentPathHeight} = this.state
        const { children, maxLine=3, pushText='展开', unpushText='收起' ,className,logName,logRegion,logPos} = this.props 
        let newTcContentPathHeight=0
        if(tcContentHeight>tcContentPathHeight){ 
            newTcContentPathHeight=tcContentPathHeight>0?tcContentPathHeight:tcContentHeight
        }
        return (
            <div className={classnames("tc-container",className)}>
                <div className={`tc-item`} style={{WebkitLineClamp:isPush?'unset':maxLine,minHeight:newTcContentPathHeight+'px'}}>
                    <div className="tc-content"  ref={ ref => this.tcContentPath = ref }>
                        {
                            children
                        } 
                    </div>
                    <div className="tc-content tc-hidden" ref={ ref => this.tcContent = ref }>
                        {
                            children
                        } 
                    </div>
                </div>
                {
                    tcContentHeight>newTcContentPathHeight&&(tcContentHeight>tcContentPathHeight||isPush)&&
                    <span className={`tc-toggle  on-log on-visible ${isPush?'tc-cut':'tc-put'}`} 
                        data-log-name={logName+(isPush?'收起':'展开')|| "展开" }
                        data-log-region={logRegion+(isPush?'-cut':'-put')||"put-up"}
                        data-log-pos={ logPos||1 } 
                        onClick={this.togglePush}>
                        <span>{isPush?unpushText:pushText}</span>
                    </span> 
                } 
            </div>
            
        )
    }
}

