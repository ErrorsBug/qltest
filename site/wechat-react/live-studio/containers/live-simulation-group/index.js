import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators'
import Page from 'components/page';
import {simulateChatGroup} from 'actions/learn-everyday';
import { locationTo } from 'components/util';
import { createPortal } from 'react-dom';


const Item = ({headImg, name, content, contentType, isSelfUser, imgView})=>{
    return (
        <div className={`component ${isSelfUser == 'Y' ? 'right' : 'left'}`}>
            {isSelfUser == 'N' && <img src={headImg} alt=""/>}
            <div className="info">
                {name && <div className="name">{name}</div>}
                <Content contentType = {contentType} content = {content} imgView = {imgView}/>
            </div>
            {isSelfUser == 'Y' && <img src={headImg} alt=""/>}
        </div>
    )
}

const Content = ({contentType, content, imgView}) => {
    if(contentType == 'text'){
        return ( <div className="text-content">{content}</div> )
    }else if(contentType == 'image') {
        return ( <img src = {content.picurl} className="image-content" onClick={imgView}/> )
    }else if(contentType == 'article'){
        return (
            <div className="article-content" onClick = {()=>{locationTo(content.url)}}>
                <div className="article-title">{content.title}</div>
                <div className="article-info">
                    <div className="tip">{content.description}</div>
                    <img src={content.picurl} alt=""/>
                </div>
            </div>
        )
    }
}

@autobind
class SimulationGroup extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,//是否正在loading
            time: '',//时间
            info: {},//初始化信息
            renderList: [],//要被渲染的信息列表
            showImageViewer: '',
            imageViewerWidth: 0,
            imageViewerHeight: 0,
        }
    }

    componentDidMount() {
        this.fetchData()
        this.initTime()
        this.switchPage()
    }

    // 从loading界面切换到聊天界面
    switchPage(){
        let swithInterval = setInterval(_=>{
            if(this.hasLoad){
                this.setState({loading: false})
                this.autoChat()
                clearInterval(swithInterval)
            }
        }, 2000)
    }

    // 聊天功能自动播放
    autoChat(){
        if(!Array.isArray(this.state.info.msgList)){
            return
        }
        let interval = setInterval(()=>{
            if(this.state.renderList.length == this.state.info.msgList.length){
                clearInterval(interval)
            }
            this.animation()
        }, 1500)
    }

    // 初始化信息
    async fetchData(){
        let viewTimes = Number(window.localStorage.getItem('simulateChatGroupViewTimes')) + 1
        const result = await simulateChatGroup({viewTimes, groupId: this.props.location.query.groupId || ''})
        if(result.state.code === 0){
            this.setState({info: result.data || {}})
            this.hasLoad = true
        }
        window.localStorage.setItem('simulateChatGroupViewTimes', viewTimes)
    }


    // 把聊天信息不断推入界面中
    animation(){
        let {renderList, info} = this.state
        if(renderList.length < info.msgList.length){
            renderList.push(info.msgList[renderList.length])
        }
        this.setState({renderList},()=>{
            this.container.querySelector('.component:last-child').scrollIntoView(true)
        })
    }

    // 图片预览
    imgView(e){
        let target = e.currentTarget
        let pageProportion = document.body.clientHeight / document.body.clientWidth
        let imgProportion = target.height / target.width
        let imageViewerWidth = 0, imageViewerHeight = 0
        if(imgProportion > pageProportion){
            imageViewerHeight = document.body.clientHeight * 0.8
            imageViewerWidth = imageViewerHeight / imgProportion
        }else {
            imageViewerWidth = document.body.clientWidth * 0.8
            imageViewerHeight = imageViewerWidth * imgProportion
        }
        this.setState({
            imageViewerHeight,
            imageViewerWidth,
            showImageViewer: target.src
        })
    }

    hideImageViewer(){
        this.setState({
            imageViewerHeight: 0,
            imageViewerWidth: 0,
            showImageViewer: ''
        })
    }

    // 初始化顶部时间
    initTime(){
        let currentDay = new Date(), week = ''
        switch(currentDay.getDay()){
            case 0: week = '星期天'; break;
            case 1: week = '星期一'; break;
            case 2: week = '星期二'; break;
            case 3: week = '星期三'; break;
            case 4: week = '星期四'; break;
            case 5: week = '星期五'; break;
            case 6: week = '星期六'; break;
        }
        this.setState({time: `${week} ${currentDay.getHours()}:${currentDay.getMinutes()}`})
    }

    render() {
        const {info, showImageViewer, imageViewerWidth, imageViewerHeight} = this.state
        return <Page title={info.groupName} className="simulation-group-container">
            {
                this.state.loading ? 
                <div className="loading-page">
                    <div className="loading-top">
                        <img src={require('./img/headImage.png')} alt=""/>
                        <div className="group-name">{info.groupName}</div>
                        { info.personCount ? <div className="person-count">(共{info.personCount}人)</div> : null }
                    </div>
                    <div className="loading-center">
                        <div className="loading">99%</div>
                        { info.msgList && info.msgList.length > 0 ? <div className="invite">{info.msgList[0].name} 邀请你加入群聊</div> : null }
                        <div className="entering">正在加入</div>
                    </div>
                </div> : 
                [
                    <div className="time-component">{this.state.time}</div>,
                    (
                        info && info.msgList && info.msgList.length > 0 ? 
                        <div className="group-members">“{info.msgList[0].name}”邀请你加入“{info.groupName}”，群聊参与人还有：{info.otherPersonList.join('、')}</div>
                        : null
                    ),
                    <div className="message-container" ref = {el => this.container = el}>
                        { this.state.renderList.length > 0 && this.state.renderList.map((i, t) => (<Item {...i} imgView = {this.imgView} key = {`i-${t}`}/>))}
                    </div>
                ]
            }
            {
                showImageViewer ? 
                createPortal(
                <div className="group-chat-imgae-viewer-container">
                    <div className="bg" onClick={this.hideImageViewer}></div>
                    <img src={showImageViewer} style={{width: imageViewerWidth, height: imageViewerHeight}} alt=""/>
                </div>, document.body) : null
            }
        </Page>

    }
}

function mstp(state) {
    return {
        
    }
}

const matp = {
    
}

export default connect(mstp, matp)(SimulationGroup)
