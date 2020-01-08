import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';
import ErrorBoundary from '@ql-feat/error-boundary';

import {
	formatDate,
	locationTo
} from 'components/util';

@ErrorBoundary
@autobind
class MemberCard extends PureComponent {

	rightItemClickHandle(index){
		this.props.showRightsDialog(index);
	}

	render(){
		const memberInfo = this.props.memberInfo;
		const isMember = memberInfo.isMember === 'Y';
		return (
			<div className="member-center__member-card">
				{
					!isMember &&
					<React.Fragment>
						<Picture src={this.props.bannerUrl}/>
						<div className="rule-btn--absolute on-log"
						     onClick={e => locationTo('/wechat/page/membership/rules-intro')}
						     data-log-region="rule-btn"
						>规则</div>
						{/*<div className="tip-box">*/}
							{/*<div className="span-01">口碑大学免费学</div>*/}
							{/*<div className="span-02">一张通往终身成长大学的门票</div>*/}
						{/*</div>*/}
					</React.Fragment>
				}
				{
					isMember &&
					<React.Fragment>
						<Picture src={require('./img/bought-card.png')}/>
						<div className="card-container">
							<div className="user-info">
								<div className="avatar"><img src={memberInfo.headImgUrl} alt=""/></div>
								<div className="content">
									<div className="span-01">
										<div className="name-box">
											<div className="name">{memberInfo.name}</div>
											{
												memberInfo.level === 1 &&
												<div className="tag">体验会员</div>
											}
										</div>
										<div className="rule-btn on-log" onClick={e => locationTo('/wechat/page/membership/rules-intro')}
										     data-log-region="rule-btn"
										>规则</div>
									</div>
									{
										memberInfo.expireTime - this.props.sysTime < 7 * 24 * 60 * 60 * 1000 ?
											<div className="expiration-date">距离到期还剩 <strong>{Math.ceil((memberInfo.expireTime - this.props.sysTime) / (24*60*60*1000))}</strong> 天</div>
											:
											<div className="expiration-date">{formatDate(memberInfo.expireTime,"yyyy-MM-dd")}到期</div>
									}

								</div>
								{/*<div className="renew-btn">续费</div>*/}
							</div>
							<div className="rights-list">
								{
									this.props.privilegeList && !!this.props.privilegeList.length &&
									this.props.privilegeList.map((item, i) => {
										if(i > 5){
											return null
										}
										return (
											<div className={`right-item on-log${item.isAuth !== 'Y' ? ' disable' : ''}`}
											     key={i}
											     onClick={e => this.rightItemClickHandle(i)}
											     data-log-region="member-card-right-item"
											     data-log-pos={i + 1}
											>
												<Picture src={item.image} />
												<div className="name">{item.title}</div>
											</div>
										)
									})
								}
							</div>
						</div>
					</React.Fragment>
				}
			</div>
		)
	}
}

export default MemberCard;