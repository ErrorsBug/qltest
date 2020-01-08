import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { imgUrlFormat } from 'components/util';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class BarrageList extends PureComponent {

    dangerHtml(content){
        if (content) {
            content = content.replace(/\</g, (m) => "&lt;");
            content = content.replace(/\>/g, (m) => "&gt;");
            content = content.replace(/&lt;br\/&gt;/g, (m) => "<br/>");
        }

        return { __html: content }
    };

    render() {
        const barrageListClass = classNames('on-log', {
            'barrage-list': true,
        });
        return (
            <ul className={barrageListClass}
                data-log-name="评论区域"
                data-log-region="chat-room"
                data-log-pos="barrage-list"
            >
                <ReactCSSTransitionGroup
                    transitionName="thousand-live-animation-barrageListItem"
                    transitionEnterTimeout={350}
                    transitionLeaveTimeout={350}>
                    {
                        this.props.barrageList.map((comment) => {
                            const createByHeadImgUrl = comment.createByHeadImgUrl;
                            return (
                                <li className="barrage-item" key={comment.id} onClick={this.props.showCommentList}>
                                    <div className="content">
                                    {
                                        comment.isQuestion === 'Y' &&
                                        <span className="question">问</span>
                                    }
                                    <span dangerouslySetInnerHTML={this.dangerHtml(comment.content)}></span>
                                    </div>
                                    <div className={`avatar${comment.isVip ? ' vip' : ''}`}>
                                        <img className = "head-img" src={` ${imgUrlFormat(createByHeadImgUrl||"http://img.qlchat.com/qlLive/liveCommon/normalLogo.png",'?x-oss-process=image/resize,h_60,w_60,m_fill')}`} alt=""/>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ReactCSSTransitionGroup>
            </ul>
        );
    }
}

BarrageList.propTypes = {

};

export default BarrageList;
