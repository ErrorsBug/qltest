import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    locationTo,
    imgUrlFormat,
    formatMoney,
} from 'components/util';

/*
    备选投放课程列表
    businessId	string	业务id
    businessType	string	业务类型 TOPIC/CHANNEL
    businessName	string	业务名称
    businessImage	string	业务头图
    amount	string	价格 单位分
    learningNum	int	学习人次
    authNum	int	报名人次
    status	string	状态 N待申请 R待审核
*/

class SelectList extends Component {
    
    render() {
        let courseList=this.props.courseList;
        return (
            <div className="course-list">
                {
                    courseList.map((item,index)=>{
                        return (
                        <div className="course-li" key={`course-li-${index}`}>
                            <div className="course-info" onClick={this.props.goToCourse.bind(this,item.businessType,item.businessId)}> 
                                <div className="head-img"><img src={imgUrlFormat(item.businessImage,"@240w_148h_1e_1c_2o")} /></div>
                                <div className="right">
                                    <div className="name text-elli">
                                        {item.businessType==='CHANNEL'?<span className="type">系列课</span>:<span className="type">单课</span>}
                                        {item.businessName}
                                    </div>
                                    <div className='num'><span>学习: {item.learningNum||0}次</span><span className="num-r">报名: {item.authNum||0}人</span></div>
                                    <div className="price">售价: <span>￥<var>{formatMoney(item.amount)}</var></span></div>
                                </div>
                            </div>
                            {
                                item.status==='R'?
                                <div className="btn btn-push-cancel" onClick={()=>{this.props.setLaunchClick(index)}}>取消推广</div>
                                :
                                <div className="btn btn-push-please" onClick={()=>{this.props.setLaunchClick(index)}}>申请推广</div>
                            }
                            
                        </div>
                        )
                    })
                }
                
            </div>
        );
    }
}

SelectList.propTypes = {
    courseList: PropTypes.array,
};

export default SelectList;