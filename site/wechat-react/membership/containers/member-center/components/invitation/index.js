import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import {
	locationTo,
} from 'components/util'

@autobind
class Invitation extends PureComponent {

	doItBtnClickHandle(){
		if(this.props.memberInfo.level === 2 ){
			locationTo('/wechat/page/membership/invitation');
		}else{
			this.props.joinMembership();
		}
	}

	render(){
		return (
			<div className="member-center__invitation">
				<div className="tip">
					<div className="span-01">{this.props.moduleData.title}</div>
					<div className="span-02">{this.props.moduleData.intro}</div>
				</div>
				<div className="do-it-btn on-log"
				     onClick={this.doItBtnClickHandle}
				     data-log-region={this.props.memberInfo.level === 2 ? 'invitation-friends' : 'invitation-join'}
				>
					{
						this.props.memberInfo.level === 2 ?
							'送亲友'
							:
							'立即开通'
					}
				</div>
			</div>
		)
	}
}

export default Invitation;