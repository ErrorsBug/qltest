import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { createPortal } from 'react-dom';
import { BottomDialog } from 'components/dialog';
import { autobind } from 'core-decorators';
import XiumiEditorH5 from 'components/xiumi-editor-h5';
import { limitScrollBoundary } from 'components/scroll-boundary-limit';
import { locationTo, dangerHtml, replaceWrapWord, imgUrlFormat, getVieoSrcFromIframe, formatCountdown, digitFormat } from 'components/util';
import Empty from "@ql-feat/empty";
import PlayingAnimate from "components/playing-animate";

@withStyles(styles)
@autobind
class DialogCourseIntro extends Component {

    state = {
        showList:false,
        content: ``,
        // 是否载入视频简介iframe
        showVideoIframe: false,
    }

    componentDidMount() {
        if(this.introScrollContainer){
	        limitScrollBoundary(this.introScrollContainer);
        }
        this.delayVideoIframe();
    }

    componentWillUpdate(nextProps){
        if(this.props.show !==nextProps.show){
            this.setState({
                showList: false,
            });
        }
        
    }

    toggleTeb(show) {
        this.setState({
            showList:show
        })
    }


    closeDialog(){
        this.props.close && this.props.close();
    }
    hadnleLink(item){
        locationTo(`/topic/details?topicId=${ item.id }&isUnHome=Y`)
    }

    delayVideoIframe() {
        setTimeout(() => {
            this.setState({
                showVideoIframe: true,
            })
        }, 3000);
    }

    // 按分类获取简介内容
    getDescByCategory(category) {
        let desc = this.props.channelProfile;

        return (desc[category] && desc[category].length>0) ? desc[category] : '';
    }


    
    
    render() {
        return (
            <BottomDialog
                show={this.props.show}
                theme='empty'
                bghide ={true}
                titleTheme={'white'}
                buttons={null}
                close={true}
                className={`${styles['courcse-list-page-intro-followDialog']} courcse-list-page-intro-followDialog`}
            >
                <div className={`${styles["tab"]}`}>
                    <span className={`${!this.state.showList?styles['on']:null}`} onClick={()=>{this.toggleTeb(false)}}>课程简介</span>
                    <span className={`${this.state.showList ? styles['on'] : null}`} onClick={() => { this.toggleTeb(true) }} >听课列表</span>
                    <b className={`${styles["btn-close"]} icon_cross`} onClick={this.closeDialog}></b>
                </div>
                <div className={`${styles['main']}`}>
                    <div className={`${styles["rich-text-box"]} ${this.state.showList? null:styles['on']}`} >
                    {
                        !this.state.showList&& <ChannelIntro father={this} {...this.props} showVideoIframe = {this.state.showVideoIframe} />
                    }
                    </div>
                    
                    <div className={`${styles["course-list"]}  ${this.state.showList?styles['on']:null}`} >
                        <ul>
                        {
                            this.props.topicList.map((element,index)=>{
                                return <li key={`topic-${index}`} className={`${this.props.currentTopicId == element.id ?styles["current"]:''}`} onClick={ () => this.hadnleLink(element) }>
                                <span className={`${styles["title"]}`}>{index+1}. {element.topic}</span>
                                <span className={`${styles["info"]}`}>{digitFormat(element.browseNum||0)}次学习 {element.duration ? `| ${formatCountdown(Math.floor(element.duration),'mm:ss')}`: ''}</span>
                                {this.props.currentTopicId == element.id ? <PlayingAnimate className={styles["current-learn"]} />:null}
                            </li>
                            })
                        }
                        </ul>
                        
                    </div>
                </div>
            </BottomDialog>
        );
    }
}



function onImageLoaded(e) {
    e = e || window.event;
    e.target.style.width = e.target.width >= 600 ? '100%' : (e.target.width*window.dpr + 'px');
}




/**
 * 系列课介绍
 * @param {*} props
 */
const ChannelIntro = props => {
    const { channelProfile, editorContent } = props;
    const {} = channelProfile;




    // 简介信息处理
    let descInfo = props.father.getDescByCategory('desc');
    let lectuerInfo = props.father.getDescByCategory('lectuerInfo');
    let fitPeopleInfo = props.father.getDescByCategory('suitable');
    let willGetInfo = props.father.getDescByCategory('gain');
    let videoInfo = props.father.getDescByCategory('videoDesc');
    if(editorContent || descInfo || lectuerInfo || fitPeopleInfo || willGetInfo || videoInfo ){
        return <section className="intro-section" ref={el => (props.father.introScrollContainer = el)}>
        {
            !editorContent && videoInfo.length ?
            <div className="video-info intro-block">
                <div className="head">
                    {/* <div className="icon video-icon" /> */}
                    <div>视频简介</div>
                </div>
                <div className="content video-wrap">
                    {videoInfo.map((item, index) => {
                        switch (item.type) {
                            case 'video':
                                return (
                                    props.showVideoIframe? (
                                        <div className="iframe-wrap" key={`iframe-wrap-${index}`}>
                                            <div className="bd-tp"></div>
                                            <div className="bd-rt"></div>
                                            <div className="bd-bt"></div>
                                            <div className="bd-lt"></div>
                                            <iframe is frameBorder="0" width="100%" height="100%" id="imIf" name="imIf" src={getVieoSrcFromIframe(item.content.replace(/(http:\/\/)/, '//'))} allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" />
                                        </div>
                                    ): (
                                        <div className="iframe-tip"></div>
                                    )
                                );
                        }
                    })}
                </div>
                <div className="video-tip">建议在wifi环境下播放</div>
            </div>
        : null
        }
        {
            editorContent ?
            <div className={`desc intro-block ${videoInfo.length > 0 ? '' : 'top-no-video'}`}>
                <div className="head">
                    <div>简介</div>
                </div>
                <XiumiEditorH5 content={editorContent} />
            </div>
            :
            descInfo.length ?
            <div className={`desc intro-block ${videoInfo.length > 0 ? '' : 'top-no-video'}`}>
                <div className="head">
                    <div>简介</div>
                </div>
                <div className="content">
                    {descInfo.map((item, index) => {
                        switch (item.type) {
                            case 'image':
                                return <img className='desc-image'
                                    onLoad={onImageLoaded}
                                    key={`desc-item-${index}`}
                                    src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                            case 'text':
                                return <p key={`desc-item-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                        }
                    })}
                </div>
            </div>: null
        }
        {!editorContent && lectuerInfo.length ?

            <div className="about-lectuer intro-block">
                <div className="head">
                    {/* <div className="icon lectuer-icon" /> */}
                    <div>关于讲师</div>
                </div>
                <div className="content">
                    {lectuerInfo.map((item, index) => {
                        switch (item.type) {
                            case 'image':
                                return <img className='desc-image'
                                    onLoad={onImageLoaded}
                                    key={`desc-item-t-${index}`}
                                    src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                            case 'text':
                                return <p key={`desc-item-t-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                        }
                    })}
                </div>
            </div>
        :  null
        }
        {!editorContent && fitPeopleInfo.length ?

            <div className="fit-people intro-block">
                <div className="head">
                    {/* <div className="icon fit-icon" /> */}
                    <div>适合人群</div>
                </div>
                <div className="content">
                    {fitPeopleInfo.map((item, index) => {
                        switch (item.type) {
                            case 'image':
                                return <img className='desc-image'
                                            onLoad={onImageLoaded}
                                            key={`desc-item-p-${index}`}
                                            src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                            case 'text':
                                return <p key={`desc-item-p-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                        }
                    })}
                </div>
            </div>
        : null
        }
        {!editorContent && willGetInfo.length ?

            <div className="will-get intro-block">
                <div className="head">
                    {/* <div className="icon will-get-icon" /> */}
                    <div>你将获得</div>
                </div>
                <div className="content">
                    {willGetInfo.map((item, index) => {
                        switch (item.type) {
                            case 'image':
                                return <img ref='descImage' className='desc-image'
                                            onLoad={onImageLoaded}
                                            key={`desc-item-g-${index}`}
                                            src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />;
                            case 'text':
                                return <p key={`desc-item-g-${index}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(item.content))} />
                        }
                    })}
                </div>
            </div>
        : null
        }
	    </section>
    // }else if(channelProfile && channelProfile.videoDesc && channelProfile.videoDesc.length){
    //     return <section className="intro-section" ref={el => (props.father.introScrollContainer = el)}>
    //         <div className="head">
    //             {/* <div className="icon video-icon" /> */}
    //             <div>视频简介</div>
    //         </div>
    //         <div className="content video-wrap">
    //             {videoInfo.map((item, index) => {
    //                 switch (item.type) {
    //                     case 'video':
    //                         return (
    //                             this.state.showVideoIframe? (
    //                                 <div className="iframe-wrap" key={`iframe-wrap-${index}`}>
    //                                     <div className="bd-tp"></div>
    //                                     <div className="bd-rt"></div>
    //                                     <div className="bd-bt"></div>
    //                                     <div className="bd-lt"></div>
    //                                     <iframe is frameBorder="0" width="100%" height="100%" id="imIf" name="imIf" src={getVieoSrcFromIframe(item.content.replace(/(http:\/\/)/, '//'))} allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" />
    //                                 </div>
    //                             ): (
    //                                 <div className="iframe-tip"></div>
    //                             )
    //                         );
    //                 }
    //             })}
    //         </div>
    //         <div className="video-tip">建议在wifi环境下播放</div>
	//     </section>
    }else{
		return <Empty className="editor-intro-empty"  show={true} emptyPic="//img.qlchat.com/qlLive/liveCommon/empty-page-empty.png"></Empty>;
    }

}

DialogCourseIntro.propTypes = {

};

export default DialogCourseIntro;

