import React, { Component } from 'react';
import Picture from 'ql-react-picture';
import classnames from "classnames";


export default class TopicAssembleContent extends Component {
    
	showOriginImg(url){
		window.showImageViewer(url, [url]);
    }

	render () {
		const {data, className} = this.props
		return  (
			<div className={classnames('topic-assemble-content', className)}>
				{
					data ? data.map(({type, content}, index) => {
						switch(type) {
							case 'title':
								return <div key={`content-${index}`} className="content-title">{content}</div>
							case 'image':
								return <div key={`content-${index}`} className="content-img" onClick={this.showOriginImg.bind(this, content)}><Picture src={`${content}?x-oss-process=image/resize,m_lfit,w_600,limit_1`} /></div>
							case 'text':
								return <div key={`content-${index}`} className="content-txet">{content}</div>
						}
					}) : (
						<div className="empty">
							<div className="empty-poster"></div>
							<p className="empty-text">没有任何内容哦</p>
						</div>
					)
				}
			</div>
		)
	}
}