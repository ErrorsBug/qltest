import React from 'react'
import { locationTo } from 'components/util'; 
import { Link } from 'react-router'; 

const Search = ({className=''}) => (
    <div className={`un-icon-search on-log ${className}`}
        data-log-name="搜索"
        data-log-region="un-search-btn"
        data-log-pos="0"
        onClick={ () => locationTo(`/wechat/page/search?source=university`) }></div>
)
export default Search