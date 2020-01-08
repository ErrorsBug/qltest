import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {MiddleDialog} from 'components/dialog';
import style from './style.scss'
import drawCard from './drawCard'
import {
    fillParams
} from 'components/url-utils'

const QRCode = require('qrcode')

@autobind
class FissionCardDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            imgUrl: '',
	        timestamp: 0
        }
    }
    
    componentWillReceiveProps(props) {
    
    }
    
    componentDidMount() {
        //this.initCard()
    }
    
    async initCard() {
        let {unlockCourseInfo = {cardUrl: ''}, userInfo} = this.props
        const curHost = window.isProd === true ? window.location.href.replace(window.location.host, 'ql.kxz100.com') : window.location.href;
        let qrcode = await QRCode.toDataURL(fillParams({unlockUserId: userInfo.userId, wcl: 'unlock_page'}, curHost))
        let background = unlockCourseInfo.cardUrl
        let imgUrl = await drawCard({
            background: background,
            headImg: userInfo.headImgUrl,
            nickName: userInfo.name,
            desc: '这个课程非常好，想邀你和我一起学',
            qrCode: qrcode
        })
        this.setState({
            imgUrl
        })
    }
    
    async show() {
        if(!this.state.imgUrl) {
            await this.initCard()
        }
        this.setState({
            isShow: true
        })
	    // 手动触发打曝光日志
	    typeof _qla != 'undefined' && _qla.collectVisible();
	    
    }
    
    hide() {
        this.setState({
            isShow: false
        })
    }
	
	countTimeStart() {
        if (window.performance.now) {
        	this.state.timestamp = window.performance.now()
        }
	}
	
	countTimeEnd () {
		if (window.performance.now) {
			let now = window.performance.now()
			if(now - this.state.timestamp > 300) {
				typeof _qla != 'undefined' && _qla('event', {
					category: 'focus_deblocking_card',
					action:'success',
				});
			}
		}
	}
    
    render() {
        let {unlockCourseInfo = {}} = this.props
        return (
            <MiddleDialog
                show={this.state.isShow}
                ref='fissionCard'
                theme='empty'
                onClose={this.hide}
                buttons='empty'
                className='fission-card-container'
                contentClassName=''
            >
                <main className="fission-card-dialog-container">
                    <div className="box on-log on-visible"
                         data-log-region="deblocking_card"
                         data-log-pos="">
                        <img className="card on-log on-visible"
                             src={this.state.imgUrl}
                             onTouchStart={() => {this.countTimeStart()}}
                             onTouchEnd={() => {this.countTimeEnd()}}
                             onTouchCancel={() => {this.countTimeEnd()}}/>
                             <div className="bottom-btn">
                                <p className="large">长按图片保存，发送给好友</p>
                                <p>{unlockCourseInfo.limitCount}位好友报名，你就能解锁全部课程</p>
                             </div>
                    </div>
                </main>
            </MiddleDialog>
        )
    }
}

export default FissionCardDialog
