import * as React from 'react';
import { connect } from 'react-redux'
import { apiService } from '../../../../components/api-service'
import styles from './style.scss'

import { Carousel } from 'antd'
import { imgUrlFormat } from '../../../../components/util';

export interface BannerProps {
}

export default class Banner extends React.Component<BannerProps, any> {

    state = {
        banners:[],
        leftHover: false,
        rightHover: false,
    }

    carousel: null

    componentWillMount() {
        // 兼容搜狗浏览器: `document.querySelectorAll(...).forEach is not a function(…)`
        if (typeof document.querySelectorAll('body').forEach != 'function') {
            const querySelectorAll = document.querySelectorAll.bind(document);
            document.querySelectorAll = function (selector) {
                const nodeList = querySelectorAll(selector);
                return Array.prototype.slice.call(nodeList);
            }
        }
    }

    componentDidMount() {
        this.fetchBanners()
    }

    async fetchBanners() {
        this.setState({ loading: true })
        const result = await apiService.get({
            url: '/h5/knowledge/bannerList',
            body: {
                caller: 'web'
            }
        })

        if (result.state.code === 0) {
            this.setState({ banners: result.data.bannerList })
        }
    }

    onClickBanner(url: string) {
        window.open(url,'_blank')
    }

    hover = (e) => {
        let arrowHover = e.currentTarget.className.indexOf('left') != -1 ? 'leftHover' : 'rightHover';
        this.setState({
            [arrowHover]: true
        })
    }

    unHover = (e) => {
        let arrowHover = e.currentTarget.className.indexOf('left') != -1 ? 'leftHover' : 'rightHover';
        this.setState({
            [arrowHover]: false
        })
    }

    render() {
        const {banners}= this.state
        if (Boolean(banners.length)) {
            return (
                <div className={styles.carousel}>
                    <Carousel 
                        autoplay 
                        ref={(c) => {this.carousel = c}}>

                        {
                            banners.map((item,index) => {
                                    return (
                                    <div key={`banner-${index}`} >
                                        <img
                                            src={imgUrlFormat(item.backgroundUrl, `?x-oss-process=image/resize,m_fill,limit_0,h_380,w_${window.innerWidth || 1920}`)}
                                            className={styles['banner-image']}
                                            alt=""
                                            onClick={() => { this.onClickBanner(item.url) }}
                                        />
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                    <div className={styles.leftRow} onClick={() => {this.carousel.prev()}} onMouseMove={this.hover} onMouseLeave={this.unHover}>
                        {
                            <img src={this.state.leftHover ? require('../../assets/left-hover.png') : require('../../assets/left.png')} />
                        }
                    </div>
                    <div className={styles.rightRow} onClick={() => {this.carousel.next()}}  onMouseMove={this.hover} onMouseLeave={this.unHover}>
                        <img src={this.state.rightHover ? require('../../assets/right-hover.png') : require('../../assets/right.png')} />
                    </div>
                </div>
            )
        }
        else {
            return null
        }
    }
}
