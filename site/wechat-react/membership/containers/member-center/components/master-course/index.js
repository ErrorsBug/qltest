/**
 *
 * @author Dylan
 * @date 2018/10/15
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';

import {
	locationTo,
	digitFormat,
	imgUrlFormat,
} from 'components/util';
import animation from 'components/animation';

import errorCatch from 'components/error-boundary';

@errorCatch
@autobind
class MasterCourse extends PureComponent {
	state = {
		itemWidth: '20%',
		itemHeight: 0,
		itemMargin: 0,
		// 列表滑动需要不断循环，所以复制5份
		courseList: [...this.props.courseList, ...this.props.courseList, ...this.props.courseList, ...this.props.courseList, ...this.props.courseList],
		courseIntroList: [...this.props.courseList]
	};

	data = {
		scrollContainerOperating: false
	};

	componentDidMount(){
		if(this.props.isSelected !== 'Y'){
			setTimeout(() => {
				this.courseItemSizeCalculate();
			}, 1000);
			document.addEventListener('mouseup', e => {
				if(this.data.scrollContainerOperating){
					this.data.scrollContainerOperating = false;
					this.courseListScrollEndHandle();
				}
			});
			document.addEventListener('touchend', e => {
				if(this.data.scrollContainerOperating){
					this.data.scrollContainerOperating = false;
					this.courseListScrollEndHandle();
				}
			})
		}
	}

	courseItemSizeCalculate(){
		const courseListWrapWidth = this.courseListRef.offsetWidth;
		const itemWidth = courseListWrapWidth * 0.16;
		const itemAlignMargin = courseListWrapWidth * 0.02;
		this.setState({
			itemWidth: `${itemWidth}px`,
			itemHeight: `${itemWidth * 1.3}px`,
			itemMargin: `0 ${itemAlignMargin}px`,
			showSwiper: true,
		}, () => {
			this.scrollContainer.scrollLeft = (itemWidth + itemAlignMargin * 2) * this.props.courseList.length * 2;

			// this.magnifyItemAppeared((listInScreen) => {
			// 	this.courseListScrollEndHandle(listInScreen)
			// });
		});
	}

	courseListScrollHandle(e){
		if(this.data.noScrollEvent){return false}
		this.magnifyItemAppeared();
	}

	magnifyItemAppeared(scrollLeft, currentItemRectLeftList = []){
		this.data.scrolling = true;
		const courseListWrapWidth = this.data.courseListWrapWidth || (this.data.courseListWrapWidth = this.courseListRef.offsetWidth);
		const eachSpace = this.data.eachSpace || (this.data.eachSpace = courseListWrapWidth / 5);
		const courseListWrapRectX = this.data.courseListWrapRectX || (this.data.courseListWrapRectX = this.courseListRef.getBoundingClientRect().left);
		let specifiedScroll = false;
		if(scrollLeft){
			specifiedScroll = true;
		}else{
			scrollLeft = this.scrollContainer.scrollLeft;
		}
		// 抛物线与x轴的交点
		const maxX = this.data.maxX || (this.data.maxX = (courseListWrapWidth - eachSpace) / 2);
		const minX = - maxX;

		if(!this.data.formula){
			this.data.formula = {};
			const a = 0.00000000005;
			// y轴左右两边分别使用两条抛物线公式 y = a*x*x + b*x + c ，x为0时，y值最大为0.7，y为0时，x分别是minX和maxX
			const c = 1;
			const b1 = (-a * minX * minX - c) / minX;
			const b2 = (-a * maxX * maxX - c) / maxX;
			this.data.formula.left = (x) => a * x * x + b1 * x + c;
			this.data.formula.right = (x) => a * x * x + b2 * x + c;
		}
		// if(!this.data.formula){
		// 	// x为0时，y值最大为0.6，使用交点式算出a；
		// 	const a = 0.6 / ((0 - minX) * (0 - maxX));
		// 	// 得出抛物线公式
		// 	this.data.formula = (x) => (a * (x - minX) * (x - maxX) + 1);
		// }
		if(!this.data.formulaForOrigin){
			this.data.formulaForOrigin = {};
			// 当动画在y轴右边时
			// 设顶点(h, k)为(maxX / 2, 0), 代入抛物线顶点公式y=a(x-h)2+k
			const h1 = maxX / 2;
			const k1 = 0;
			// 设其中一个交点(0, 50)
			const a1 = (50 - k1) / ((0 - h1) * (0 - h1));
			this.data.formulaForOrigin.right = (x) => a1 * (x - h1) * (x - h1) + k1;

			// 当动画在y轴左边时
			// 设顶点(h, k)为(maxX / 2, 0), 代入抛物线顶点公式y=a(x-h)2+k
			const h2 = minX / 2;
			const k2 = 100;
			// 设其中一个交点(0, 50)
			const a2 = (50 - k2) / ((0 - h2) * (0 - h2));
			this.data.formulaForOrigin.left = (x) => a2 * (x - h2) * (x - h2) + k2;
		}
		const formula = this.data.formula;
		const formulaForOrigin = this.data.formulaForOrigin;

		const minIndexInScreen = Math.floor(scrollLeft / eachSpace);
		const listInScreen = [
			this[`courseItemRef-${minIndexInScreen}`],
			this[`courseItemRef-${minIndexInScreen + 1}`],
			this[`courseItemRef-${minIndexInScreen + 2}`],
			this[`courseItemRef-${minIndexInScreen + 3}`],
			this[`courseItemRef-${minIndexInScreen + 4}`]
		];
		// console.log(this[`courseItemRef-${4}`].offsetLeft);
		// console.log(this[`courseItemRef-${4}`].getBoundingClientRect());

		listInScreen.forEach((item, i) => {
			if(!item){
				return false;
			}
			const itemLeft = currentItemRectLeftList[i] || item.getBoundingClientRect().left;
			const x = (itemLeft - courseListWrapRectX + item.clientWidth / 2) - courseListWrapWidth / 2;
			let y = 1;
			let originX = 50;
			if(x <= maxX && x >= 0){
				y = formula.right(x) + 1;
				originX = formulaForOrigin.right(x);
			}else if(x >= minX && x < 0){
				y = formula.left(x) + 1;
				originX = formulaForOrigin.left(x);
			}
			// console.log(`x::${x}`);
			// console.log(`y::${y}`);
			const img = item.querySelector('.pic');
			if(img) {
				img.style.msTransform = `scale(${y})`;
				img.style.MozTransform = `scale(${y})`;
				img.style.OTransform = `scale(${y})`;
				img.style.webkitTransform = `scale(${y})`;
				img.style.WebkitTransform = `scale(${y})`;
				img.style.transform = `scale(${y})`;

				img.style.msTransformOriginX = `${originX}%`;
				img.style.MozTransformOriginX = `${originX}%`;
				img.style.OTransformOriginX = `${originX}%`;
				img.style.webkitTransformOriginX = `${originX}%`;
				img.style.WebkitTransformOriginX = `${originX}%`;
				img.style.transformOriginX = `${originX}%`;

				item.style['z-index'] = Math.ceil(y * 20);
			}
		});

		this.data.listInScreen = listInScreen;

		const listBesideScreen = [
			this[`courseItemRef-${minIndexInScreen - 2}`],
			this[`courseItemRef-${minIndexInScreen - 1}`],
			this[`courseItemRef-${minIndexInScreen + 5}`],
			this[`courseItemRef-${minIndexInScreen + 6}`],
		];

		listBesideScreen.forEach(item => {
			if(!item){
				return false;
			}
			const img = item.querySelector('.pic');
			if(img) {
				img.style.msTransform = 'scale(1)';
				img.style.MozTransform = 'scale(1)';
				img.style.OTransform = 'scale(1)';
				img.style.webkitTransform = 'scale(1)';
				img.style.WebkitTransform = 'scale(1)';
				img.style.transform = 'scale(1)';

				img.style.msTransformOriginX = '50%';
				img.style.MozTransformOriginX = '50%';
				img.style.OTransformOriginX = '50%'
				img.style.webkitTransformOriginX = '50%';
				img.style.WebkitTransformOriginX = '50%';
				img.style.transformOriginX = '50%';

				item.style['z-index'] = 1;
			}
		});

		// if(scrollLeft > this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth * 2){
		// 	const courseList = [...this.state.courseList, ...this.props.courseList];
		// 	this.setState({ courseList })
		// }else if(scrollLeft < this.scrollContainer.clientWidth){
		// 	const courseList = [...this.props.courseList, ...this.state.courseList];
		// 	this.setState({ courseList }, () => {
		// 		this.scrollContainer.scrollLeft += eachSpace * this.props.courseList.length
		// 	});
		// }

		if(specifiedScroll){
			this.data.scrolling = false;
			return false;
		}
		if(this.data.scrollEndTimer){
			clearTimeout(this.data.scrollEndTimer);
		}
		this.data.scrollEndTimer = setTimeout(() => {
			this.data.scrolling = false;
			this.courseListScrollEndHandle();
		}, 200);

	}

	courseListScrollEndHandle(){
		if(this.data.scrollContainerOperating || this.data.scrolling || this.data.scrollEndAnimationComplete){
			return false;
		}

		const listInScreen = this.data.listInScreen;
		listInScreen.sort((a, b) => {
			return b.style['z-index'] - a.style['z-index'];
		});
		const C_PosItem = listInScreen[0];
		const distanceToCenter = this.data.courseListWrapWidth / 2 - (C_PosItem.getBoundingClientRect().left - this.data.courseListWrapRectX + C_PosItem.clientWidth / 2);
		if(distanceToCenter > 1 || distanceToCenter < -1){
			// C位不在正确位置，让它归位(允许误差)
			animation.add({
				startValue: this.scrollContainer.scrollLeft,
				endValue: this.scrollContainer.scrollLeft - distanceToCenter,
				duration: 200,
				easing: "easeOutQuad",
				step: (value, key) => {
					this.scrollContainer.scrollLeft = value;
				},
				oncomplete: () => {
					this.data.scrollEndAnimationComplete = true;
					this.resetCourseListPosition();
				}
			})
		}else{
			this.resetCourseListPosition();
		}

		// 显示对应的大师课介绍
		const courseIntroList = [...this.state.courseIntroList];
		courseIntroList.forEach(c => {
			if(c.businessId === C_PosItem.dataset.businessId){
				c.showIntro = true;
			}else{
				c.showIntro = false;
			}
		});
		this.setState({ courseIntroList })
		// const currentItemIndex = Array.prototype.indexOf.apply(this.scrollContainer.querySelectorAll('.course-item'), [C_PosItem]);
		// this.courseIntroListWrapRef.scrollLeft = this.courseIntroListWrapRef.clientWidth * currentItemIndex;
	}

	resetCourseListPosition(){
		const currentIndex = Math.ceil(this.scrollContainer.scrollLeft / this.data.eachSpace);
		if(currentIndex < 20 || currentIndex >= 30){
			const scrollLeft = (currentIndex % 10 + 20) * this.data.eachSpace;
			const currentListInScreen = [
				this[`courseItemRef-${currentIndex}`],
				this[`courseItemRef-${currentIndex + 1}`],
				this[`courseItemRef-${currentIndex + 2}`],
				this[`courseItemRef-${currentIndex + 3}`],
				this[`courseItemRef-${currentIndex + 4}`]
			];
			this.data.noScrollEvent = true;
			this.magnifyItemAppeared(scrollLeft, currentListInScreen.map(l => l.getBoundingClientRect().left));
			setTimeout(() => {
				this.scrollContainer.scrollLeft = scrollLeft;
				this.data.noScrollEvent = false;
			},100)

		}
	}

	scrollContainerOperatingHandle(e){
		if(e.type === 'mousedown' || e.type === 'touchstart'){
			this.data.scrollEndAnimationComplete = false;
			this.data.scrollContainerOperating = true;
		}else if(e.type === 'mouseup' || e.type === 'touchend'){
			if(this.data.scrollContainerOperating){
				this.data.scrollContainerOperating = false;
				this.courseListScrollEndHandle();
			}
		}
	}

	enterMaster({ businessId, businessType }){
		if(!businessId){
			return false;
		}
		locationTo(`/wechat/page/membership-master?businessId=${businessId}&businessType=${businessType}`);
	}

	enterCourse({ businessId, businessType }){
		if(!businessId){
			return false;
		}
		if(businessType === 'channel'){
			locationTo(`/wechat/page/channel-intro?channelId=${businessId}`);
		}else if(businessType === 'topic'){
			locationTo(`/wechat/page/topic-intro?topicId=${businessId}`);
		}else{
			window.toast('unknown businessType');
		}
	}

	render(){
		// const courseList = [{}, {}, ...this.state.courseList, {}, {}];
		return (
			<div className="member-center__master-course">
				<div className="title">{this.props.moduleData.title}</div>
				<div className="module-tip">{this.props.moduleData.intro}</div>
				{
					this.props.isSelected === 'N' &&
					<React.Fragment>
						<div className="course-list" ref={r => this.courseListRef = r}>
							<div className="scroll-container"
							     ref={r => this.scrollContainer = r}
							     onScroll={this.courseListScrollHandle}
							     onMouseDown={this.scrollContainerOperatingHandle}
							     onTouchStart={this.scrollContainerOperatingHandle}
							     onMouseUp={this.scrollContainerOperatingHandle}
							     onTouchEnd={this.scrollContainerOperatingHandle}
							>
								{
									this.state.courseList.map((item, i) => (
										<div className="course-item"
										     key={i}
										     style={{
											     width: this.state.itemWidth,
											     height: this.state.itemHeight,
											     margin: this.state.itemMargin,
										     }}
										     ref={r => this[`courseItemRef-${i}`] = r}
										     onClick={e => this.enterMaster(item)}
										     data-business-id={item.businessId}
										>
											{
												item.logo &&
												<div className="pic">
													<Picture src={imgUrlFormat(item.logo, '?x-oss-process=image/resize,h_375,w_294,m_fill,limit_0')} />
													{
														this.props.location.query.businessId === item.businessId &&
														<div className="admire">心仪</div>
													}
												</div>
											}
										</div>
									))
								}
							</div>
						</div>
						<div className="course-intro-list">
							<div className="list-wrapper" ref={r => this.courseIntroListWrapRef = r}>
								{
									this.state.courseIntroList.map((item, i) => (
										<div id={`course-intro-item-${item.businessId}`} className={`course-intro-item${item.showIntro ? '' : ' hide'}`} key={i}>
											<div className="intro-title">{item.teacherName} | {item.teacherIntro}</div>
											<div className="intro-desc">{item.businessName}</div>
										</div>
									))
								}
							</div>
						</div>
					</React.Fragment>
				}
				{
					this.props.isSelected === 'Y' &&
						<div className="course-list--selected">
							{
								this.props.courseList.map((item, i) => (
									<div className="course-item" key={i} onClick={e => this.enterCourse(item)}>
										<div className="avatar">
											<Picture src={imgUrlFormat(item.logo, '?x-oss-process=image/resize,h_210,w_165,m_fill,limit_0')}/>
										</div>
										<div className="course-info">
											<div className="name">{item.businessName}</div>
											<div className="span-02">
												<div className="tip">
													{digitFormat(item.learningNum)}次学习
													{
														item.topicCount &&
														` | ${item.topicCount}课`
													}
												</div>
												<div className="tag">永久回听</div>
											</div>
										</div>
									</div>
								))
							}
						</div>
				}

				<div className="view-more-btn on-log"
				     onClick={e => locationTo(`/wechat/page/membership-master`)}
				     data-log-region="master-view-more-btn"
				>
					查看全部
					<div className="icon_enter"></div>
				</div>
			</div>
		)
	}
}

export default MasterCourse;