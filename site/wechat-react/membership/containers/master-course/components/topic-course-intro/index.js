import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat, htmlTransferGlobal } from 'components/util';

import AudioIntro from './audio-intro';
import XiumiEditorH5 from "components/xiumi-editor-h5";

import Picture from 'ql-react-picture';

class CourseIntro extends Component {

    state = {
        //选中的音频介绍
        audioProfile: [],
        // 是否收起
        isFold: false,
        // 是否显示按钮
        showBtnFold:false,
        
        
    }

    // 介绍列表
    introList = null

    componentDidMount() {
        this.initAudioProfile();
        setTimeout(() => {
            this.fixImgSize();
            this.initShowFold();
        }, 2000);
    }


    fixImgSize() {
        let imgs = document.querySelectorAll('.intro-image');

        Array.prototype.map.call(imgs, (item) => {
            if (item.complete) {
                item.style.width = item.width >= 800 ? '100%' : (item.width*window.dpr + 'px');
            }
        });

    }

    initAudioProfile(){
        let audioProfile = this.props.profileList.length ? this.props.profileList.filter((item) => {
            return item.type == 'audio' && item.isCheck == 'Y'
        }) : [];

        this.setState({
            audioProfile
        })
    }

    initShowFold() {
        setTimeout(() => {
            let listH = this.introList && this.introList.offsetHeight || 0;
            if (listH > 300) {
                this.setState({
                    showBtnFold: true
                })
            }
        },1000)
    }

    // 切换收起
    toggleFold = () => {
        this.setState({
            isFold: !this.state.isFold
        })
    }


    render() {
        let itemIndex = 0;
        let isEmpty = !(this.state.audioProfile.length || this.props.topicInfo.speaker || this.props.topicInfo.guestIntr || this.props.topicInfo.remark || this.props.profileList.length);

        return (
            <div className='course-intro-container-v2'
                ref = {this.props.introRef}
            >
                { this.props.children }
                
                {/* <div className="title">课程介绍</div> */}

                {
                    this.state.audioProfile.length > 0 ?
                    <AudioIntro
                        topicInfo = {this.props.topicInfo}
                        audioProfile = {this.state.audioProfile}
                        data-log-pos={itemIndex++}
                    />
                    :null    
                }
                {
                    this.props.topicInfo.speaker?
                        <pre
                            className="speaker on-visible"
                            data-log-region="intro-item"
                            data-log-pos={itemIndex++}
                            data-log-type="text"
                        >主讲人：{this.props.topicInfo.speaker}</pre>
                    :null
                }
                {
                    this.props.topicInfo.guestIntr?
                        <pre
                            className="speaker-info on-visible"
                            data-log-region="intro-item"
                            data-log-pos={itemIndex++}
                            data-log-type="text"
                        >{this.props.topicInfo.guestIntr}</pre>
                    :null
                }
                {
                    this.props.topicSummary ? 
                    <div className={`intro-list ${this.state.isFold ? 'fold' : ''}`}>
                        <XiumiEditorH5 content={this.props.topicSummary} />
                    </div>
                    :
                    <div className={`intro-list ${this.state.isFold ? 'fold' : ''}`}
                    ref = {dom => this.introList = dom}
                >
                    {
                        ( this.props.topicInfo && this.props.topicInfo.remark )?<div>
                            <pre
                                className="on-visible"
                                data-log-region="intro-item"
                                data-log-pos={itemIndex++}
                                data-log-type="text"
                            ><code>{htmlTransferGlobal(this.props.topicInfo.remark)}</code></pre>
                        </div>
                        :null    
                    }    
                    {
                        this.props.profileList.length ? this.props.profileList.map((item, index) => {
                                return <div key={`profileList-item-${index}`}>
                                    {
                                        (item.type=='image' && item.url)?
                                            <Picture
                                                className='intro-image on-visible'
                                                data-log-region="intro-item"
                                                data-log-pos={itemIndex++}
                                                data-log-type="image"
                                                src={`${imgUrlFormat(item.url, '?x-oss-process=image/resize,w_800,limit_1')}`}
                                            />
                                            :null
                                    }
                                    {
                                        item.msg ?
                                            <pre
                                                className="on-visible"
                                                data-log-region="intro-item"
                                                data-log-pos={itemIndex++}
                                                data-log-type="text"
                                            ><code>{htmlTransferGlobal(item.msg)}</code></pre>
                                            : null
                                    }
                                </div>
                                
                            })
                            :null
                        }    
                    </div>
                }

                {
                    isEmpty && !this.props.topicSummary && <div className='none-intro'>该课程暂时还没有介绍哦</div> 
                }
                
                {
                    !!this.state.showBtnFold &&
                    <div className="btn-toggle-intro" onClick={this.toggleFold}>
                        {
                            this.state.isFold ?
                                '查看全部'    
                                :
                                '收起'    
                        }
                    </div>
                }

                {
                    !this.state.showBtnFold && !isEmpty && <div className="btn-toggle-intro-placeholder"></div>
                }
            </div>
        );
    }
}

CourseIntro.propTypes = {

};

export default CourseIntro;