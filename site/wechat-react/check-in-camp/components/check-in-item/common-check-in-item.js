import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import CommentList from './components/comment-list';
import PictureList from './components/picture-list';
import TextItem from './components/text-item';
import AudioItem from '../audio-item';
import AffairOperation from './components/affair-operation';
import dayjs from 'dayjs';
import CommentInput from './components/comment-input';

@autobind
export class CommonCheckInItem extends Component {
    static propTypes = {
        // Long    打卡动态id
        affairId: PropTypes.number,
        // string    创建人用户id
        createBy: PropTypes.string,
        // String    训练营id
        campId: PropTypes.string,
        // String    头像
        headImage: PropTypes.string,
        // String    昵称 
        nickName: PropTypes.string,
        // String  是否是vip用户 
        isVip: PropTypes.string,
        // String    当前登录的用户是否对此条动态点赞 Y /N
        isThumbUp: PropTypes.string,
        // Long    打卡时间
        createTimeStamp: PropTypes.number,
        // String    打卡文本内容
        content: PropTypes.string,
        // List<String>  图片url
        photoUrls: PropTypes.arrayOf(PropTypes.string),
        // String    音频url
        audioUrl: PropTypes.string,
        // String    音频时长
        audioSecond: PropTypes.number,
        // int    打卡天数
        affairCount: PropTypes.number,
        // int    点赞人数
        thumbUpCount: PropTypes.number,
        //List<thumbUpDto>	所有点赞的人,最多返回500条,超过显示…
        thumbUpList: PropTypes.arrayOf(PropTypes.shape({
            userName: PropTypes.string,
        })),
        commentList: PropTypes.arrayOf(PropTypes.shape({
            commentId: PropTypes.number,
            commentUserId: PropTypes.string,
            commentUserName: PropTypes.string,
            parentUserName: PropTypes.string,
            content: PropTypes.string,
        })),
        index: PropTypes.number,
    }

    render() {
    
        return (
            <div className="comment-check-in-item-container">
                <div className="left-content">
                    <div className="head-img" style={{backgroundImage: `url(${this.props.headImage})`}}></div>
                </div>
                <div className="right-content">
                    <div className="title">
                        <span className={classnames("name", {"vip-user": this.props.isVip == 'Y'})}>{this.props.nickName}</span>
                        <span className="date">{dayjs(this.props.createTimeStamp).format("YYYY-MM-DD HH:mm:ss")}</span>
                    </div>
                    <TextItem content={this.props.content} lineNum={4}/>
                    <PictureList photoUrls={this.props.photoUrls}/>
                    {
                        this.props.audioList && this.props.audioList.length>=0 &&
                        this.props.audioList.map((item,index)=>{
                            return <div className="audio-box" key = {`audio-${index}`}>
                                <AudioItem 
                                src={item.audioUrl}  
                                audioLength={item.duration}
                                /> 
                            </div>
                        })
                    }
                    
                    <AffairOperation 
                        isThumbUp={this.props.isThumbUp}
                        affairCount={this.props.affairCount}
                        createBy={this.props.createBy}
                        affairId={this.props.affairId}
                        index={this.props.index}
                    />
                    {
                        this.props.commentList.length > 0 || this.props.thumbUpList.length > 0 ?
                        <CommentList 
                            affairId={this.props.affairId}
                            thumbUpList={this.props.thumbUpList} 
                            commentList={this.props.commentList}
                        />
                        :null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

CommonCheckInItem.defaultProps = {
     // Long    打卡动态id
     affairId: '',
     // string    创建人用户id
     createBy: '',
     // String    训练营id
     campId: '',
     // String    头像
     headImage: '',
     // String    昵称
     nickName: '',
     // String    当前登录的用户是否对此条动态点赞 Y /N
     isThumbUp: '',
     // Long    打卡时间
     createTimeStamp: 0,
     // String    打卡文本内容
     content: '',
     // List<String>  图片url
     photoUrls: [],
     // String    音频url
     audioUrl: '',
     // String    音频时长
     audioSecond: 0,
     // int    打卡天数
     affairCount: 0,
     // int    点赞人数
     thumbUpCount: 0,
     //List<thumbUpDto>	所有点赞的人,最多返回500条,超过显示…
     thumbUpList: [],
     commentList: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(CommonCheckInItem)
