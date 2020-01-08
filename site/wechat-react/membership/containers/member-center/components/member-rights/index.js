/**
 *
 * @author Dylan
 * @date 2018/10/15
 */
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import Picture from 'ql-react-picture';

class MemberRights extends PureComponent {

	rightItemClickHandle(index){
		this.props.showRightsDialog(index);
	}

	render(){
		return (
			<div className="member-center__member-rights">
				<div className="title">会员权益</div>
				<div className="module-tip">课程随便听，福利经常领</div>
				<div className="rights-list">
					{
						this.props.privilegeList && !!this.props.privilegeList.length &&
						this.props.privilegeList.map((item, i) => (
							<div className="rights-item" key={i} onClick={e => this.rightItemClickHandle(i)}>
								<Picture src={item.image}/>
								<div className="tip">{item.title}</div>
							</div>
						))
					}
				</div>
			</div>
		)
	}
}

export default MemberRights;