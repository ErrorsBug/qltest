import React,{Component} from 'react';
import LessonItem from './lesson-item';
import {
    formatDate,
} from 'components/util';

class LessonList extends Component {

    render() {
        const {periodList}=this.props;
        var lessonSection=periodList&&periodList.map((item,index)=>{
            return (
                <section className="lesson-list-c" key={`period-list${index}`} onClick={()=>{this.props.sessionTrace(item.dateTime)}}>
                    <header>{formatDate(item.dateTime,"MM月dd日")}{index==0?"·最新一期":null}</header>
                    <ul>
                        {
                            item.dataList&&item.dataList.map((item,index)=>{
                                return <LessonItem {...item} key={`item-l-${index}`}/>
                            })
                        }
                        
                    </ul>
                </section>
            )
        });


        return (
        <div>
            {lessonSection}
            <a href="/wechat/page/recommend" 
                className="lookMore on-log"
                data-log-region="subscribe-lesson"
                data-log-pos="subscribe-lesson"
                data-log-name="更多优质课程定制课程"
            >查看更多优质课程<i className="icon_enter"></i></a>
        </div>
            
        );
    }
}
export default LessonList;