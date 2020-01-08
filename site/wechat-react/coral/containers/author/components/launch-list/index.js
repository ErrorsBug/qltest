import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    locationTo,
    imgUrlFormat,
    formatMoney,
} from 'components/util';

/*
*投放成功列表
*    businessId	string	业务id
*     businessName	string	业务名称
*     businessImage	string	业务头图
*     amount	int	价格 单位分
*     totalIncome	int	总收益 单位分
*     sharePercent	int	
*/

class LaunchList extends Component {
    render() {
        let courseList=this.props.courseList;
        return (
            <div className="launch-list">
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
                                <div className='num'><span>售价: ￥{formatMoney(item.amount||0)} (分成比例{item.sharePercent}%）</span></div>
                                <div className="price">分成收益: <span>￥<var>{formatMoney((item.amount*item.sharePercent/100))}</var></span></div>
                            </div>
                        </div>
                        <div className="btn-bottom">
                            {/* <div className="income">带来收益: <var>￥{formatMoney(item.totalIncome||0)}</var> </div> */}
                            <div className="btn-drop-down" onClick = {()=>{this.props.showDropTipBox()}}>下架</div>
                        </div>
                    </div>
                    )
                })
            }
                
            </div>
        );
    }
}

LaunchList.propTypes = {
    courseList: PropTypes.array,
};

export default LaunchList;