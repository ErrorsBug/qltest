import React, { Component, Fragment } from 'react';
import PressHoc from 'components/press-hoc';
import CardHoc from './card-hoc'
import classnames from 'classnames'

@CardHoc
export default class extends Component{
    render() {
        const { close, url, isShow, className = '', isQlchat } = this.props;
        if(!isShow) return null
        const cls = classnames("notice-dialog-box on-visible", className, {
            "minTop": isQlchat
        })
        return (
            <Fragment>
                <div className={ cls }
                    data-log-name="通知书"
                    data-log-region="un-notice-show"
                    data-log-pos="0">
                    <div className="notice-dialog-img">
                        { !isQlchat && <div className="notice-dialog-btn">长按图片保存，分享给好友</div> }
                        <PressHoc className="notice-dialog-pic" region="un-notice-press">
                            <img src={ url } />
                            <div className="btn-notice-dialog-close" onClick={ close }></div>
                        </PressHoc>
                    </div>
                </div>
            </Fragment>
            
        )
    } 
}
