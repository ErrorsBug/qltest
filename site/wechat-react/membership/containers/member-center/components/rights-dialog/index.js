import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';

import Swiper from 'react-swipe';

@autobind
class RightsDialog extends PureComponent {

	state = {
		show: false,
		startSlide: 0,
		currentIndicator: 0
	};

	show(index){
		this.setState({
			show: true,
			startSlide: index,
			currentIndicator: index
		}, () => {
			this.rightsList.style.height = this.rightsList.clientHeight + 'px';
		});
	}

	hide(){
		this.setState({
			show: false
		})
	}

	closeBtnClickHandle(){
		this.hide();
	}

	dialogClickHandle(){
		this.hide();
	}

	containerClickHandle(e){
		e.stopPropagation();
	}

	onSwiped(index){
		this.setState({
			currentIndicator: index
		})
	}

	slideTo(index){
		this.swiper.slide(index);
	}

	render(){
		return (
			<div className={`member-center__rights-dialog${this.state.show ? '' : ' hide'}`} onClick={this.dialogClickHandle}>
				<div className="dialog-container" onClick={this.containerClickHandle}>
					<div className="rights-list" ref={r => this.rightsList = r}>
						{
							this.props.privilegeList && !!this.props.privilegeList.length && this.state.show &&
							<Swiper
								ref={r => this.swiper = r}
								className='rights-list-swiper'
								swipeOptions={{
									startSlide: this.state.startSlide,
									auto: 0,
									callback: this.onSwiped
								}} >
								{
									this.props.privilegeList.map((item, i) => (
										<div className="right-item" key={i}>
											<div className="header">
												<Picture src={item.image}/>
												<div className="title">{item.title}</div>
											</div>
											<div className="content">{item.remark}</div>
										</div>
									))
								}
							</Swiper>
						}
					</div>
					{
						this.props.privilegeList && !!this.props.privilegeList.length && this.state.show &&
						<div className="indicator">
							{
								this.props.privilegeList.map((item, i) => (
									<div className={`dot${this.state.currentIndicator === i ? ' current' : ''}`} key={i} onClick={e => this.slideTo(i)}></div>
								))
							}
						</div>
					}
					<div className="close-btn" onClick={this.closeBtnClickHandle}>知道了</div>
				</div>
			</div>
		)
	}
}

export default RightsDialog;