import React, { Component } from 'react';
import  { formatDate } from 'components/util';

class PushData extends Component {
    componentDidMount() {
    }
    
    getPushType(type) {
        switch (type) {
            case 'matrix':return '千聊公众号矩阵'
            case 'kaifang':return '自己的服务号'
            case 'qlchat':return '我的订阅'
        }
    }

    render() {
        return (
            <div 
                className="push-data-box"
            >
                <div className="update-time">
                    <span className='content'>
                    数据已更新至{formatDate(Date.now(), 'yyyy-MM-dd')} 08:00:00
                    </span>
                    <span className="btn-dialog" onClick={this.props.methodDialogClick}></span>
                </div>  
                {
                    this.props.pushTaskList.map((item,idx)=>{
                        return <ul className="data-list" key={`push-task-${idx}`}>
                            <li className="data-item">
                                <div className="top-content">
                                    <span>
                                        <b className='title'>推送渠道：</b>
                                        <var className='content'>{this.getPushType(item.pushType)}</var>
                                    </span>
                                    <span>
                                        <b className='title'>推送时间：</b>
                                        <var className='content'>{formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')}</var>
                                    </span>
                                </div>
                                <div className="bottom-content">
                                    <span>
                                        <b>{typeof(item.pushNum)=='number'?item.pushNum:'未更新'}</b>
                                        <var>推送人数</var>
                                    </span>
                                    <span>
                                        <b>{typeof(item.pushSuccessNum)=='number'?item.pushSuccessNum:'未更新'}</b>
                                        <var>送达人数</var>
                                    </span>
                                    <span>
                                        <b>{typeof(item.pageView)=='number'?item.pageView:'未更新'}</b>
                                        <var>访问次数</var>
                                    </span>
                                    <span>
                                        <b>{typeof(item.uniqueVisitor)=='number'?item.uniqueVisitor:'未更新'}</b>
                                        <var>访问人数</var>
                                    </span>
                                </div>
                            </li>
                        
                        
                        </ul>
                    })
                }
                {
                    this.props.pushNoOne?
                        <div className="no-one">
                            没有任何内容哦
                        </div>
                    :this.props.pushNoMore?
                        <div className="no-more">没有更多了...</div>
                        :null
                }
            </div>
        );
    }
}

export default PushData;