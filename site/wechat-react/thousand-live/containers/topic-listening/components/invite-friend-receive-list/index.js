import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import {formatDate} from 'components/util';

@autobind
class ReceiveListOfInviteFriendsToListen extends Component {

    constructor(props){
        super(props)
        this.state = {
            show: false,
        }
    }

    componentDidMount(){

    }

    show(){
        if(this.props.userList.length < 1){
            window.toast('暂时没有人抢到')
            return
        }
        this.setState({show: true})
    }

	render(){
        if(!this.state.show){
            return ''
        }
	    return (
		    <div className="receive-list-container">
			    <div className="bg" onClick = {()=>{this.setState({show: false})}}></div>
                <div className="tip">
                    <div className="icon_mascot"></div>
                    <p>剩余{this.props.remaining}个名额，点击右上角“…”发送给你的好友</p>
                </div>
                <div className="receive-list-content">
                    <div className="header">剩余{this.props.remaining}个名额<span onClick = {()=>{this.setState({show: false})}}>取消</span></div>
                    <div className="list-user">
                        {
                            this.props.userList && this.props.userList.length > 0 && this.props.userList.map((item, index) => (
                                <div className="list" key={`list-${index}`}>
                                    <img src={item.headImg} alt=""/>
                                    <p className="name">{item.name}</p>
                                    <span className="time">{formatDate(item.receiveTime, 'yyyy-MM-dd hh:mm')}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
		    </div>
        )
    }
}

export default ReceiveListOfInviteFriendsToListen;