import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import CommonCheckInItem from '../../../../components/check-in-item/common-check-in-item';

@autobind
export class DetailCheckInList extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {

        }
    }

    render() {
        // console.log(this.props.campCheckInList)
        return (
            <div className="detail-check-in-list-container">
                <div className="title"><span className="block"></span>打卡动态</div>
                {
                    this.props.campCheckInList.map((item, index) => {
                        {/* 
                            affairId	     Long	       打卡动态id
                            createBy	     string	       创建人用户id
                            campId	         String	       训练营id
                            headImage	     String	       头像
                            nickName	     String	       昵称
                            isVip            String        是否vip用户
                            isThumbUp	     String	       当前登录的用户是否对此条动态点赞 Y /N
                            createTimeStamp	 Long	       打卡时间
                            content	         String	       打卡文本内容
                            photoUrls	     List<String>  图片url
                            audioUrl	     String	       音频url
                            audioSecond	     String	       音频时长
                            affairCount	     int	       打卡天数
                            thumbUpCount	 int	       点赞人数
                            thumbUpList      List<thumbUpDto>	所有点赞的人,最多返回500条,超过显示…
                            commentList	     List<commentDto>	回复列表,分页处理,第一次返回前3条
                            
                         */}
                        return <CommonCheckInItem key={item.affairId} {...item} index={index}/>
                    })
                }
                {
                    this.props.campCheckInList && this.props.campCheckInList.length == 0 ?
                    <div className="blank-intro">暂无动态~</div> :
                    null
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    campCheckInList: getVal(state, 'campCheckInList.data', []), 
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailCheckInList)
