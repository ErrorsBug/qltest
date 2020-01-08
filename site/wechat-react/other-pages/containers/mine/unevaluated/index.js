import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';

import TabView from 'components/tab-view/v2';
import ScrollView from 'components/scroll-view';
import CourseEvalMsg from '../../messages/course-eval/course-eval-msg';

import { request } from 'common_actions/common'; 
import exposure from 'components/exposure';


class Unevaluated extends Component {
	state = {
		activeTabIndex: 1,

		unevaluatedList: {
			status: '',
			data: undefined,
			page: {
				size: 10,
			},
		},

		evaluatedList: {
			status: '',
			data: undefined,
			page: {
				size: 10,
			},
		},
    };

	componentDidMount() {
		this.getListData();

		exposure.bindScroll({
			wrap: 'co-scroll-view',
			callback: this.exposureCallback,
		})
	}

	exposureCallback = els => {
		const dataObj = this.getActiveDataObj();
		els.forEach(el => {
			let index = el.getAttribute('data-log-pos');
			if (index >= 0) {
				dataObj.data[index].isVisible = 1;
			}
		})
	}

	getListData = isContinue => {
		const dataKey = 'evaluatedList';
		const dataObj = this.state[dataKey];
		if (/pending|end/.test(dataObj.status)) return;

		const page = {...dataObj.page};
		page.page = isContinue && dataObj.data ? page.page + 1 : 1;

		this.setState({
			[dataKey]: {
				...dataObj,
				status: 'pending',
			}
		})

		const listDataValidNumK = `_${dataKey}ValidNum`;

		return request({
			url: '/api/wechat/mine/unevaluated',
			method: 'POST',
			body: {
				liveId: this.props.location.query.liveId,
				evalStatus: 'DONE',
				page,
			}
		}).then(res => {
			if (res.state.code) throw Error(res.state.msg);

			let list = res.data.topicList || [];
			const status = list.length < page.size ? 'end' : 'success';

			list = list.filter((item, index) => {
				return !(item.evaluateStatus !== 'DONE' && item.isAuditionOpen === 'Y')
			})

			// 记录本次请求有效数据数目
			this[listDataValidNumK] = (this[listDataValidNumK] || 0) + list.length;

			this.setState({
				[dataKey]: {
					...dataObj,
					data: isContinue ? (this.state[dataKey].data || []).concat(list) : list,
					status,
					page,
				}
			}, () => {
				if (status !== 'end' && this[listDataValidNumK] < Math.ceil(page.size * 0.6)) {
					this.getListData(true);
				} else {
					this[listDataValidNumK] = 0;
				}
			})

			exposure.collect(this.exposureCallback);

		}).catch(err => {
			this[listDataValidNumK] = 0;
			console.error(err);
			window.toast(err.message);

			this.setState({
				[dataKey]: {
					...dataObj,
					status: '',
				}
			})
		})
	}


    render() {
		const dataObj = this.getActiveDataObj();
		const title = this.state.activeTabIndex == 0 ? '待评价' : '已评价';

        return (
            <Page title={title} className="unevaluated-page">
				{/* <TabView
					className="tab-view"
					config={this.tabsConfig}
					activeIndex={this.state.activeTabIndex}
					onClickItem={this.onClickTabItem}
				/> */}

				<ScrollView
					className="scroll-view"
					onScrollBottom={() => this.getListData(true)}
					status={dataObj.status}
					isEmpty={dataObj.data && !dataObj.data.length}
					emptyComp={`暂无${title}课程哦`}
				>
					{
						dataObj.data && dataObj.data.map((item, index) => {
							return <CourseEvalMsg
								key={title + index}
								data={item}
								className="on-visible"
								attrs={{
									'data-log-region': 'course-eval-msg',
									'data-log-pos': index,
									'data-log-status': item.evaluateStatus === 'WAIT' ? 'unevaled' : 'evaled',
									isvisible: item.isVisible,
								}}
							/>
						})
					}
				</ScrollView>
            </Page>
        );
	}
	
	tabsConfig = [
		{
			name: '待评价',
			className: 'on-log',
			attrs: {
				'data-log-region': 'tab-unevaled'
			}
		},
		{
			name: '已评价',
			className: 'on-log',
			attrs: {
				'data-log-region': 'tab-evaled'
			}
		},
	]

	onClickTabItem = index => {
		this.setState({
			activeTabIndex: index,
		}, () => {
			exposure.collect(this.exposureCallback);

			if (!this.getActiveDataObj().data) this.getListData();
		})
	}

	getActiveDataObj = () => {
		return this.state[this.state.activeTabIndex == 0 ? 'unevaluatedList' : 'evaluatedList'];
	}
}

module.exports = connect((state) => {
	return {
	}
}, {
})(Unevaluated);
