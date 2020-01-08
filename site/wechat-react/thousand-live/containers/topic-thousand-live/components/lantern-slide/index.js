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
		this.setState({
			isPhone:Detect.os.phone,
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
		let currentMaterial = this.props.pptList.filter((material, i) => {
			return index === i;
		});
		let currentFileId = currentMaterial[0] && currentMaterial[0].fileId || '';

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
		if(!this.props.isShow) return null;


		return (
			<div className="lantern-slide">
				{
					this.props.pptList.length > 0?
					<Swiper ref="lantern-slide-swiper" className="lantern-slide-swiper" swipeOptions={{ callback: this.onSwiped.bind(this) , startSlide: this.getIndexByFileId(this.props.currentFileId) }}  key={this.props.pptList.length} >
						{
							this.props.pptList.map((material, index) => (
								<div key={ `lantern-slide-item-${index}` } className="lantern-slide-item" onClick={this.magnify.bind(this, material.url)}>
                                    <span style={{backgroundImage: `url(${material.url}?x-oss-process=image/resize,h_360)`}}></span>
                                </div>
							))
						}
					</Swiper>
					:null
				}
				{
					this.props.pptList.length ?
					<div className="pagination">
						<div className="wrap">
							<div className="current">{(this.state.currentPage > 0  && this.state.currentPage <= this.props.pptList.length)? this.state.currentPage : (this.props.pptList.length ? 1 : 0)}</div>
							<div className="split">/</div>
							<div className="total">{this.props.pptList.length}</div>
						</div>
						</div>
					:null
				}
				{
					!this.state.isPhone &&
					<div className="controller">
						<div className="prev-btn icon_back" onClick={() => this.refs['lantern-slide-swiper'].prev()}></div>
						<div className="next-btn icon_enter" onClick={() => this.refs['lantern-slide-swiper'].next()}></div>
					</div>
				}

				{
					this.props.power.allowSpeak && !this.props.pptList.length &&
					<div className="guide-for-manager">
						<section>点击底部[备课]即可课前上传课件</section>
						<section>如需上传PPT文件，请将PPT导出为图片后批量上传，最佳比例为11:5</section>
						<section>在电脑微信端打开千聊也可上传课件</section>
					</div>
				}
				{
					!this.props.power.allowSpeak && !this.props.pptList.length &&
					<div className="no-ppt">
						<div className="icon_ppt"></div>
						<div className="tip">当前暂无课件</div>
					</div>
				}
				{
					this.state.showGuide && !this.props.power.allowSpeak && this.props.pptList.length &&
					<div className="user-guide" onClick={() => {localStorage.setItem('showPPTGuide','true');this.setState({showGuide: false})}}></div>
				}

			</div>
		)
	}
}

LanternSlide.defaultProps = {
	isShow: true,
	currentFileId: ''
};

function mapStateToProps (state) {
	return {
		pptList: state.thousandLive.pptList
	}
}

const mapActionToProps = {

};

// connect(mapStateToProps, mapActionToProps)(LanternSlide);

export default connect(mapStateToProps, mapActionToProps)(LanternSlide);
// export default LanternSlide
