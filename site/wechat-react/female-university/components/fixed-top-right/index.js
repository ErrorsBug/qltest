import React, { PureComponent,Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom' 
import { locationTo } from 'components/util';

  

export default class extends PureComponent{
    state={
        on:0
    }
    
    componentDidMount = () => {  
    };
    componentDidUpdate(){ 
    } 
    render() {
        const { children,url } = this.props; 
        return (
            <div className="un-fixed-top-right on-log on-visible" 
                data-log-name={'右上角浮窗'}
                data-log-region="un-fixed-top-right"
                data-log-pos="0"
                onClick={()=>{url&&locationTo(url)}}> 
                 {children}
            </div>
        )
    }
}