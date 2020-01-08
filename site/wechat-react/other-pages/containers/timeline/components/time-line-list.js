import React, { Component } from 'react';
import ScrollToLoad from 'components/scrollToLoad';
import { timeBefore, locationTo, dangerHtml, parseDangerHtml, imgUrlFormat, digitFormat } from 'components/util';
import { fillParams } from 'components/url-utils';
import { Link } from 'react-router'
import homeworkLayer from '../img/homework-layer.png'
import MyFocusBar from './my-focus-bar'
// UI觉得图标库中的三个点太密了，切个图来做
import admin from '../img/admin.png'
import EmptyPage from 'components/empty-page';
import Picture from 'ql-react-picture';

class TimeLineItem extends Component {
    state = {
        tooLong: false,
        fold : false,
        alreadyLike: false,
        content: "",
        likeCount: 0,
    }
    componentDidMount() {

        this.setState({
            likeCount: this.props.likeCount,
            content: this.props.content,
        })

        if(this.props.content.length > 80) {
            this.setState({
                tooLong: true,
                fold: true,
            })
        }
    }
    
    unfoldHandle = () => {
        this.setState({
            fold: false,
        })
    }
    foldHandle = () => {
        this.setState({
            fold: true,
        })
    }
    likeHandle = async () => {
        const result = await this.props.likeHandle(this.props.id, this.props.alreadyLike ? "N" : "Y", this.props.idx)
    }

    gotoHandle = (url) => {
        locationTo(url)
    }

    render() {
        return (
            <div className="time-line-item">

                <div className="avatar on-log"
                     onClick={this.gotoHandle.bind(this, "/live/" + this.props.liveId + ".htm")}
                     data-log-name="点头像进入直播间"
                     data-log-region="avatar"
                     data-log-pos={this.props.index}
                >
                    <div className="c-abs-pic-wrap"><Picture src={this.props.headImg} placeholder={true} resize={{w:"120", h:"120"}}/></div>
                </div>


                <div className="time-line-con">
                    <div className="name-con">
                        <div className="name" onClick={this.gotoHandle.bind(this, "/live/" + this.props.liveId + ".htm")}>{this.props.name}</div>
                        {
                            this.props.canAdmin ? 
                                <div className="admin" onClick={this.props.admin}><img src={admin}/></div> 
                            : ""
                        }
                    </div>
                    {
                        this.state.fold ? 
                            <div className="content" ref="content">
                                <div dangerouslySetInnerHTML={parseDangerHtml(this.state.content && (this.state.content.substr(0,80)+ "..."))}></div>
                                {
                                    this.state.tooLong ?
                                        <div className="unfold" onClick={this.unfoldHandle}>展开</div> : ""
                                }
                            </div>
                        :
                            <div className="content" ref="content" >
                                <div dangerouslySetInnerHTML={parseDangerHtml(this.state.content)}></div>
                                {
                                    this.state.tooLong ?                                 
                                        <div className="unfold" onClick={this.foldHandle}>收起</div> : ""
                                }
                            </div>
                    }

                    <div className="item-block on-log"
                         onClick={this.gotoHandle.bind(this, this.props.relateUrl)}
                         data-log-name="进入课程详情页"
                         data-log-region="item-block"
                         data-log-pos={this.props.index}
                    >
                        <div className="block-img">
                            {
                                this.props.blockImg?
                                    <div className="c-abs-pic-wrap"><Picture src={this.props.blockImg} placeholder={true} resize={{w:"160", h:"100"}}/></div>
                                :null    
                            }
                            {
                                this.props.relateType == "homework" ?
                                    <img className="homework-layer" src={homeworkLayer} /> : ""
                            }
                        </div>
                        <div className="block-text">{this.props.blockContent}</div>
                    </div>

                    <div className="bottom-con">
                        <div className="timer">{timeBefore(this.props.time, this.props.sysTime)}</div>
                        <div className={`num${this.props.alreadyLike?" active":""}`}>{digitFormat(this.props.likeCount)}</div>
                        <div className="like">
                            <span className={`zan on-log ${this.props.alreadyLike?"active":""}`}
                                  onClick={this.likeHandle}
                                  data-log-name="点赞"
                                  data-log-region="zan"
                                  data-log-pos={this.props.index}
                            ></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


class TimeLineList extends Component {
    state = {
        page: 1,
        noMore: false,
    }

    async componentDidMount() {
        if(this.props.timelineList && this.props.timelineList.length == 0) {
            const result = await this.props.loadMoreTimeline(
                this.state.page,
                0
            )
            if (result && result.length < 20) {
                this.setState({
                    noMore: true,
                })
            } else {
                this.setState({
                    page: this.state.page + 1,
                })
            }
        }

        if(this.props.timelineList && this.props.timelineList.length < 20 && this.props.timelineList.length > 0) {
            this.setState({
                noMore: true
            })
        } else if (this.props.timelineList) {
            this.setState({
                page: this.state.page + 1,
            })
        }
    }
    
    loadMoreHandle = async (next) => {
        
        const lastTime = (this.props.timelineList && this.props.timelineList.length > 0) ? this.props.timelineList[this.props.timelineList.length - 1].createTime : 0

        const result = await this.props.loadMoreTimeline(
            this.state.page,
            lastTime
        )
        
        if(result && result.length < 20) {
            this.setState({
                noMore: true,
            })
        } else {
            this.setState({
                page: this.state.page + 1,
            })
        }

        // if(this.props.timelineList && this.props.timelineList.length < this.state.page * 20)  {

        // } else {
        //     this.setState({
        //         page: this.state.page + 1,
        //     })
        // }

        if(typeof next === "function") {
            next()
        }
    }
    
    adminHandle = (idx, id) => {
        this.props.admin(idx, id)
    }
    
    likeHandle = async (idx, id, cancelFlag) => {
        return await this.props.likeHandle(idx, id, cancelFlag)
    }


    render() {
        return (
            <div className={"time-line-list " + this.props.className}>
                <ScrollToLoad
                    ref="scrollBox"
                    className="scroll-box"
                    toBottomHeight={500}
                    noMore={this.state.noMore}
                    page={this.state.page}
                    loadNext={this.loadMoreHandle}
                    children={
                        <div>
                            { this.props.children }
                            <MyFocusBar
                                myLives={this.props.myLives}
                                myAdminLives={this.props.myAdminLives}
                                myFocusLives={this.props.myFocusLives}
                                mineFocusList={this.props.mineFocusList}
                                userType={this.props.userType}
                                routerGotoHandle={this.props.routerGotoHandle}
                            />
                            {
                                this.props.newLikeNum > 0 ?
                                    <div className="new-like-con">
                                        <Link to='/wechat/page/timeline/new-like'>
                                            <span className="new-like">
                                                <span className="new-like-text" >您获得了{this.props.newLikeNum}个新点赞</span>
                                            </span>
                                        </Link>
                                    </div>
                                    :
                                    ""
                            }
                            {
                                (!this.props.timelineList || (this.props.timelineList && this.props.timelineList.length < 1) ) ?  
                                    <EmptyPage imgKey="noContent" emptyMessage="您还没有任何动态消息~" />
                                :
                                    this.props.timelineList.map((item, index) => {
                                        return (
                                            <TimeLineItem
                                                key={"TimeLineItem-" + item.id}
                                                index = {index}
                                                id = {item.id}
                                                idx = {index}
                                                headImg={item.liveLogo}
                                                liveId={item.liveId}
                                                name={item.liveName}
                                                content={item.content}
                                                blockImg={item.relateLogo}
                                                blockContent={item.relateTitle}
                                                relateType={item.relateType}
                                                relateUrl={item.relateUrl}
                                                time={item.createTime}
                                                likeCount={item.likeNum}
                                                alreadyLike={item.liked ? true : false}
                                                canAdmin={(item.liveId == this.props.liveId) ? true : false}
                                                admin={this.adminHandle.bind(this, index, item.id)}
                                                likeHandle={this.likeHandle}
                                            />
                                        )
                                    })
                            }
                        </div>
                    }
                />
            </div>
        );
    }
}

export default TimeLineList;