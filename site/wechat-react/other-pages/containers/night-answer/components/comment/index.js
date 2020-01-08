import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dayjs from 'dayjs';

class Comment extends Component {

    state = {
        agreeOperation: true
    }

    componentDidMount() {
    }
    //精选回答点赞与取消
    async agree(e){
        let tar = e.currentTarget;
        let type = tar.getAttribute("data-type");
        if(this.state.agreeOperation){
            tar.setAttribute("data-type","unactive");
            let businessId = tar.getAttribute('data-id'),
                businessType = 'discuss',
                numEle = tar.querySelector('.num'),
                num = parseInt(numEle.innerText,10),
                status;
            if (tar.classList.contains('like')){
                status = 'N'
                if(await this.props.like(businessId,businessType,status)){
                    tar.classList.remove('like')
                    numEle.innerText = --num
                    tar.setAttribute("data-type","active");
                }
            }else {
                status = 'Y'
                if(await this.props.like(businessId,businessType,status)){
                    tar.classList.add('like')
                    numEle.innerText = ++num
                    tar.setAttribute("data-type","active");
                }
            }
        }
        else{
            e.preventDefault()
        }
    }
    render() {
        let list = this.props.commentList.map((item,index) => {
            return (
                <div className="comment-list" key={`comment-list-${index}`}>
                    <img src={item.userHeadImgUrl} alt="头像"/>
                    <div className="comment-content">
                        <span className="name">{item.userName}</span>
                        <p className="content">{item.content}</p>
                        <div className="line">
                            <span>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm')}</span>
                            <div className={classnames('agree', {like: item.isLiked === 'Y'})} onClick={this.agree.bind(this)} data-id={item.id} data-type="active">
                                <span className="pic"></span>
                                <span className="num">{item.likeNum}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div className="night-answer-comment">
                <div className="title">
                    <span className="num">听众留言<span>{this.props.num}</span>
                    </span>
                </div>
                {list}
            </div>
        )
    }
}

export default Comment

