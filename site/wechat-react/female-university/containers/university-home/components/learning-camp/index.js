import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import Picture from 'ql-react-picture';
import { locationTo, formatDate } from 'components/util';
import PublicTitleImprove from '../../../../components/public-title-improve'
import ApplyUserList from '../../../../components/apply-user-list'
import ReactSwiper from 'react-id-swiper'
import CampStatus from '../../../../components/camp-status'
import { studyCampStatus } from '../../../../actions/home'; 

const LearningItem = ({ imageUrl,sysTime, title, campId, idx, indexPageBgColor,studyCampConfigDto,  collectStatus,   
        startTime, endTime,signupStartTime,signupEndTime,studentLimit,signUpNum,hasReservationNum, signUpUserList=[],...otherProps }) => {
    const flag = Object.is(collectStatus, 'Y')
    const time = new Date().getTime()  

    //状态A报名时间未到，B报名中人数未满，C报名中人数已满，D报名结束
    let status=studyCampStatus({sysTime,signupStartTime,signupEndTime,studentLimit,signUpNum,hasReservationNum}) 
    return (
        <div className="learning-item on-log on-visible"
            data-log-name={ studyCampConfigDto?.title }
            data-log-region="un-home-camp"
            data-log-pos={ campId }
            data-log-index={ idx }
            onClick={ () => locationTo(`/wechat/page/university/camp-intro?campId=${ campId }`)  }>
            <img src={ studyCampConfigDto?.imageUrl } alt=""/>
            <div className="learning-item-bg" style={{ background: studyCampConfigDto?.indexPageBgColor }}></div>
            <div className="learning-item-info" >
                <div className={ `ln-course-info ln-course-news` }>
                    {
                        status=="A"&&
                        <div className="ln-course-play">报名时间：{ new Date(signupStartTime).toDateString() === new Date().toDateString()?`今天${formatDate(signupStartTime, 'hh:mm')}`:formatDate(signupStartTime, 'MM/dd hh:mm') }开始</div>
                    }
                    <p>
                        {
                            status=="B"&&<CampStatus className={ 'ing'  } txtStatus={  '火热报名中' } /> 
                        } 
                        {
                            status=="C"&&<CampStatus className={ 'end'  } txtStatus={  '名额已抢光' } /> 
                        } 
                        {
                            status=="D"&&<CampStatus className={ 'end'  } txtStatus={  '报名已结束' } /> 
                        }  
                    </p>
                    <h3> {studyCampConfigDto?.title }  </h3> 
                    {
                        (!!signUpUserList && !Object.is(status, 'A')) &&<ApplyUserList className={`ln-course-user ${status!="D"?'ing':'end'}`} userCount={parseFloat(signUpNum||0)+parseFloat(hasReservationNum||0) } userList={signUpUserList} />
                    }
            </div>
            </div>
        </div>
    )
}

@autobind
export default class extends Component {
    handleMoreLink(){
        locationTo(`/wechat/page/university/learning-camp`);
    }
    render() {
        const opts = {
            slidesPerView: 1.2,
            spaceBetween: 14,
        }
        const { title, decs, campList, isTitle, btm ,sysTime} = this.props;
        return (
            <div className="un-learning-box" style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
                { isTitle && <PublicTitleImprove
                    className='un-learning-title'
                    title={ title }
                    moreTxt="全部"
                    decs={ decs }
                    region="un-camp-more"
                    handleMoreLink={ this.handleMoreLink } /> }
                <div className="un-learning-list">
                    { !!campList.length && (
                        <ReactSwiper {...opts}>
                            { 
                                campList.map((item, index) =>{
                                    if(index>2)return false
                                    return(
                                        <div key={ index }>
                                            <LearningItem idx={index} { ...item } sysTime={sysTime}/>
                                        </div>
                                    )
                                } ) 
                            }
                        </ReactSwiper>
                    ) }
                </div>
            </div>
        )   
    }
}