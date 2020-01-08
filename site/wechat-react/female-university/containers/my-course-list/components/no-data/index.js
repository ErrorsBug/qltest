import React from 'react'
import { locationTo } from 'components/util';

const NoData = () => {
    return (
        <div className="no-data-show">
            <div>
                <p>你还没添加任何学习计划呢</p>
                <div className="go-home" onClick={ () => locationTo('/wechat/page/university/home') }>去选课</div>
            </div>
        </div>
    )
}

export default NoData