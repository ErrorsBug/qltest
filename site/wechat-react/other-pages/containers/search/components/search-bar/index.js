import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import {getUrlParams} from 'components/url-utils'

import CommonTextarea from 'components/common-textarea';

@autobind
class SearchBar extends Component {

    componentDidMount() {

    }

    
    get isUniversity () {
        return Object.is(getUrlParams('source', ''), 'university')
    }

    focusInput() {

        this.input.focus();
    }

    render() {
        const { onChange, onKeyUp, keyword, onClear } = this.props
        let placeholderText=this.isUniversity?'搜索女大课程/听书':this.props.liveId ? "搜索话题/系列课/打卡" : "搜索话题/系列课/直播间"
        return (
            <header className={`search-input-section`}>
                <form action="javascript:void(0);" 
                    onClick={this.focusInput}
                    onSubmit={ this.focusInput }
                    >
                    <input
                        type="search"
                        maxLength="30"
                        minLength="0"
                        autoComplete="off"
                        name="search"
                        placeholder={placeholderText}
                        onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onChange(e);
                        }}
                        value={ keyword.trim() || '' }
                        onKeyUp={onKeyUp}
                        autoFocus
                        ref={ (r) => this.input = r }
                    />
                    {
                        keyword.length > 0 &&
                        <span onClick={onClear} className="clear"></span>
                    }
                </form>
                <span className={`search on-log on-visible${keyword ? '' : ' grey'}`}
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
