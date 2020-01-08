import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from "core-decorators";
import { locationTo, getCookie } from "components/util";
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils'
import SwiperImg from './components/swiper-img'
import TabLists from './components/tab-lists'
import HotSort from './components/hot-sort'
import RecommendBook from './components/recommend-book'
import BooksHot from './components/books-hot'
import { getWithChildren, homeIndex } from '../../actions/books'

function NodeComp({ lists = [] }) {
	return (
		<>
			{ lists.map((item, index) => {
				if(Object.is(item.keyD, 'style_3')) {
					return <RecommendBook // 主编推荐
						key={ index }
						lastClass={ (lists.length - 1) === index ? 'last-child' : '' }
						nodeCode={item.nodeCode}
						region="ls-chief-box"
						className="ls-recommend-title" 
						title={ item.title } 
						linkUrl={ item.keyC }
						moreTxt="更多" 
						decs={ item.keyB } />
				}
				if(Object.is(item.keyD, 'style_1')) {
					return <HotSort // 热门
						key={ index }
						nodeCode={item.nodeCode}
						title={ item.title }  
						linkUrl={ item.keyC } />
				}
				if(Object.is(item.keyD, 'style_2')) {
					return <BooksHot // 推荐书单
						key={ index }
						nodeCode={item.nodeCode}
						title={ item.title } 
						linkUrl={ item.keyC }
						decs={ item.keyB } />
				}
			})}
		</>
	)
}

@autobind
class BooksHome extends Component {
	state = {
		homeObj: {},
		lists: [],
		tabList: [],
		bannerList: [],
		homeList: []
	}
	componentWillMount(){
		this.initData();
		this.initBookBanner();
		
	}
	// 初始化数据
	async initData() {
		const { data } = await getWithChildren({ nodeCode: 'QL_LB_HOME' })
		const obj = data?.menuNode || {};
		this.initShare(obj);
		this.setState({
			homeObj: obj,
			lists: obj.children || []
		})
	}
	async initBookBanner() {
		const { dataList } = await homeIndex()
		this.setState({
			homeList: dataList || []
		})
	}
	initShare({ keyA, keyB, keyC, keyD }) {
        let title = keyA;
        let desc = keyB; 
        let shareUrl = keyD
		let imgUrl = keyC
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });
    }
	render() {
		const { homeObj, lists, homeList } = this.state
		return (
			<Page title={homeObj.title} className="ls-books-home">
				<section className="scroll-content-container">
					{ lists.map((item, index) => {
						if(Object.is(item.nodeCode, 'QL_LB_BANNER')) {
							return <SwiperImg key={ index } nodeCode={ item.nodeCode } />
						}
						if(Object.is(item.nodeCode, 'QL_LB_MENU')) {
							return <TabLists key={ index } nodeCode={ item.nodeCode } />
						}
					}) }
					 <NodeComp lists={ homeList } />
				</section>
			</Page>
		);
	}
}

function mapStateToProps(state) {
  return {
    
  };
}

const mapActionToProps = {
  
};

module.exports = connect()(BooksHome);
