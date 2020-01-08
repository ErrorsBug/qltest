/**
 * Created by dylanssg on 2017/5/27.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Detect from 'components/detect';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import { autobind} from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { locationTo } from 'components/util';
import BottomDialog from 'components/dialog/bottom-dialog';
import MaterialBank from '../material-bank';
import OutlineList from '../outline-list';

@autobind
class PrepareLessons extends Component {

	state = {
		isSortMode: false,
		tabOn:'outline',
	};

	data = {
	};

	componentDidUpdate() {
		
	}

	tabOnchange(val) {
		this.setState({
			tabOn:val
		})
	}

	render() {
		if (typeof (document) == 'undefined') {
            return false;
        }
        const portalBody = document.querySelector(".portal-low");
		if (!portalBody) return null
		
		return createPortal(
			<BottomDialog 
				className='prepare-lesson-dialog'
				show={this.props.show}
				theme="empty"
				bghide={true}
				onClose={this.props.close}
			>	
				<div className="tab-bar">
					<span className="tab-body">
						<span onClick={()=>{this.tabOnchange('outline')}} 
							className={`tab-item on-log ${this.state.tabOn=='outline'?'on':''}`}
							data-log-region="tab-menu"
							data-log-pos="material-btn-abstract"
							>提纲</span>
						<span onClick={()=>{this.tabOnchange('material')}} 
							className={`tab-item on-log ${this.state.tabOn=='material'?'on':''}`}
							data-log-region="tab-menu"
							data-log-pos="material-btn-picture"
						>图片</span>
					</span>	

					<span className="btn-close on-log icon_down"
						data-log-region="material-panel"
						data-log-pos="back-btn"
						data-log-name="返回主屏"
						onClick={this.props.close}
					></span>
				</div>
				<div className="prepare-lesson-main">
					{
						this.state.tabOn=='outline'?
							<OutlineList
								addTopicSpeak={this.props.addTopicSpeak}
								close={this.props.close}
							/>
						:null	
					}	
					

					{/*素材库弹层*/}
					{
						this.state.tabOn=='material'?
						<MaterialBank
							topicId={this.props.topicId || 0}
							hideMaterialBank={()=>{}}
							liveId = {this.props.liveId}
							topicStyle = {this.props.topicStyle}
							addTopicSpeak = {this.props.addTopicSpeak}
							currentPPTFileId = {this.props.currentPPTFileId}
							onPPTSwiped = {this.props.onPPTSwiped}
							/>
						:null	
					}
				</div>
			</BottomDialog>

			,
		portalBody
		);
	}
}

PrepareLessons.defaultProps = {
};

function mapStateToProps (state) {
	return {
	}
}

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(PrepareLessons);

