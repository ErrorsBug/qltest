/**
 *
 * @author Dylan
 * @date 2018/6/6
 */
import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import { withRouter, Link } from 'react-router';

import GroupingList from './components/grouping-list';
import GroupPost from './components/group-post';

@withRouter
@autobind
class GroupingInfo extends Component {
	render(){
		return (
			<Fragment>
				
				{
					this.props.location.query.groupId ?
						<GroupPost
							groupInfo={this.props.currentGroupInfo}
							currentTime={this.props.sysTimestamp}
							endTime={this.props.currentGroupInfo.endTime}
							groupId={this.props.location.query.groupId}
							leaderName={this.props.currentGroupInfo.leaderName}
						/>
						:
						<GroupingList
							groupingList={this.props.groupingList}
							discountMoney={this.props.marketingInfo.discount}
							currentTime={this.props.sysTimestamp}
							updateChannelGroupingList={this.props.updateChannelGroupingList}
							myGroupInfo={this.props.myGroupInfo}
							joinGroup={this.props.joinGroup}
						    userId={this.props.userId}
						/>
				}
			</Fragment>
		)
	}
}

export default GroupingInfo;