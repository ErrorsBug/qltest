import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';

import { locationTo } from '../util';

const SearchBar = ({

}) => {
    return (
        <div className="co-search-bar on-log"
            onClick={e => locationTo('/wechat/page/search/index')}
            data-log-region="search"
            data-log-pos="bar"
            data-log-name="搜索"
            data-log-business_type="tab"
            data-log-business_id="搜索">
            <div className="search-box">
                <div className="search-icon"></div>
                <div className="search-placeholder">搜索话题/直播间</div>
            </div>
        </div>
    );
};

SearchBar.propTypes = {

};

export default SearchBar;
