import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {Link} from 'react-router';
import TopicItem from '../../../../../female-university/components/community-topic-item/hot';    

import {
	digitFormat,
	getAudioTimeShow,
	locationTo,
	formatMoney
} from 'components/util';
import Picture from 'ql-react-picture'
import {authFreeCourse, getFirstTopicInChannel} from "common_actions/common";

@autobind
export default class extends Component {

	state = { 
	};
 
	 

	render() {
		const {listTopic=[], name = '', secondName=''} = this.props
		return (
			<div className="home-community-box">
				<div className="hc-topic-head">
					<div className="hc-topic-title">
						<div>
							<h3>{name}</h3> 
						</div>
						<p>{secondName}</p>
					</div>
				</div>
				<div className="hc-topic-list-wrap">
					{
						listTopic.map((item, index) => {
							return (
								<TopicItem  
								region="main-home-topic-item"
								handleSelectTopic={()=>{ locationTo(`/wechat/page/university/community-topic?topicId=${item.id}&wcl=zzsy${index+1}`)}}
								idx={index} key={ index }
								{...item}/>
							)
						})
					}
				</div>
                <div className="check-more-btn on-log"
                    data-log-region="main-home-topic-more"
					data-log-pos="0"
					data-log-name="进入社区"
					onClick={() => {
						locationTo('/wechat/page/university/community-center?wcl=zzsygd');
					}}>
                    <span>进入社区<i className="icon_enter"></i></span>
                </div>
			</div>
		);
	}
}