import React,{ PureComponent, Fragment } from 'react' 
import { locationTo } from 'components/util';
import { createPortal } from 'react-dom';
import { listRecommend, getNextCampInfo } from '../../../../actions/home';

export default class extends PureComponent {
    state={
        warmTips:'',
        showNextTime:false
    }
    formatDate(value) {
        if(value) {
            var date = new Date(value);
            var y = date.getFullYear();
            var M = date.getMonth() + 1;
            var d = date.getDate();
            var h = date.getHours();
            M = M < 10 ? '0' + M : M;
            d = d < 10 ? '0' + d : d;
            h = h < 10 ? '0' + h : h;
            return `${M}/${d}`
        }
    }
    async componentDidMount(){
        const { otherSignCamp,prepareCamp } = await listRecommend();
        this.setState({
            otherSignCamp,
            prepareCamp
        })
        getNextCampInfo({
            campId:this.props.campId,
        }).then(({period}) =>{
            let warmTips = ''
            if(period && period.signupStartTime){
                let nextDate = this.formatDate(period.signupStartTime)
                warmTips = `下一期${nextDate}开始报名`
                this.setState({
                    warmTips:warmTips,
                    showNextTime:true
                })
            }
        })
    }
    render() {
        const { otherSignCamp,prepareCamp,warmTips  } = this.state; 
        if(otherSignCamp===undefined||prepareCamp===undefined)return false
        return (
            createPortal(
                <div className="camp-intro-btn full other">
                    {this.state.showNextTime? <div className="other-tip show-nexttime">本期名额已抢光,<br/>{warmTips}</div> : <div className="other-tip">本期名额已抢光</div>} 
                    {
                        (otherSignCamp?.length>0||prepareCamp?.length>0)&&
                        <div className="camp-intro-join"> 
                            <div className="camp-intro-tip">
                                <img src="https://img.qlchat.com/qlLive/business/WFCAFTPB-XETZ-JC91-1572946870359-NUH4JWP94SU8.png"/>
                            </div>
                            <div className="camp-intro-btn on-visible on-log"
                                data-log-name="报名其他学习营"
                                data-log-region="un-camp-intro-btn-other"
                                data-log-pos="0"
                                onClick={()=>{locationTo(`/wechat/page/university/learning-camp-other`)}}> 报名其他学习营 </div>
                        </div>
                    }
                </div>    
            ,document.getElementById('app'))
        )
    }
}