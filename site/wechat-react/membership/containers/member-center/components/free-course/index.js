/**
 *
 * @author Dylan
 * @date 2018/10/15
 */
import React, { PureComponent } from 'react';
import Picture from 'ql-react-picture';
import { autobind } from 'core-decorators';
import { get } from 'lodash';

import { request } from 'common_actions/common';

import {
	formatMoney,
	imgUrlFormat,
	locationTo,
} from 'components/util'

@autobind
class FreeCourse extends PureComponent {

	state = {
		itemRotateY: 0,
		isReplacing: false,
		frontFaceCourseList: [],
		backFaceCourseList: [],
	};

	data = {
		pageSize: 4
	};

	componentDidMount(){
		this.getData(1, true);
	}

	async getData(page, doubleSize){
		const res = await request({
			url: '/api/wechat/member/freeCourse4Center',
			method: 'POST',
			body: {
				pageIndex: page,
				pageSize: doubleSize ? this.data.pageSize * 2 : this.data.pageSize
			}
		});
		const courseList = get(res, 'data.freeCourseList', []);
		const nextPageIndex = get(res, 'data.nextPageIndex', 1);
		if(doubleSize){
			this.setState({
				frontFaceCourseList: courseList.slice(0, this.data.pageSize),
				backFaceCourseList: courseList.slice(this.data.pageSize),
				nextPageIndex
			})
		}else{
			if((this.state.itemRotateY / 180) % 2 === 1){
				this.setState({
					frontFaceCourseList: courseList,
					nextPageIndex
				})
			}else{
				this.setState({
					backFaceCourseList: courseList,
					nextPageIndex
				})
			}

		}
	}

	async replaceBtnClickHandle(e){
		e.stopPropagation();
		if(this.state.isReplacing){
			window.toast('您手速太快，受不了了啦')
			return false;
		}
		this.setState({
			itemRotateY: this.state.itemRotateY + 180,
			isReplacing: true,
		});
		await this.getData(this.state.nextPageIndex);
		this.setState({
			isReplacing: false
		})
	}

	enterCourse({ businessId, businessType }){
		if(businessType === 'channel'){
			locationTo(`/wechat/page/channel-intro?channelId=${businessId}`);
		}else if(businessType === 'topic'){
			locationTo(`/wechat/page/topic-intro?topicId=${businessId}`);
		}else{
			window.toast('unknown businessType');
		}
	}

	render(){
		return (
			<div className="member-center__free-course">
				<div className="title">{this.props.moduleData.title}</div>
				<div className="module-tip">{this.props.moduleData.intro}</div>
				<div className="course-list">
					{
						this.state.frontFaceCourseList.map((item, i) => {
							const backFaceCourseItem = this.state.backFaceCourseList[i] || {};
							return (
								<div className="course-item" key={i} onClick={e => this.enterCourse(item)}>

									<div className="item-container"
									     style={{
										     transform: `rotateY(${this.state.itemRotateY}deg)`
									     }}
									>
										<div className="poster">
											<Picture src={item.logo}/>
										</div>
										<div className="name">{item.businessName}</div>
										<div className="info">
											<span className="price">￥{formatMoney(item.amount)}</span>
											&nbsp;|&nbsp;
											<span className="tag">会员免费</span>
										</div>
									</div>

									<div className="item-container"
									     style={{
										     transform: `rotateY(${this.state.itemRotateY + 180}deg)`
									     }}
									>
										<div className="poster">
											<Picture src={backFaceCourseItem.logo}/>
										</div>
										<div className="name">{backFaceCourseItem.businessName}</div>
										<div className="info">
											<span className="price">￥{formatMoney(backFaceCourseItem.amount)}</span>
											&nbsp;|&nbsp;
											<span className="tag">会员免费</span>
										</div>
									</div>

								</div>
							)
						})
					}

					<div className="view-more-btn on-log"
					     onClick={e => locationTo('/wechat/page/membership-free-courses')}
					     data-log-region="free-course-view-more-btn"
					>
						查看全部
						<div className="icon_enter"></div>
					</div>
					<div className={`replace-btn replacing on-log${this.state.isReplacing ? '' : ' paused'}`}
					     onClick={this.replaceBtnClickHandle}
					     data-log-region="free-course-replace-btn"
					>换一批</div>
				</div>
			</div>
		)
	}
}

export default FreeCourse;