import React from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat } from 'components/util';
import LazyImage from '../../lazy-image';

const dangerHtml = content => {
    if(content){
        content = content.replace(/\</g, (m) => "&lt;");
        content = content.replace(/\>/g, (m) => "&gt;");
    }

    return { __html: content }
};

/**
 *  编辑资料+修改头衔弹窗
 */
class EditMyTitleDialog extends React.PureComponent {

    render() {
        return (
            this.props.isShow &&
            <div
                className="set-title"
                onClick = {(e) => { if(e.target.className == "set-title") {this.props.onCloseSettings();} }}
                >
                {/*<LazyImage className="set-title-head" src={` ${imgUrlFormat(this.props.speakCreateByHeadImgUrl,'?x-oss-process=image/resize,h_60,w_60,m_fill')}`} alt=""/>
                <b dangerouslySetInnerHTML={dangerHtml(this.props.name||this.props.speakCreateByName)}>{}</b>*/}

                <div className="dialog">
                    <div className="container">
                        <div className="close" onClick = {(e) => { this.props.onCloseSettings();} }><i className="icon_cross"></i></div>

                            <img className="head-img" src={this.props.userInfo.user.headImgUrl+"?x-oss-process=image/resize,h_120,w_120,m_fill"} />

                        <span className="name"> {} <b dangerouslySetInnerHTML={dangerHtml(this.props.userInfo.user.name)}>{}</b></span>
                        <span className="title-tag"> {this.props.title} </span>
                    </div>

                    <div className="edit" onClick={()=>{location.href="/editUserInfo.htm?target=topic&topicId="+this.props.topicId}}><i className="icon_write"></i>编辑资料</div>
                    <div className="change-title" onClick={()=> {this.props.openTitleMenu()}}><i className="icon_user_star"></i>修改头衔</div>
                </div>

            </div> || null
        );
    }
}

EditMyTitleDialog.propTypes = {

};

export default EditMyTitleDialog;
