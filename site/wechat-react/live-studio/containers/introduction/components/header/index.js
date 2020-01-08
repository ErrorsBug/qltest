import React, { Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { MiddleDialog } from 'components/dialog';
import { autobind } from 'core-decorators';
import { locationTo,formatDate } from 'components/util';

@autobind
class Header extends Component {

    state = {
        showDialog:false
    }
    data = {
        defaultLiveLogo : 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png'
    }

    switcDialog() {
        this.setState({
            showDialog:!this.state.showDialog
        })
    }

    changeLive(id) {
        locationTo(`/topic/live-studio-intro?liveId=${id}`);
    }

    render() {

        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-low");

        if (!portalBody) {
            return null;
        }

        return (
            <div className='live-studio-intro-page-header'>
                <div className="live-icon"><img src={`${this.props.logo}?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100`} alt={this.props.liveName}  /></div>
                <div className="mid-flex">
                    <span className="name">{this.props.liveName || '当前账号未创建直播间'}</span>
                    {
                        this.props.isLiveAdmin ?
                            <Fragment>
                                <span className="tag"><img src={require('../../imgs/icon-live-studio.png')} /></span>
                                <span className="exp-date">{formatDate(this.props.liveAdminOverDue,'yyyy/MM/dd')} 到期</span>
                            </Fragment>    
                        :<span className="tag"><img src={require('../../imgs/icon-live-normal.png')}/></span>
                    }
                    
                </div>
                <div className="btn-switch-live" onClick={this.switcDialog}>直播间切换<i className='icon_enter'></i></div>

                {/* 客服咨询二维码 */}            
                {
                    createPortal(
                        <MiddleDialog 
                            show={this.state.showDialog}
                            buttons='none'
                            theme='empty'
                            bghide
                            titleTheme={'white'}
                            className="introduction-org-dialog"
                            onClose={this.switcDialog}
                            title=''>
                                <div className="id-close-modal" onClick={this.switcDialog} ></div>    
                                <div className="introduction-mgr-live-list">
                                <ul>
                                    {
                                        this.props.liveList.map((item, index) => {
                                            return <li key={'live-itme-' + index} onClick={()=>{this.changeLive(item.id)}}>
                                                <span className="logo">
                                                    <img src={`${item.logo || this.data.defaultLiveLogo}?x-oss-process=image/resize,m_fill,limit_0,h_80,w_80`} />
                                                    
                                                    {
                                                        this.props.selectedId == item.id?
                                                            <i className='selected'></i>
                                                        :null    
                                                    }
                                                </span>
                                                {
                                                    item.isLiveAdmin == 'Y' ?
                                                        <span className="tag"><img src={require('../../imgs/icon-live-studio.png')} /></span>
                                                        : <span className="tag"><img src={require('../../imgs/icon-live-normal.png')} /></span>
                                                }
                                                <span className="name">{item.name}</span>
                                                
                                            </li>
                                            ;
                                        })
                                    }

                                </ul>
                                </div>
                        </MiddleDialog>
                    , portalBody)
                }
                
                
            </div>
        );
    }
}

Header.propTypes = {

};

export default Header;