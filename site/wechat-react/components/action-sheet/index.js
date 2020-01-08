/**
 * Created by dylanssg on 2017/6/13.
 */
import React, { Component } from 'react';
import { autobind } from 'core-decorators';

@autobind
class ActionSheet extends Component{
	state = {
		isShow: false,
		sheetList: []
	};
	data = {

	};
	componentDidMount(){

	}
	show(sheetList){
		this.setState({
			isShow: true,
			sheetList
		});
	}
	hide(){
		this.setState({
			isShow: false
		});
	}
	sheetHandle = (callback)=> {
		this.hide();
		callback(this.data);
	};
	render() {
		return (
			<div className={`ui-action-sheet${this.state.isShow ? ' show' : ''}`} onClick={this.hide}>
				<div className="container-tt" onClick={e => e.stopPropagation()}>
					<div className="sheet-list">
						{
							this.state.sheetList && !!this.state.sheetList.length && this.state.sheetList.map((sheet, index) => (
								<div className="sheet-item" key={index} onClick={this.sheetHandle.bind(this, sheet.action)}>
									{sheet.name}
									{
										sheet.strong &&
											<span className="strong">{sheet.strong}</span>
									}
								</div>
							))
						}
					</div>
					<div className="cancel-btn" onClick={this.hide.bind(this)}>取消</div>
				</div>
			</div>
		)
	}
}

export default ActionSheet;