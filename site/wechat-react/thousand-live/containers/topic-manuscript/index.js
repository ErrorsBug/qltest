
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Page from 'components/page';
import { request } from 'common_actions/common';
import TopicAssembleContent from 'components/topic-assemble-content'

function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime'),
	}
}

const mapActionToProps = {
};

class TopicManuscript extends Component {
	state = {
		topicName: '',
		profileList: null
	}

	async componentDidMount () {
		const res = await request({
			url: '/api/wechat/topic/bookProfile',
			method: 'POST',
			body: {
				topicId: this.props.location.query.topicId
			}
		})

		if (res && res.state.code === 0) {
			this.setState({
				topicName: res.data.name,
				profileList: res.data.profileList
			})
		}
	}

	render () {
		const {profileList} = this.state
		return (
			<Page title={this.state.topicName} className='topic-manuscript-page'>
				{
					profileList && <div className="header"><span>{this.state.topicName}</span></div>
				}

				<TopicAssembleContent className="manuscript-content" data={profileList} />
			</Page>
		)
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(TopicManuscript);