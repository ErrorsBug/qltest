/**
 *
 * @author Dylan
 * @date 2018/5/14
 */
import React, { Component } from 'react';
import { autobind, throttle } from 'core-decorators';


@autobind
class CourseList extends Component {

	state = {
	};

	data = {

	};

	shouldComponentUpdate(nextProps,nextState){
		return nextProps.canListenByShare !== this.props.canListenByShare || nextProps.courseList !== this.props.courseList
	}

	componentDidUpdate(prevProps){
		this.scrollCurrentCourseToTheLeft();
	}

	componentDidMount() {
		setTimeout(()=>{
			this.scrollCurrentCourseToTheLeft();
		},1000)
	}

	@throttle(1000)
	scrollCurrentCourseToTheLeft(){
		if(this.currentCourseItemRef){
			this.courseItemWrapRef.scrollLeft = this.courseItemWrapRef.scrollLeft + this.currentCourseItemRef.getBoundingClientRect().left - this.courseListTitleRef.getBoundingClientRect().left ;
		}
	}


	render() {
		return (
			<div className="course-list-wrap" ref={el => (this.courseListWrapRef = el)}>
				<div className="title-wrap">
					<div className="title" ref={el => (this.courseListTitleRef = el)}>课程列表</div>
					{
						this.props.topicInfo.channelId && !!this.props.courseList.length &&
						<div className="desc on-log"
							onClick={this.props.showCourseListDialog}
							data-log-name="数字列表按钮"
							data-log-region="course-list-num-btn"
						>更新至第{this.props.courseList.length}课 <div className="icon_enter"></div></div>
					}
				</div>
				<div className="course-list-container">
					<div className="course-item-wrap" ref={el => (this.courseItemWrapRef = el)}>
						{
							this.props.courseList.length ?
							this.props.courseList.map((item, i) => (
								<div className={`course-item on-log${item.id === this.props.topicInfo.id ? ' current' : ''} ${(!this.props.canListenByShare && item.status == 'beginning' && item.startTime > this.props.sysTime) || (this.props.canListenByShare && item.isAuditionOpen !== 'Y' && !item.share) ? 'disable' : ''}`}
								     key={i}
								     onClick={_=> this.props.jumpToCourse(item)}
								     ref={el => (item.id === this.props.topicInfo.id ? (this.currentCourseItemRef = el) : '')}
								     data-log-region="course-list"
								     data-log-pos="course-item"
								     data-log-index={i}
								>
									<div className="name">{item.topic}</div>
								</div>
							))
							:
							<div className={`course-item current`}>
								<div className="name">{this.props.topicInfo.topic}</div>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

export default CourseList;
