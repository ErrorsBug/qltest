import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'

import CommonTextarea from 'components/common-textarea';

@autobind
class SearchBar extends Component {

    componentDidMount() {

    }

    focusInput() {
        document.querySelector('#search-input').focus()
    }

    render() {
        const { onChange, onKeyUp, keyword, onClear, allEmpty } = this.props

        return (
            <header className={`search-input-section`}>
                <form action="javascript:void(0);" onClick={this.focusInput}>
                    <input
                        type="search"
                        maxLength="30"
                        placeholder="请输入优惠券备注搜索"
                        onChange={onChange}
                        value={keyword}
                        onKeyUp={onKeyUp}
                        autoFocus
                        id={'search-input'}
                    />
                    {
                        keyword.length > 0 &&
                        <span onClick={onClear} className="clear"></span>
                    }
                </form>
                <span className={`search on-log on-visible${keyword || allEmpty ? '' : ' grey'}`}
                    data-log-region="search"
                    onClick={this.onClickSearch}>搜索</span>
            </header>
        );
    }

    onClickSearch = () => {
        this.props.doSearch();
    }
}

SearchBar.propTypes = {
    keyword: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    doSearch: PropTypes.func.isRequired,
};

export default SearchBar;
