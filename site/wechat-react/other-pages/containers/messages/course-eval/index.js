import React from 'react';
import Page from 'components/page';
import classNames from 'classnames';

import ScrollView from 'components/scroll-view';
import CourseEvalMsg from './course-eval-msg';

import { request } from 'common_actions/common';
import { collectVisible } from 'components/collect-visible';


class CourseEvalList extends React.Component {
	state = {
		evalList: {
			status: '',
			data: undefined,
			page: {
				size: 10,
			},
		},
    };

	async componentDidMount() {
		await this.getListData();
		
		collectVisible();
		typeof _qla === 'undefined' || _qla.bindVisibleScroll('co-scroll-view');
	}
	// 暂时不用
	getListData = isContinue => {
		const evalList = this.state.evalList;
		if (/pending|end/.test(evalList.status)) return;

		const page = {...evalList.page};
		page.page = isContinue ? page.page + 1 : 1;

		this.setState({
			evalList: {
				...evalList,
				status: 'pending',
			}
		})

		return request({
			url: '/api/wechat/mine/unevaluated',
			method: 'POST',
			body: {
				page,
			}
		}).then(res => {
			if (res.state.code) throw Error(res.state.msg);

			let list = res.data.topicList || [];
			const status = list.length < page.size ? 'end' : 'success';

			/**
			 * 过滤未评价试听课的评价入口，又要过滤无效数据了
			 */
			list = list.filter((item, index) => {
				return !(item.evaluateStatus !== 'DONE' && item.isAuditionOpen === 'Y')
			})

			// 记录本次请求有效数据数目
			this._listDataValidNum = (this._listDataValidNum || 0) + list.length;

			this.setState({
				evalList: {
					...this.state.evalList,
					data: isContinue ? (this.state.evalList.data || []).concat(list) : list,
					status,
					page,
				}
			}, () => {
				if (status !== 'end' && this._listDataValidNum < Math.ceil(page.size * 0.6)) {
					this.getListData(true);
				} else {
					this._listDataValidNum = 0;
				}
			})

			// 清除未读消息红点
			request({
                url: '/api/wechat/evaluation/cleanEvalMsgRedDot',
                method: 'POST',
            }).catch(err => {
			})

		}).catch(err => {
			this._listDataValidNum = 0;
			console.error(err);
			window.toast(err.message);

			this.setState({
				evalList: {
					...evalList,
					status: '',
				}
			})
		})
	}


    render() {
		const evalList = this.state.evalList;

        return (
            <Page title="课程评价" className="p-msgs-eval-list">
				<ScrollView
					onScrollBottom={() => this.getListData(true)}
					status={evalList.status}
				>
					{
						evalList.data && evalList.data.map((item, index) => {
							const cln = classNames('on-visible', {
								'left-tria': item.evaluateStatus === 'WAIT'
							})
							return <CourseEvalMsg
								key={index}
								className={cln}
								isShowGuide={true}
								data={item}
								attrs={{
									'data-log-region': 'course-eval-msg',
									'data-log-pos': index,
									'data-log-status': item.evaluateStatus === 'WAIT' ? 'unevaled' : 'evaled',
								}}
							/>
						})
					}
				</ScrollView>
            </Page>
        );
	}
	
}


module.exports = CourseEvalList;