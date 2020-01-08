import React, { Fragment, Component } from 'react'
import { createPortal } from 'react-dom'
import { locationTo } from 'components/util';

/**
 * 单个话题、系列课显示女子大学
 * @class UniversityBlock
 * @extends {Component}
 */
class UniversityBlock extends Component {
    goUniHome = () => {
        const { isUniAuth } = this.props;
        if(!isUniAuth){
            locationTo('/wechat/page/join-university?ch=qljyx&with_icon=Y')
        }
    }
    render() {
        const { isUniAuth, isShow, isQlLive } = this.props;
        if(!document.querySelector('.portal-container')) return null;
        return (
            <Fragment>
                { !isQlLive && (
                    <div 
                        onClick={ this.goUniHome }
                        className={ `un-block-box on-log on-visible ${ isUniAuth ? '' : 'no' }` }
                        data-log-name="女子大学入口"
                        data-log-region="university-block-btn"
                        data-log-pos="normal">
                        <p>{ isUniAuth? '你已加入千聊女子大学，可免费学习该课' : '加入千聊女子大学，免费学该课' }</p>
                        { !isUniAuth && <div className="un-block-join">了解大学</div>}
                    </div>
                ) }
                {
                    !isUniAuth && createPortal(
                        <div 
                            onClick={ this.goUniHome }
                            className={`uni-block-dialog on-log on-visible ${ isShow ? 'show' : ''}`} 
                            data-log-name="女子大学"
                            data-log-region="university-block-btn"
                            data-log-pos="fixed">
                            <p>{ isUniAuth? '你已加入千聊女子大学，可免费学习该课' : '加入千聊女子大学，免费学该课' }</p>
                            { !isUniAuth && <div className="un-block-join">了解大学</div>}
                        </div>,
                        document.querySelector('.portal-container')
                    )
                }
            </Fragment>
        )
    }
}
export default UniversityBlock