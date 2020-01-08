import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { fillParams } from 'components/url-utils';
import Video from './video'


@withStyles(styles)
class ImgList extends Component {
    
    /**
     *  keyA : 图片
     *  keyB : 视频
     *  keyC : 链接
     */
    render() {
        const { ch } = this.props;
        return (
            <div className={`${styles['img-list-module']} `}>
                {
                    this.props.imgList.map((item,index) => {
                        return <div className={`${styles['img-item']} on-visible`}
                            data-log-region="un-guide-page"
                            data-log-pos={ index }
                            key={`img-item-${index}`}>
                            {
                                item.keyA ?
                                    item.keyC ?
                                        <a href={fillParams({ ch : ch }, item.keyC)}>
                                            <img src={item.keyA} />
                                        </a>
                                    :<img className={ `${ !item.keyC ? 'touch' : '' }` } src={item.keyA} />
                                :null
                            }
                            {
                                item.keyB?
                                <Video url={ item.keyB }/> // 视频播放这里必须是组件；
                                :null
                            }
                        </div>
                    })
                }
            </div>
        );
    }
}

ImgList.propTypes = {

};

export default ImgList;