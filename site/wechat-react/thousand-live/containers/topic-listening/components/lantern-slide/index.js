/**
 * Created by dylanssg on 2017/5/27.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swiper from 'react-swipe';
import Detect from 'components/detect';
import shallowCompare from 'react-addons-shallow-compare';


class LanternSlide extends Component {

	state = {
		currentPage: 0,
		currentFileId: this.props.currentFileId || '',
		showGuide: typeof localStorage !== 'undefined' ? !localStorage.getItem('showPPTGuide') : false,
		isPhone: false,
	};

	data = {
        isSwiperFirstRender: false,
	};

	shouldComponentUpdate(nextProps){
		return shallowCompare(this,nextProps);
	}

	componentDidMount(){
		this.initState();
	}
	initState() {

		// 初始化默认序号
		let firstIndex = this.props.pptList.findIndex(element => {
			return this.props.currentFileId == element.fileId;
		});


		this.setState({
			isPhone: Detect.os.phone,
			currentPage: firstIndex >= 0 ? firstIndex + 1 : 1,
		})
	}

	componentDidUpdate(){
		if(!this.data.isSwiperFirstRender && this.props.pptList.length){
			this.data.isSwiperFirstRender = true;
			this.refs['lantern-slide-swiper'].slide(this.getIndexByFileId(this.state.currentFileId))
		}
	}

	componentWillReceiveProps(props) {
		if (this.refs['lantern-slide-swiper'] && (props.currentFileId && this.state.currentFileId !== props.currentFileId)) {
			setTimeout(() => {
				this.refs['lantern-slide-swiper'].slide(this.getIndexByFileId(props.currentFileId));
			},0)
		}
	}

	onSwiped(index, element) {
        if (!index && index !=0) {
            return;
        }

		if (this.props.pptList.length === 2) {
            index = index % 2;
        }
		let currentMaterial = this.props.pptList[index];
		let currentFileId = currentMaterial && currentMaterial.fileId || '';
		
		this.setState({
			currentPage: index + 1,
			currentFileId
		},() => {
			if(this.props.onPPTSwiped){
				this.props.onPPTSwiped(currentFileId);
			}
		});


	}

	prev(){
		this.refs['lantern-slide-swiper'].prev()
	}

	next(){
		this.refs['lantern-slide-swiper'].next()
	}

	slide(index, duration){
		this.refs['lantern-slide-swiper'].slide(index, duration)
	}

	getIndexByFileId(fileId){
		if(!fileId) {
            return 0;
        }

		let index = 0;
		this.props.pptList.forEach((material, i) => {
			if(String(material.fileId) === String(fileId)) {
                index = i;
            }
		});
		return index;
	}

	magnify(currentUrl){
		let imgSize = '?x-oss-process=image/resize,h_1600,w_1600';
		window.showImageViewer(currentUrl+imgSize, this.props.pptList.map((material) => {
			return material.url+imgSize;
		}));
	}

	render() {
		// if(!this.props.isShow) return null;

		return (
			<div className="album-slide">
				<div className="middle-box">	
					<Swiper ref="lantern-slide-swiper"
						className="lantern-slide-swiper"
						swipeOptions={{ callback: this.onSwiped.bind(this), startSlide: this.getIndexByFileId(this.props.currentFileId) }}
						key={this.props.pptList.length} >
						{
							this.props.pptList.map((material, index) => (
								<div key={`lantern-slide-item-${index}`} className="lantern-slide-item" onClick={this.magnify.bind(this, material.url)}>
									{
										(Math.abs(this.state.currentPage-index) <= 2)?
											<img src={`${material.url}?x-oss-process=image/resize,h_375,w_600,m_pad,limit_0,color_000000`} alt="" />
										:null
									}
                                </div>
							))
						}
					</Swiper>
					<div className="pagination">
						<div className="wrap">
							<div className="current">{(this.state.currentPage > 0  && this.state.currentPage <= this.props.pptList.length)? this.state.currentPage : (this.props.pptList.length ? 1 : 0)}</div>
							<div className="split">/</div>
							<div className="total">{this.props.pptList.length}</div>
						</div>
					</div>
				{
					!this.state.isPhone &&
					<div className="controller">
						<div className="prev-btn icon_back" onClick={() => this.refs['lantern-slide-swiper'].prev()}></div>
						<div className="next-btn icon_enter" onClick={() => this.refs['lantern-slide-swiper'].next()}></div>
					</div>
				}

				</div>
			</div>
		)
	}
}

LanternSlide.defaultProps = {
	isShow: true,
	currentFileId: ''
};

function mapStateToProps (state) {
	return {}
}

const mapActionToProps = {

};

// connect(mapStateToProps, mapActionToProps)(LanternSlide);

export default connect(mapStateToProps, mapActionToProps)(LanternSlide);
// export default LanternSlide
