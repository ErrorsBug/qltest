import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';
import { locationTo } from 'components/util';
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom';
import RightBottomIcon from '../../../../components/right-bottom-icon';
import { getUrlParams } from 'components/url-utils';


@autobind
export default class extends PureComponent{
    state={
        isShow:false
    }
    imgDialog=()=>{  
        this.setState({
            isShow:true
        }) 
    }
    close=(e)=>{   
        e.preventDefault();
        e.stopPropagation()
        this.setState({
            isShow:false
        })
    }
    render() {
        const { isShow } = this.state
        const { keyH,keyI,keyJ,scrolling } = this.props;  
        if(!keyH)return false  
        return ( 
                <RightBottomIcon className="cl-teacher-dialog" scrolling={scrolling} initClick={this.imgDialog}>
                    <div className="cl-td-icon on-visible on-log" 
                        data-log-name="学院悬浮icon"
                        data-log-region="un-cl-icon"
                        data-log-pos={getUrlParams('nodeCode', '')}>
                        <Picture src={keyH} resize={{w:176,h:188}} /> 
                    </div>
                    {
                        keyI&&createPortal(
                            <MiddleDialog 
                                show={isShow  }
                                onClose={(e)=>this.close(e)}
                                className="cl-teacher-dialog-img">
                                    <span onClick={ (e)=>this.close(e) }></span>
                                    <div className="on-visible on-log" 
                                        data-log-name="学院弹窗图片"
                                        data-log-region="un-cl-img"
                                        data-log-pos={getUrlParams('nodeCode', '')} onClick={()=>{keyJ&&locationTo(keyJ)}}> 
                                        <Picture  src={keyI} resize={{w:678,h:918}} />
                                    </div>
                            </MiddleDialog>
                            ,document.getElementById('app'))
                    } 
                </RightBottomIcon> 
                 
        )
    }
}