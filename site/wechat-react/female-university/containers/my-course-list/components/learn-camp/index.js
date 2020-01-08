import React from 'react'
import { locationTo } from 'components/util';

const LearnCamp = ({campList}) => { 
    return (
        <div className="un-learn-camp"> 
            { 
                campList.map((item,index)=>{
                    return <img className='on-log on-visible'
                                data-log-name={`大学个人课表页-推荐学习营-学习营-${index+1}`}
                                data-log-region={`un-my-course-camp`}
                                data-log-pos={ index+1 }
                                onClick={ () => locationTo(`/wechat/page/university/camp-intro?campId=${ item.id }`)  } key={index} src={item.imageUrl}/>
                   
                })
            } 
        </div>
    )
}

export default LearnCamp