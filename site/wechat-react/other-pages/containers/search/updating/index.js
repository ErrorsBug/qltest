/**
 *
 * @author Dylan
 * @date 2018/5/31
 */
import React, { Component } from 'react';
import Page from 'components/page';
import { locationTo } from 'components/util';

class Updating extends Component {
	render() {
		return (
			<Page title='升级中' className="search-updating">
				<div className="tip-img"></div>
				<div className="text">搜索功能由于技术升级暂时下线，<br/>过几天再来试试吧。</div>
				{/*<div className="to-home-btn" onClick={_=> locationTo('/wechat/page/recommend')}>回首页</div>*/}
			</Page>
		);
	}
}

export default Updating;