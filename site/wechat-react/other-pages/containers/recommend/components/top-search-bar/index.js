import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router'; 
import BtnFu from './btn-fu'; 

const TopSearchBar = props => {
    return (
        <header className='recommend-top-search-bar'>
            <section>
                <input
                    type="text"
                    placeholder="搜索话题/系列课/直播间"
                    disabled={true}
                />
                {/* 为了解决火狐自动阻止带disabled属性input点击事件的问题，给它加个蒙层来点击 */}
                <Link
                    to="/wechat/page/search"
                    className="cover on-log"
                    data-log-name="搜索"
                    data-log-region="recommend-top-search-bar"></Link>
            </section>
            <BtnFu />
        </header>
    );
};

TopSearchBar.propTypes = {
    
};

export default TopSearchBar;