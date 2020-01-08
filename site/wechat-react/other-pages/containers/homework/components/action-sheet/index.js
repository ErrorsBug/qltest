/**
 * Created by dylanssg on 2017/6/13.
 */
import React, { Component } from 'react';

class ActionSheet extends Component{
	state = {
		isShow: false
	};
	data = {

	};
	componentDidMount(){
	}
	show(data){
		this.data = data;
		this.setState({
			isShow: true
		});
	}
	hide(){
		this.setState({
			isShow: false
		});
	}
	sheetHandle = (callback, ev)=> {
		this.hide();
		callback(this.data);
	};
	render() {
		if(!this.state.isShow) return null;

		return (
			<div className="action-sheet" onClick={this.hide.bind(this)}>
				<div className="container" onClick={(e) => e.stopPropagation()}>
					<div className="sheet-list">
						{
							this.props.sheetList.map((sheet, index) => {
								return (<div className="sheet-item" key={index} onClick={this.sheetHandle.bind(this, sheet.callback)}>{sheet.name}</div>)
							})
						}
					</div>
					<div className="cancel-btn" onClick={this.hide.bind(this)}>取消</div>
				</div>
			</div>
		)
	}
}

export default ActionSheet;