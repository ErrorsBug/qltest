import React, { Component } from 'react';
import { formatMoney, digitFormat, formatDate } from 'components/util';
import CourseItem from 'components/common-course-item';
import NewCourseItem from 'components/common-course-item/new-course';


const Money = (props) => {
    const { item } = props
    if (item.money > 0) {
        if (item.discount == -1 || (item.discountStatus === 'K' && item.shareCutStartTime > item.currentTime && item.shareCutEndTime < item.currentTime)) {
            return <p className="discount">￥{formatMoney(item.money)}</p>
        } else {
            return (
                <p className="discount">
                    <span className="original">¥{formatMoney(item.money)}</span>
                    <span>¥{formatMoney(item.discount)}</span>
                </p>
            )
        }
    } else {
        return <span className="free">免费</span>
    }
}

const Category1 = (props) => {
    let { data, onClick, tagId } = props
    const topThree = data.splice(0, 3)
    
    let posIndex = -1
    const getPosIndex = () => {
        posIndex += 1
        return posIndex
    }
    
    return (
        <div className="category-zoning-style category-zoning-type-1" >
            <div className="row-between top-three">
                {
                    topThree.map((item, index) => (
                        <div className="top-three-item on-visible on-log" 
                             key={`top-three-item-${index}`}
                             onClick={ e => onClick(item)}
                             data-log-region="topic_list"
                             data-log-pos={ getPosIndex() }
                             data-log-tag_id={tagId}
                             data-log-business_id={item.businessId}
                             data-log-name={item.businessName}
                             data-log-business_type={item.type}
                             >
                            <img src={item.logo} alt=""/>
                            <div className="mark">
                                <p>{ item.remark || item.businessName }</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="remain">
                <div className="remain-title">大师驻场</div>
                <div className="row-between remain-list">
                    {
                        data.map((item, index) => (
                            <div className="remain-item on-visible on-log"
                                 key={`remain-item-${index}`}
                                 onClick={ e => onClick(item)}
                                 data-log-region="topic_list"
                                 data-log-pos={ getPosIndex() }
                                 data-log-tag_id={tagId}
                                 data-log-business_id={item.businessId}
                                 data-log-name={item.businessName}
                                 data-log-business_type={item.type}
                                 >
                                <div className="poster">
                                    <img src={item.logo} alt=""/>
                                </div>
                                <p className="study-count">{digitFormat(item.learningNum || item.authNum || 0)}次学习</p>
                                <div className="info">
                                    <p className="business-name">{item.businessName}</p>
                                    <div className="row-between desc">
                                        <p className="course-count">
                                            {
                                                item.businessType === 'channel' ?
                                                `${item.planCount || item.topicNum}课` :
                                                '单课'
                                            }
                                        </p>
                                        <Money item={ item } />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

const Category2 = (props) => {
    let { data, onClick, tagId } = props
    
    return (
        <div className="category-zoning-style category-zoning-type-2" >
            {
                data.map((item, index) => (
                    <div className="category-item on-visible on-log"
                         key={`category-item-${index}`}
                         onClick={ e => onClick(item)}
                         data-log-region="topic_list"
                         data-log-pos={ index }
                         data-log-tag_id={tagId}
                         data-log-business_id={item.businessId}
                         data-log-name={item.businessName}
                         data-log-business_type={item.type}>
                        <div className="type-2-header">
                            <span>{formatDate(Date.now(), 'dd.MM.yyyy')}</span>
                        </div>
                        <div className="poster">
                            <div className="img-wrap" style={{backgroundImage: `url(${item.logo}@365h_590w_1e_1c_2o)`}}></div>
                        </div>
                        
                        <div className="info row-between">
                            <span className="count">{digitFormat(item.learningNum || item.authNum || 0)}次学习 | {item.businessType === 'channel' ? `${item.planCount || item.topicNum}课` :'单课'}</span>
                            <Money item={ item } />
                        </div>
                        <div className="mark line-2">{ item.remark || item.businessName }</div>
                    </div>
                ))
            }
        </div>
    )
}

export const Category3 = (props) => {
    let { data, onClick, tagId, playing, bsId, selctId, type, auditionPause, playStatus } = props

    return (
        <div className="category-zoning-style category-zoning-type-3" >
            {
                data.map((item, index) => {
                    return item.courses && item.courses.length > 0 ? (
                        <div className="group" key={`category-group-${index}`}>
                            <p className="title sing-line">{item.name}</p>
                            <p className="desc sing-line">{item.desc}</p>
                            <div className="group-list">
                                {
                                    item.courses.map((course, cIndex) => (
                                        <div className="group-item" key={`category-item-${cIndex}`}>
                                                <NewCourseItem
                                                    key={`course-item-${course.id}`}
                                                    className="on-visible on-log"
                                                    data-log-region={`topic_list_${item.id}`}
                                                    data-log-pos= { cIndex }
                                                    data-log-tag_id={tagId}
                                                    data-log-business_id={course.businessId}
                                                    data-log-name={course.businessName}
                                                    data-log-business_type={course.type}
                                                    onClick={e => onClick(course)}
                                                    playing={ playing }
                                                    idx={ cIndex }
                                                    selctId={ selctId }
                                                    auditionPause={ auditionPause }
                                                    playStatus={ playStatus }
                                                    bsId={ bsId }
                                                    type={ type }
                                                    isFlag={ true }
                                                    data={course}
                                                />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ) : null
                })
            }
        </div>
    )
}

export const CategoryZoningStyle = (props) => {
    const { type, ...otherProps } = props

    // 现只有一种样式, 后续会增加样式
    switch (type) {
        case 'style_1':
            return <Category1 {...otherProps}/>
        case 'style_2':
            return <Category2 {...otherProps}/>
        default:
            break
    }
}