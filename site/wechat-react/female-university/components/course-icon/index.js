import React, { PureComponent,Fragment } from 'react' 
import classNames from 'classnames';
import { getVal, locationTo } from 'components/util';
  
//悬浮大学课单按钮 
export default class extends PureComponent{ 
    render() { 
        const {scrolling,isTab ,showBottom,initClick, src} = this.props 
        return (
            <Fragment> 
                <div className={classNames('un-to-course-icon',{
                    'scrolling':scrolling,
                    'scrolling-stop':!scrolling,
                    'show-bottom':showBottom,
                    'tab':isTab,
                    'show-bottom-tab':showBottom&&isTab,
                })} onClick={()=>{initClick?initClick():locationTo(`/wechat/page/join-university-courses`)}}>
                    <img src={src?src:'https://img.qlchat.com/qlLive/business/YYNEUEOA-3OWQ-87IY-1562312884548-FYY69STCY7L9.png'}/>
                </div>
            </Fragment>
        )
    }
}