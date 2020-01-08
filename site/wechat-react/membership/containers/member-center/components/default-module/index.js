/**
 *
 * @author Dylan
 * @date 2018/10/15
 */
import React, { PureComponent } from 'react';
import Picture from 'ql-react-picture';
import { autobind } from 'core-decorators';

import {
	locationTo,
} from 'components/util';


@autobind
class DefaultModule extends PureComponent {
	render(){
		return (
			<div className="member-center__default-module">
				{
					this.props.moduleData.title &&
					<div className="title">{this.props.moduleData.title}</div>
				}
				{
					this.props.moduleData.intro &&
					<div className="module-tip">{this.props.moduleData.intro}</div>
				}
				{
					this.props.moduleData.image &&
					<div className={`module-image${!this.props.moduleData.title && !this.props.moduleData.intro ? ' with-no-title' : ''}`}
					     onClick={e => {
					     	if(this.props.moduleData.url){
					     		locationTo(this.props.moduleData.url)
					     	}
					     }}
					>
						<Picture src={this.props.moduleData.image}/>
					</div>
				}
			</div>
		)
	}
}

export default DefaultModule;