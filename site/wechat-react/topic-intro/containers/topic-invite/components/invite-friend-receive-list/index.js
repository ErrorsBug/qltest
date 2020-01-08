import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import {formatDate} from 'components/util';
import {getReceiveInfo} from 'common_actions/common';
import { createPortal } from 'react-dom';

@autobind
class ReceiveListOfInviteFriendsToListen extends Component {

    constructor(props){
        super(props)
        this.state = {
            show: false,
            remaining: 10,
            userList: []
        }
    }

    componentDidMount(){

    }

    async show(){
        // 如果已经请求过列表接口，就没必要再次请求
        if(this.initFetch){
            this.setState({show: true})
            return 
        }
        let inviteFreeShareId = this.props.inviteFreeShareId
        if(!inviteFreeShareId){
            window.toast('链接参数不完整')
            return
        }
        const result = await getReceiveInfo({inviteFreeShareId})
        if(result.state.code === 0){
            this.initFetch = true
            if(result.data.userList.length < 1){
                window.toast('暂无数据')
                return 
            }
            this.setState({
                show: true,
                userList: result.data.userList,
                remaining: result.data.remaining,
            })
        }
    }

	render(){
        if(!this.state.show){
            return ''
        }
	    return createPortal(
		    <div className="receive-list-container">
			    <div className="bg" onClick = {()=>{this.setState({show: false})}}></div>
                <div className="receive-list-content">
                    <div className="header">剩余{this.state.remaining}个名额<span onClick = {()=>{this.setState({show: false})}}>取消</span></div>
                    <div className="list-user">
                        {
                            this.state.userList && this.state.userList.length > 0 && this.state.userList.map((item, index) => (
                                <div className="list" key={`list-${index}`}>
                                    <img src={item.headImg} alt=""/>
                                    <p className="name">{item.name}</p>
                                    <span className="time">{formatDate(item.receiveTime, 'yyyy-MM-dd hh:mm')}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
		    </div>, document.getElementById('app')
        )
    }
}

export default ReceiveListOfInviteFriendsToListen;