import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { timeBefore} from 'components/util';

class ReplyItem extends Component {
    deleteDiscuss(e,item){
        e.stopPropagation();
        window.confirmDialog(
            '确定删除吗？',
            () => {
                this.props.deleteDiscuss({discussId:item.id, businessId:this.props.topicId, parentId: item.parentId})
            }
        );
    }

    render() {
        return (
            this.props.replyList ?  <div className="reply-list">
                {
                    this.props.replyList.map((item, index) => {
                        return  <div className="reply-item" key={`reply-item-${item.id}`}>
                            <div className="top">
                                <span className="name">直播间回复</span>
                                {
                                    this.props.power.allowDelComment?
                                    <span className="btn-del-reply" onClick={(e)=>{this.deleteDiscuss(e,item)}}></span>
                                    :null
                                }
                            </div>
                            <div className="time">{timeBefore(item.createTime,this.props.currentTimeMillis)}</div>
                            <pre className="content"><b dangerouslySetInnerHTML={this.props.dangerHtml(item.content) }></b></pre>
                        </div>
                    })
                }
            </div>
            :null
        );
    }
}

ReplyItem.propTypes = {

};

export default ReplyItem;