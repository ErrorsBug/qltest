/**
 *
 * @author Dylan
 * @date 2018/10/15
 */
import React, { PureComponent } from 'react';
import Picture from 'ql-react-picture';
import { autobind } from 'core-decorators';

@autobind
class CoursesCarousel extends PureComponent {

	state = {
		carouselStart: false,
		carouselPause: false
	};

	componentDidMount(){
		if(this.mainPictureRef && this.mainPictureRef.img && this.mainPictureRef.img.width){
			// 有时候没触发onload事件
			this.startCarousel();
		}
	}

	startCarousel(){
		if(this.state.carouselStart){
			return false;
		}
		this.setState({
			carouselStart: true
		});
	}

	mainImgLoadedHandle(){
		this.startCarousel();
	}

	carouselContainerMouseEnterHandle(){
		this.setState({
			carouselPause: true
		});
	}

	carouselContainerMouseLeaveHandle(){
		this.setState({
			carouselPause: false
		});
	}

	render(){
		return (
			<div className="member-center__courses-carousel">
				<div className="title">{this.props.moduleData.title}</div>
				<div className="module-tip">{this.props.moduleData.intro}</div>
				{
					this.props.moduleData.image &&
					<div className="carousel-box" ref={r => this.carouselBoxRef = r}>
						<div className={`carousel-container${this.state.carouselStart ? ' start-animation' : ''}`}
						     ref={r => this.carouselContainerRef = r}
						     // onMouseEnter={this.carouselContainerMouseEnterHandle}
						     // onMouseLeave={this.carouselContainerMouseLeaveHandle}
						>
							<Picture src={this.props.moduleData.image} innerRef={r => this.mainPictureRef = r} onLoad={this.mainImgLoadedHandle}/>
							<Picture src={this.props.moduleData.image}/>
						</div>
					</div>
				}
			</div>
		)
	}
}

export default CoursesCarousel;