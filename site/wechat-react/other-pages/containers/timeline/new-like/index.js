import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { timeBefore, imgUrlFormat } from 'components/util'
import {
    getNewLikeList,
    setNewLikeToRead,
    setLiveId,
} from '../../../actions/timeline'

class NewLikeList extends Component {
    state = {
        noMore: false,
        page: 1,
        likeList : []
    }

    async componentDidMount() {
        if(this.props.location.query.liveId) {
            await this.props.setLiveId(this.props.location.query.liveId)
        }

        const likeListData = await this.props.getNewLikeList(this.props.liveId, {size: 20,page: this.state.page})
        let likeList = []
        if(likeListData && likeListData.length > 0) {
            likeListData.map((item) => {
                likeList.push({
                    headUrl: item.headImgUrl,
                    name: item.userName,
                    time: item.createTime,
                    courseImgUrl: item.relateLogo,
                })
            })
        }

        this.props.setNewLikeToRead(this.props.liveId)


        if(likeList && likeList.length < 20) {
            this.setState({
                likeList,
                noMore: true
            })
        } else {
            this.setState({
                likeList,
                page: this.state.page + 1,
            })
        }

    }
    
    loadMoreHandle = async (next) => {

        const likeListData = await this.props.getNewLikeList(this.props.liveId, {size: 20,page: this.state.page})
        let likeList = [...this.state.likeList]
        if(likeListData && likeListData.length > 0) {
            likeListData.map((item) => {
                likeList.push({
                    headUrl: item.headImgUrl,
                    name: item.userName,
                    time: item.createTime,
                    courseImgUrl: item.relateLogo,
                })
            })
        }


        if (likeList && likeList.length < this.state.page * 20) {
            this.setState({
                likeList,
                noMore: true
            })
        } else {
            this.setState({
                likeList,
                page: this.state.page + 1,
            })
        }

        if(typeof next === "function") {
            next()
        }
    }

    render() {
        return (
            <Page
                title={'点赞消息'}
                className='new-like-list'
            >
                <ScrollToLoad
                    ref="scrollBox"
                    className="scroll-box"
                    toBottomHeight={500}
                    noMore={this.state.noMore}
                    page={this.state.page}
                    loadNext={this.loadMoreHandle}
                >
                    {
                        this.state.likeList.map((item, idx) => {
                            return (
                                <div className="like-item" key={"like-item" + idx}>
                                    <div className="head-img">
                                        <img src={imgUrlFormat(item.headUrl, "@140h_140w_1e_1c_2o", "/140")} /> 
                                    </div>
                                    <div className="right-con">
                                        <div className="text-con">
                                            <div className="name">{item.name}</div>
                                            <div className="time">{timeBefore(item.time, this.props.sysTime)}</div>
                                        </div>
                                        <div className="course-img">
                                            <img src={imgUrlFormat(item.courseImgUrl, "@140h_140w_1e_1c_2o", "/140")} /> 
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </ScrollToLoad>
                
            </Page>
        );
    }
}

function mapStateToProps(state){
    return{
        liveId: state.timeline.myCurrentLiveId,
        sysTime: state.common.sysTime,
    }
}

const mapDispatchToProps ={
    getNewLikeList,
    setNewLikeToRead,
    setLiveId,
}
export default connect(mapStateToProps, mapDispatchToProps)(NewLikeList)