import React, {Component} from 'react';
import PropTypes from 'prop-types';

const Empty = props => {
    //添加不一样的新空页面icon,可在picArray数组中添加，传参 emptyPicIndex 填写相应的索引即可。（页面滚动加载空间用到）非必填，默认索引是：0
    //自定义文案可用 emptyMessage 定义，非必填，默认文案是：暂无数据
    let picArray=[
        './img/emptyPage.png',//默认通用
        'https://img.qlchat.com/qlLive/liveCommon/empty-pic-1-1.png',//珊瑚计划数据的空页面icon
        'https://img.qlchat.com/qlLive/liveCommon/empty-pic-2.png',   //珊瑚计划收益相关列表空页面icon  
        'https://img.qlchat.com/qlLive/media-market/no-content.png', // 媒体商城空列表图标   
    ];
    return (
        <div className='co-empty' hidden={!props.show}>
            <div className="co-empty-box">
                <img src={props.emptyPicIndex?picArray[props.emptyPicIndex]:require('./img/emptyPage.png') } />
            </div>
            {props.emptyMessage||'暂无数据'}
        </div>
    );
};

Empty.propTypes = {
    // 是否显示empty
    show: PropTypes.bool.isRequired,
    //空页面icon自定义参数，
    emptyPicIndex: PropTypes.number,  
    //空页面自定义文案 
    emptyMessage: PropTypes.string,
};

export default Empty;