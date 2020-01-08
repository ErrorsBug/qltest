import React, { Component, useRef, useEffect, useCallback, useState } from 'react';
import { isPc, isAndroid, isIOS } from 'components/envi'
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';
import BooksItem from '../../../../components/books-item'
import RecommendItem from '../../../../components/recommend-books'

const isPC = isPc()
const isA = isAndroid()
const isIphone = isIOS()
const rootOpt = () => {
	if(isA) {
		return '0px -60px 0px 0px'
	} else if(isIphone) {
		return `0px -170px 0px 0px`
	} else {
		return '0px -80px 0px 0px'
	}
}

function Child({ bookList }) {
	const rootNode = useRef(null);
	const firstNode = useRef(null);
	const lastNode = useRef(null);
	const lastLen = bookList.length - 1;
	const [observer, setObserver] = useState(null);
	const [ isShow, setIsShow ] = useState(false)
	const callback = useCallback((entries, observer) => {
        entries.forEach( async (entry, index) => {
            if(entry.isIntersecting && entry.target.id === 'bottom') {
				if(isPC || isA) {
					if(entry.intersectionRatio > 0.1){
						setIsShow(true)
					}
					if(entry.intersectionRatio < 0.3){
						setIsShow(false)
					}
				}
				if(isIphone){
					if(entry.intersectionRatio > 0.95) {
						setIsShow(true)
					}
					if(entry.intersectionRatio < 0.95 && entry.intersectionRatio >= 0.9) {
						locationTo('/wechat/page/books-home')
						setIsShow(false)
					}
				}
				
            }
        })
    }, [ observer ])
	const initObserver = useCallback(() => {
		if (typeof IntersectionObserver === 'undefined') {
			throw new Error('Current browser does not support IntersectionObserver ')
			return false
		}
		const opt = {
			root: rootNode.current,
			rootMargin: rootOpt(),
    		threshold: [0, 0.3, 0.5, 0.95, 1]
		}
		const Observer = new IntersectionObserver(callback, opt)
		if (!!firstNode.current) {
			Observer.observe(firstNode.current)
		}
		if (!!lastNode.current) {
			Observer.observe(lastNode.current);
		}
		setObserver(Observer)
	},[ observer ])
	const resetObservation = () => {
		observer && observer.unobserve(firstNode.current);
		observer && observer.unobserve(lastNode.current);
	}
	useEffect(() => {
		initObserver();
		return () => {
			resetObservation();
		}; 
	}, [])
	return (
		<div className="book-list-wraps" ref={ rootNode }>
			<div className="book-list-cont">
				<div className="book-list-scroller" >
					{
						bookList.slice(0,5).map((item, index) => {
							const id = index === 0 ? 'top' : (index === 4 ? 'bottom' : '');
							return (
								<BooksItem ref={ index == 0 ? firstNode : (4 == index) ? lastNode: null} id={ id } isShowD  key={ index } index={ index } {...item} />
							)
						})
					}
				</div>
			</div>
			
			{ isShow && (
				<div className="book-list-more-btn" onClick={ () => {
					locationTo('/wechat/page/books-home')
				} }>
					松手查看更多
				</div>
			)}
		</div>
	)
}


@autobind
export default class extends Component {
	state = {
		showPlayBtnMap: {}
	};
	componentDidMount() {

	}
	render() {
		const { books: {title = '', bookList = [], iconTitle = '', bookSet = {}}, name = '',  } = this.props
		const newBook = bookSet || {}
		const lists = bookList || []
		return (
			<div className="home-books-box">
				<div className="book-head">
					<div className="book-title">
						<h3>{name}</h3> 
					</div>
					<p>{iconTitle && <span>{iconTitle}</span>}{title}</p>
				</div>
				{ !!bookList.length && <Child bookList={ lists } toTopic={ this.toTopic } /> }
				{ !!newBook.nodeCode && (
					<div className="ls-new-books">
						<h4>最新书单</h4>
						<RecommendItem {...newBook} />
					</div>
				) }
                <div className="check-more-btn on-log"
                    data-log-region="books-more"
					data-log-pos="0"
					data-log-name="更多听书"
					onClick={() => {
						locationTo('/wechat/page/books-home');
					}}>
                    <span>查看更多<i className="icon_enter"></i></span>
                </div>
			</div>
		);
	}
}