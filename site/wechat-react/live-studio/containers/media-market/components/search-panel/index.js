import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind, time } from 'core-decorators';
import CommonInput from 'components/common-input';
import { contactInfo } from '../../../../routes/live-studio';
import classNames from 'classnames';

const SEARCHPATH = '/wechat/page/live-studio/media-market';

@autobind
export class SearchPanel extends Component {
    static propTypes = {
        showSearchHistory: PropTypes.bool,
        setSearchHistroyVisiable: PropTypes.func,
        onSortBtnClick: PropTypes.func,
        currentBottomTab: PropTypes.string,
    }

    constructor(props) {
        super(props)
        
        this.state = {
            serachHistory: [],
            // 是否展示排序方式选择面板
            showSortPanel: false,
            // 课程排序方式
            sortWays: [
                {
                    name: '综合排序',
                    sortBy: '',
                    sortOrder: '',
                },
                {
                    name: '热销降序',
                    sortBy: 'sales',
                    sortOrder: 'desc',
                },
                {
                    name: '按完播率降序',
                    sortBy: 'endRate',
                    sortOrder: 'desc',
                },
                {
                    name: '按打赏金额降序',
                    sortBy: 'reward',
                    sortOrder: 'desc',
                },
                {
                    name: '按价格升序',
                    sortBy: 'price',
                    sortOrder: 'asc',
                },
                {
                    name: '按价格降序',
                    sortBy: 'price',
                    sortOrder: 'desc',
                }
            ],
            // 当前选择的课程排序方式
            currentSortWay: '综合排序',
            // sortBtns: [{
            //     name: "按销量",
            //     type: 'orderBuyNumber',
            //     sortOrder: '',
            // },{
            //     name: "按价格",
            //     type: 'orderPrice',
            //     sortOrder: '',
            // }]
        }
    }

    componentDidMount = () => {
        this.getHistoryFromLocalStorage();
        window.onpopstate = () => {
            if (!/search/.test(location.hash)) { 
                this.hideHistory();
            } else {
                this.showHistory();
            }
        }
    }

    componentWillUnmount = () => {
        window.onpopstate = () => {}
    }
    
    
    
    showHistory() {

        if (!/search/.test(location.hash)) {
            window.history.pushState(null, null, location.href + '#search=true');
        }

        this.getHistoryFromLocalStorage();
        this.props.setSearchHistroyVisiable(true);
    }

    hideHistory() {
        this.props.setSearchHistroyVisiable(false);
    }

    // onSortBtnClick(idx) {
    //     const curSortOrder = this.state.sortBtns[idx].sortOrder;
    //     const nextSortOrder = curSortOrder === 'asc' ? 'desc' : 'asc';
    //     const sortBtns = this.state.sortBtns.map((item, index) => {
    //         return {
    //             ...item, 
    //             sortOrder: idx === index ? nextSortOrder : '',
    //         }
    //     })
    //     this.setState({ sortBtns });

    //     this.props.onSortBtnClick(sortBtns[idx]);
    // }

    async onSearchBtnClick() {
        let history = [...this.state.serachHistory];
        if (this.props.searchText !== '') {

            const alreadySearched = history.find(item => item === this.props.searchText);

            if(!alreadySearched) {
                history.push(this.props.searchText);
            }

        }
        if (history.length > 10) {
            history.shift();
        }
        await this.props.searchMarketChannels();
        this.hideHistory();
        window.history.go(-1);
        // console.log(history)
        this.setHistoryToLocalStorage(history);
    }

    onInputChange(e) {
        this.props.setSearchChannelName(e.target.value);
    }

    emptySearchText() {
        // this.props.setSearchChannelName('');
        this.props.setSearchChannelNameAndSearch('')
    }

    onSearchHistroyClick(history) {
        this.hideHistory();
        window.history.go(-1);
        this.props.setSearchChannelNameAndSearch(history)
    }

    getHistoryFromLocalStorage() {
        const localHistory = localStorage.getItem('media-market-search-histroy');
        const serachHistory = localHistory ? localHistory.split(',') : [];
        this.setState({ serachHistory });
    }

    setHistoryToLocalStorage(history = []) {
        localStorage.setItem('media-market-search-histroy', history);
    }

    clearHistroy() {
        this.setState({ serachHistory: [] });
        this.setHistoryToLocalStorage([]);
    }

    // 隐藏或显示排序方式选择面板
    toggleSortPanel() {
        this.setState({
            showSortPanel: !this.state.showSortPanel
        });
    }

    // 选择不同的课程排序方式，对课程进行排序
    onSortBtnClick(event) {
        const { currentSortWay } = this.state;
        const target = event.target;
        const sortName = target.getAttribute('data-sort-name');
        const sortBy = target.getAttribute('data-sort-by');
        const sortOrder = target.getAttribute('data-sort-order');
        if (sortName == currentSortWay) {
            return false;
        } else {
            this.setState({
                currentSortWay: sortName,
                showSortPanel: false,
            });
            this.props.onSortBtnClick(sortBy, sortOrder);
        }
    }

    render() {
        const searchInputClass = classNames({
            "search-input": true,
            "on-blur-margin": this.props.searchText == '',
        });

        return [
            <div className="search-panel-container" key="search-bar">
                <div className="search-bar">
                    <div className={searchInputClass}>
                        {   
                            this.props.searchText == '' ?
                            <span className="icon search-input-icon"></span> :
                            null
                        }
                        <CommonInput 
                            value={this.props.searchText}
                            onChange={this.onInputChange}
                            placeholder="搜索关键词"
                            onFocus={this.showHistory}
                            onClick={this.showHistory}
                            // onBlur={this.hideHistory}
                        />
                        {   
                            this.props.searchText != '' ?
                            <span className="icon search-delete-icon" onClick={this.emptySearchText}></span> :
                            null
                        }
                    </div>
                    {
                        !this.props.showSearchHistory ? 
                        <div className="sort-opener" onClick={this.toggleSortPanel}>
                            <span>{this.state.currentSortWay}</span><span className={classNames("icon-triangle", {"flipped-icon-triangle": this.state.showSortPanel})}></span>
                        </div>
                        // this.state.sortBtns.map((item, idx) => {
                        //     const upArrowClass = classNames({
                        //         icon_triangle_up: true,
                        //         "active-icon": item.sortOrder === 'asc',
                        //     });

                        //     const downArrowClass = classNames({
                        //         icon_triangle_down: true,
                        //         "active-icon": item.sortOrder === 'desc',
                        //     });
                        //     return (
                        //         <div key={item.type}  className="sort-btn" onClick={() => this.onSortBtnClick(idx)}>
                        //             <span className="sort-text">{item.name}</span>
                        //             <div className="sort-btn-icon">
                        //                 <span className={upArrowClass}></span>
                        //                 <span className={downArrowClass}></span>
                        //             </div>
                        //         </div>
                        //     ) 
                        // })
                        :
                        <div className="search-btn" onClick={this.onSearchBtnClick}>
                            搜索
                        </div>
                    }
                </div>
                {
                    this.state.showSortPanel &&
                    <div className="sort-panel">
                        <ul className="sort-buttons-list">
                        {
                            this.state.sortWays.map((item, index) => {
                                return (
                                    <li 
                                        key={index} 
                                        className={classNames({active: item.name == this.state.currentSortWay})}
                                        data-sort-name={item.name}
                                        data-sort-by={item.sortBy}
                                        data-sort-order={item.sortOrder}
                                        onClick={this.onSortBtnClick}>
                                        {item.name}
                                    </li>
                                )
                            })
                        }
                        </ul>
                        <div className="sort-panel-bg" onClick={this.toggleSortPanel}></div>
                    </div>
                }
            </div>,

            this.props.showSearchHistory ? 
            <div className="search-history" key="serach-history">
                <div className="header">
                    <span>搜索历史</span>
                    <span className="icon search-delete-history-icon" onClick={this.clearHistroy}></span>
                </div>

                <div className="historys">
                    {
                        this.state.serachHistory.map((history, idx) => {
                            return (
                                <div 
                                    key={idx}
                                    className="history-content" 
                                    onClick={() => this.onSearchHistroyClick(history)}
                                >
                                    { history }
                                </div>
                            )
                        })
                    }
                </div>
            </div> :
            null
        ]
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel)
