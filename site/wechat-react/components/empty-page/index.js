import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/**
 * 20181226重构 jiajun.li
 * 
 * 之前是用emptyPicIndex（number）指定图片的，0时无效的
 * 
 * 现增加语义化名称指定图片，参数为imgKey（string）
 */

const emptyImgMap = {
    1: 'https://img.qlchat.com/qlLive/liveCommon/empty-pic-1-1.png',//珊瑚计划数据的空页面icon
    2: 'https://img.qlchat.com/qlLive/liveCommon/empty-pic-2.png',   //珊瑚计划收益相关列表空页面icon  
    3: 'https://img.qlchat.com/qlLive/media-market/no-content.png', // 媒体商城空列表图标

    default: '//img.qlchat.com/qlLive/liveCommon/empty-page-empty.png',
    noCourse: '//img.qlchat.com/qlLive/liveCommon/empty-page-no-course.png',
    noContent: '//img.qlchat.com/qlLive/liveCommon/empty-page-no-content.png',
    noCoupon: '//img.qlchat.com/qlLive/liveCommon/empty-page-no-coupon.png',
};


class Empty extends React.PureComponent {
    render() {
        const props = this.props;
        const cln = classNames(props.mini ? 'common-empty-m' : 'common-empty', this.props.className);

        let imgSrc = props.emptyPic || emptyImgMap[props.emptyPicIndex] || emptyImgMap[props.imgKey] || emptyImgMap.default;

        return (
            <div className={cln}>
                {
                    !props.hideNoMorePic&&
                    <div className="co-empty-box">
                        <img className="co-empty-img" src={imgSrc} />
                    </div>
                }
                <div className="co-empty-desc">{props.emptyMessage||'没有任何内容哦'}</div>

                {
                    typeof props.footer === 'function' ? props.footer() : props.footer
                }
            </div>
        );
    }
}

Empty.propTypes = {
    //空页面icon自定义参数，
    emptyPicIndex: PropTypes.number,  
    //空页面自定义文案 
    emptyMessage: PropTypes.string,

    hideNoMorePic : PropTypes.bool,

    mini: PropTypes.bool, // 小型空样式，static定位

    imgKey: PropTypes.string, // 指定图片
};

export default Empty;
