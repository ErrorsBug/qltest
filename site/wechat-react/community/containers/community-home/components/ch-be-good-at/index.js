import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';  
import ToggleContent from '../../../../components/toggle-content'
import { locationTo } from 'components/util';
 
 
 

@autobind
export default class extends PureComponent{
    state = { 
        isShowProcess:false
    }
     
    componentDidMount = () => { 
    };
        
    render() { 
        const { isGuest,hobby  } = this.props;  
        if(isGuest&&!hobby)return false
        return (
            <Fragment>
                <div className="ch-be-good-at">
                            <div className="ch-be-good-at-head">
                                <div className="ch-be-left">擅长</div>
                                {
                                    !isGuest&&
                                        <div className="ch-be-right on-visible on-log" 
                                            data-log-name="擅长编辑"
                                            data-log-region="ch-be-good-at-content-edit"
                                            data-log-pos="0" 
                                            onClick={()=>locationTo('/wechat/page/university/my-file?editHobby=Y')}>编辑 <i className="iconfont iconxiaojiantou"></i></div>
                                } 
                            </div>
                    {
                        hobby&&
                        <div className="ch-be-good-at-content">
                            <ToggleContent
                                children={hobby} 
                                logName={`擅长`}
                                logRegion={`ch-be-good-at-content`}
                                logPos={1}
                            />
                        </div>
                    }
                </div>
               
            </Fragment>
        )
    }
}
