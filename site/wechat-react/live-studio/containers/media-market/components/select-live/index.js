import React, { Component } from 'react';
import MiddleDialog from 'components/dialog/middle-dialog';

export default class SelectLive extends Component {
    render() {
        const {
            showSelectLiveModal,
            hideSelectLiveModal,
            handleSelectLiveBtnClick,
            createLiveList,
            manageLiveList,
            onSelectLiveClick,
            curSelectedLiveId
        } = this.props;
        return (
            <MiddleDialog
                show = {showSelectLiveModal}
                theme = 'empty'
                close = {false}
                onClose = {hideSelectLiveModal}
                buttons = 'cancel-confirm'
                cancelText = '取消'
                confirmText = '确定'
                buttonTheme ='line'
                onBtnClick = {handleSelectLiveBtnClick}
                className = "select-live-modal"
            >
                    <div className="title">选择直播间</div>
                    <div className={`live-list-container live-list-bottom-border ${createLiveList && createLiveList.length > 0 ? '' : 'hide' }`}>
                        <div className="list-title">我的直播间</div>
                        <ul className="list">
                            {
                                createLiveList ?
                                createLiveList.map((item) => {
                                    return <li 
                                        className={`list-item ${item.liveId === curSelectedLiveId ? 'selected' : ''}`} 
                                        key={item.liveId} 
                                        onClick={() => onSelectLiveClick(item)}
                                    >
                                        {item.liveName} 
                                        <span className={`icon_checked ${item.liveId === curSelectedLiveId ? '' : 'hide' }`}></span>
                                    </li>
                                })
                                :
                                null
                            }
                        </ul>
                    </div>
                    <div className={`live-list-container ${manageLiveList && manageLiveList.length > 0 ? '' : 'hide' }`}>
                        <div className="list-title">我管理的直播间</div>
                        <ul className="list">
                            {
                                manageLiveList ? 
                                manageLiveList.map((item) => {
                                    return <li 
                                        className={`list-item ${item.liveId === curSelectedLiveId ? 'selected' : ''}`} 
                                        key={item.liveId} 
                                        onClick={() => onSelectLiveClick(item)}
                                    >
                                        {item.liveName}
                                        <span className={`icon_checked ${item.liveId === curSelectedLiveId ? '' : 'hide' }`}></span>
                                    </li>
                                }) :
                                null
                            }
                        </ul>
                    </div>
            </MiddleDialog>
        )
    }
}