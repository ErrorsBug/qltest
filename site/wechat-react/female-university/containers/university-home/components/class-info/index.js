import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import { locationTo } from 'components/util'
import PublicTitleImprove from '../../../../components/public-title-improve'
import ReactSwiper from 'react-id-swiper'

const ClassItem = ({ userName, userHeadImg,tagAName, tagCName, idx ,businessType }) => (
    <div className="un-class-item on-visible"
        data-log-name={ userName }
        data-log-region="un-home-class"
        data-log-pos={ idx }>
        <div className="un-class-pic">
            <img src={ userHeadImg } />
        </div>
        <div className="un-class-all">
            <p><span>“{ userName }”</span>正在{ tagAName }学习{ tagCName }{businessType=='channel'?"课":''}</p>
        </div>
    </div>
)

@autobind
export default class ClassInfo extends Component {
    handleMoreLink() {
        locationTo(`/wechat/page/university/class-info`)
    }
    render(){
        const opt = {
            direction: 'vertical',
            slidesPerView: 2,
            slidesPerGroup: 2,
            loop: true,
            speed: 900,
            autoplay: {
                delay: 2000,
            },
            noSwiping : true,
            noSwipingClass: 'swiper-slide',
        }
        const { bulletinList, title, isTitle, btm } = this.props;
        return (
            <div className="un-class-box" style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
                { isTitle && <PublicTitleImprove
                    className='un-class-title'
                    title={ title }
                    moreTxt="同班同学"
                    region="un-class-more"
                    handleMoreLink={ this.handleMoreLink }/> }
                <div className="un-class-cont">
                    <div className="un-class-ti"></div>
                    <div className="un-class-list">
                        { !!bulletinList.length && (
                            <ReactSwiper containerClass="un-class-swiper" { ...opt }>
                                { bulletinList.slice(0,40).map((item, index) => (
                                    <div key={index}>
                                        <ClassItem idx={ index } { ...item } />
                                    </div>
                                )) }
                            </ReactSwiper>
                        ) }
                    </div>
                </div>
            </div>
        )
    }
}
