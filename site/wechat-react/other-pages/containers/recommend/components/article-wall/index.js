import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-swipe';
import { autobind } from 'core-decorators'

import Slider from 'react-slick'
import VerticleMarquee from 'components/verticle-marquee'

@autobind
class ArticleWall extends Component {

    state = {
        index: 1,
    }

    componentDidMount() {
        this.onArticleChange(0)
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevState.index !== this.state.index) {
            this.logVisible()
        }
    }

    get articles() {
        const mapFlag = {
            'recommend': '热推',
            'free': '免费',
            'live': '直播',
            'boutique': '精品',
        }

        let list = this.props.list.map((item, index) => {
            return {
                ...item,
                indexOfAll: index,
                flagname: mapFlag[item.flag],
            }
        })

        let articles = []
        while (list.length > 0) {
            articles.push(list.splice(0, 3))
        }

        return articles
    }

    logEnd = false

    onArticleChange(index) {
        if (this.logEnd) { return }
        if (index === 0) {
            this.logEnd = true
            return
        }
        let list = (this.articles[index]).map(item => {
            return {
                region: 'ab-article',
                 flag: item.flag,
                pos: item.indexOfAll,
                business_id: item.bussinessId,
                business_type: item.bussinessType,
            }
        })

        window._qla && window._qla('visible', {
            logs:JSON.stringify(list)
        })
    }

    onArticleClick(url) {
        window.sessionStorage && window.sessionStorage.setItem('trace_page', 'recommend_ab_article')
        this.props.locationTo(url)
    }

    render() {

        const articleList = this.articles.map((list, index) => {
            return <ul className='article-list' key={`article-list-${index}`}>
                {
                    list.map((item, index) => {
                        return <li
                            className='article-list-item on-log'
                            key={`list-item-${index}`}
                            onClick={() => { this.onArticleClick(item.url) }}
                            data-log-region='ab-article'
                            data-log-flag={item.flag}
                            data-log-pos={item.indexOfAll}
                            data-log-business_id= {item.bussinessId}
                            data-log-business_type= {item.bussinessType}
                        >
                            <span className='flag'>{item.flagname}</span>
                            <p title={item.title}>{item.title}</p>
                            <span className='name'>#{item.comperetor}#</span>
                        </li>
                    })
                }
            </ul>
        })

        const settings = {
            dots: false,
            arrows: false,
            vertical: true,
            autoplay:true,
            infinite: true,
            speed: 400,
            autoplaySpeed:3000,
            slidesToShow: 1,
            slidesToScroll: 1,
            afterChange:this.onArticleChange,
        };
        return (

            <section className={`article-wall-container ${this.props.show?'show':''}`}>
                <h1>精品咖课</h1>
                {
                    this.articles.length > 0 &&
                    <Slider {...settings}>
                        {articleList}
                    </Slider>
                }
            </section>
        );
    }
}

ArticleWall.propTypes = {
    list: PropTypes.array.isRequired,
    locationTo: PropTypes.func.isRequired,
};

export default ArticleWall;
