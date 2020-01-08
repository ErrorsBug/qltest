import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';  
import { examMyExamList } from '../../actions/exam';
import { locationTo } from 'components/util';
import ScrollToLoad from 'components/scrollToLoad'; 
import NoData from './components/no-data'

@autobind
class CourseTestList extends Component { 
    state = { 
        classInfo: {},
        examResultList:[],
        noData:false
    }
    
    page = {
        size: 20,
        page: 1
    }
    async componentDidMount() {
        this.initData()
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-course-test-list-box');
    }
    async initData(){ 
        const { examResultList } = await examMyExamList({
            ...this.page
        })  
        
        if(!!examResultList){
            if(examResultList.length >= 0 && examResultList.length < this.page.size){
                this.setState({
                    isNoMore: true
                }) 
            }  
            this.setState({
                examResultList: [...this.state.examResultList, ...examResultList]
            },()=>{
                if(!this.state.examResultList||this.state.examResultList.length==0){
                    this.setState({
                        noData:true
                    })
                }
            })
        } 
    }
    
    async loadNext(next) { 
        if(this.isLoading || this.state.isNoMore) return false;
        this.page.page += 1;
        this.isLoading = true;
        await this.initData();
        this.isLoading = false;
        next && next();
    }
    render(){
        const { examResultList,isNoMore,noData } = this.state
         
        return (
            <Page title={ `我的测评` } className="un-course-test-list-box">
                { noData && <NoData /> }
                <ScrollToLoad
                    className={"cp-scroll-box"}
                    toBottomHeight={300}
                    disable={ isNoMore }
                    loadNext={ this.loadNext }
                    >
                <div className="ctl-list">
                    {
                        examResultList?.map((item,index)=>{
                            return ( 
                                <div className="ctl-item" key={index+1}>
                                    <div className="ctl-item-container on-log on-visible"
                                        data-log-name={`大学测评集合页-测评-${index+1}`}
                                        data-log-region={`un-my-exam-list`}
                                        data-log-pos={ index+1 }
                                        onClick={()=>{
                                            item.userJoinFlag=='Y'?
                                            locationTo(`/wechat/page/university-study-advice?examId=${item.id}`)
                                            :
                                            locationTo(`/wechat/page/university/course-exam?examId=${item.id}`)
                                        }}>
                                        <div className="ctl-item-top">
                                            {
                                                item.userJoinFlag=='Y'&&<span>已测</span>
                                            }
                                            
                                            <img src={item.img} />
                                        </div>
                                        <div className="ctl-item-title">{item.title}</div> 
                                        <div className="ctl-item-btn-container">
                                            {
                                                item.userJoinFlag=='Y'?
                                                <div className="ctl-item-btn on">查看测评结果</div>
                                                : 
                                                <div className="ctl-item-btn">前往测评</div>
                                            }
                                        </div>
                                    </div>
                                </div> 
                            )
                        })
                    }
                </div>
                    
                </ScrollToLoad>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
 
};

module.exports = connect(mapStateToProps, mapActionToProps)(CourseTestList);