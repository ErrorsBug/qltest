import React, { Component } from 'react';
import Picture from 'ql-react-picture';
import XiumiEditorH5 from "components/xiumi-editor-h5";

import {
	getVieoSrcFromIframe,
	replaceWrapWord,
	dangerHtml,
	imgUrlFormat,
} from 'components/util';

class CourseIntro extends Component {

    state = {
	    descInfo: null,
    }

    componentDidMount(){
        this.initDescInfo();
    }

	initDescInfo(){
    	if(!this.props.channelDesc){
    		this.setState({
			    descInfo: []
		    });
    		return false;
	    }
		let pos = 0;
		let descInfo = [
			{
				title: '视频简介',
				list: this.props.channelDesc.videoDesc
			},
			{
				title: '简介',
				list: this.props.channelDesc.desc
			},
			{
				title: '关于讲师',
				list: this.props.channelDesc.lectuerInfo
			},
			{
				title: '适合人群',
				list: this.props.channelDesc.suitable
			},
			{
				title: '你将获得',
				list: this.props.channelDesc.gain
			},
		].filter(item => {
			if(item.list && item.list.length){
				item.list.forEach(l => {
					l.pos = ++pos;
				});
				return true;
			}else{
				return false;
			}
		})

		this.setState({
			descInfo
		})
	}

	render(){
	    return (
		    <div className="channel-intro-container">
			    {
				    this.props.channelSummary &&
					    <div className="p-intro-section">
						    <div className="p-intro-section-title">
							    <span></span>
							    {
								    this.props.children
							    }
						    </div>

						    <div className="desc-content">
							    <XiumiEditorH5 content={this.props.channelSummary} />
						    </div>
					    </div>
			    }
			    {
				    !this.props.channelSummary && this.state.descInfo && !!this.state.descInfo.length &&
				    this.state.descInfo.map((item, i) => {
					    // 用于AutoFixedNav组件
					    let _props = i === 0 ? {ref: r => this.descContentEl = r} : null;
					    return (
						    <div key={i}
						         className="p-intro-section"
						         {..._props}
						    >
							    <div className="p-intro-section-title">
								    {/* <p>{item.title}</p> */}
								    {
									    i === 0 && this.props.children
								    }
							    </div>

							    <div className="desc-content">
								    {
									    item.list.map((l, descIndex) => (
										    l.type === 'image' ?
											    <Picture className={`desc-image on-visible${(!item.list[descIndex - 1] || item.list[descIndex - 1].type !== 'image') ? ' with-margin' : ''}`}
											         data-log-region="desc-info"
											         data-log-pos={l.pos}
											         data-log-type={l.type}
											         key={`desc-item-${descIndex}`}
											         src={`${imgUrlFormat(l.content, '?x-oss-process=image/resize,w_600,limit_1')}`} />
											    :
											    (
												    l.type === 'video' ?
													    <div className="video-wrap on-visible"
													         key={`iframe-wrap-${descIndex}`}
													         data-log-region="desc-info"
													         data-log-pos={l.pos}
													         data-log-type={l.type}
													    >
														    <div className="iframe-wrap">
															    <div className="bd-tp"></div>
															    <div className="bd-rt"></div>
															    <div className="bd-bt"></div>
															    <div className="bd-lt"></div>
															    <iframe frameBorder="0" width="100%" height="100%" id="imIf" name="imIf" src={getVieoSrcFromIframe(l.content.replace(/(http:\/\/)/, '//'))} allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" />
														    </div>
													    </div>
													    :
													    <p className="desc-text on-visible"
													       key={`desc-item-${descIndex}`} dangerouslySetInnerHTML={dangerHtml(replaceWrapWord(l.content))}
													       data-log-region="desc-info"
													       data-log-pos={l.pos}
													       data-log-type={l.type}
													    />
											    )
									    ))
								    }
							    </div>
						    </div>
					    )
				    })
			    }
			    {
				    !this.props.channelSummary && (this.state.descInfo && !this.state.descInfo.length) &&
				    <div className="p-intro-section" ref={r => this.descContentEl = r}>
					    <div className="p-intro-section-title">
						    {/* <p>课程简介</p> */}
						    {
							    this.props.children
						    }
					    </div>
					    <div className="topic-list-no-course">该课程暂时还没有介绍哦</div>
				    </div>
			    }
		    </div>
        )
    }
}

export default CourseIntro;