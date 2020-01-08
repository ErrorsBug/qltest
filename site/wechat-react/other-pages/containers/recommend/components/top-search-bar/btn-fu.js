import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { request } from 'common_actions/common'
import { locationTo } from 'components/util';

class btnFuEnter extends Component {

    state = {
        enter: false,
        isLoading: false,
        isBuyCamp: false, // 是否购买体验营
    }

    componentDidMount() {
        const authStatus = localStorage.getItem('uniAuthStatus')
        if(authStatus) {
            this.setState({
                enter: authStatus==='Y',
                isLoading: true
            })
        }
        this.getUniversityStatus();
    }

      /**
     * 获取是否购买了女子大学
     *
     * @memberof MineCourse
     */
    async getUniversityStatus() {
        await request({
            url: '/api/wechat/transfer/h5/university/universityStatus',
            method: 'POST',
            body: {
                courseId:''
            }
        }).then(({ data }) => {
            let { authStatus, signUpCamp } = data || {};
            localStorage.setItem('uniAuthStatus', authStatus)
            // PubSub.publish('universityStatus', { authStatus, signUpCamp });
            this.setState({
                enter:authStatus==='Y'?true:false,
                isLoading: true,
                isBuyCamp: Object.is(signUpCamp, 'Y')
            })
		}).catch(err => {
			console.log(err);
		})
    }


    render() {
        const { isLoading, enter, isBuyCamp } = this.state;
        if(!isLoading || (!enter && isBuyCamp)) {
            return null
        }
        return (
            <div className={classnames("btn-fu-enter on-log on-visible",{
                    enter: enter,
                    "defa": !enter
                })} 
                data-log-name="女大首页入口"
                data-log-region="un-home-university"
                data-log-pos={ enter ? 'purchased' : 'camp' }
                onClick={()=>{
                    if(enter) {
                        locationTo('/wechat/page/university/home?with_icon=Y&wcl=university_ql_shouye&ch=university_ql_shouye')
                    } else {
                        if(!isBuyCamp) {
                            locationTo('/wechat/page/university-experience-camp?campId=2000006375050478&wcl=university_pm_qlsearch_10t8yxyq_191115')
                        }
                    }
                }}>
                <i className="icon-fu"></i>
                {
                    enter ? <span>进入大学</span> : (
                        !isBuyCamp ? <span>大学体验营</span> : null
                    )
                }
            </div>
        );
    }
}

btnFuEnter.propTypes = {

};

export default btnFuEnter;