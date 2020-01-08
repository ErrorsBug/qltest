 
import React from 'react'
import classNames from 'classnames' 

// 打开日期组件
class CalendarCard extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            dateArr:[]
        }
    }
    componentDidMount () {
        this.initDate()
    }
    
    initDate(){ 
        this.calendar()
    }
    calendar(){
        this.getBefore()
        this.getAfter()
        this.setState({
            dateArr:this.state.dateArr
        })
    }

    getBefore(){ 
        const {start} =this.props
        const date = new Date(start)
        const weekDay = date.getDay()
        if(weekDay>0){
            for(let i=0;i<weekDay;i++){
                let time =new Date(date.setDate(date.getDate()-1))
                let isToday = this.isToday(time)
                let hdate= time.getDate()
                this.state.dateArr.unshift({time:hdate,status:isToday?'now':'disabled',curTiem:time.getTime()}) 
            }
        }
    }
    getAfter(){ 
        const {start,timeLife,flagCardList=[]} =this.props 
        const date = new Date(start)
        const len = this.state.dateArr.length
        const weekDay = date.getDay()
        for(var i=0,j=0;i<(weekDay==6?42:35)-len;i++,j++){ 
            // let endTime = ;
            let time =new Date(date.setDate(date.getDate()+(i>0?1:0))) 
            let isToday = this.isToday(time)
            let isFail = this.isLess(time)
            let isBegin = !this.isLess(time)&&i==0
            let isSuccess=flagCardList.find((item,index)=>{ 
                return this.isSuccess(time,item.cardDate)
            }) 
            let hdate= time.getDate()
            this.state.dateArr.push(
                {
                    time:hdate,
                    curTiem:time.getTime(),
                    status:
                        
                        isToday&&!!isSuccess?
                        'now-success'
                        : isToday?
                        'now'
                        :j>=timeLife?
                        '':
                        !!isSuccess?
                        'success':
                        !!isFail?
                        'fail':
                        !!isBegin?
                        'begin':
                        j<timeLife?
                        'playing':
                        'disabled'}) 
        } 
    }
    //是否今天
    isToday(str) {
        if (new Date(str).toDateString() === new Date().toDateString()) {
            return true
        }  
        return false
    } 
    //是否已打卡
    isSuccess(str,nextStr) {
        if (new Date(str).toDateString() === new Date(nextStr).toDateString()) {
            return true
        }  
        return false
    } 
    //是否小与今天
    isLess(str) {
        if (new Date(str)< new Date()) {
            return true
        }  
        return false
    } 

    componentDidUpdate(preProps){ 
        if(preProps.flagCardList !==this.props.flagCardList){
            this.setState({
                dateArr:[],
            },()=>{
                this.calendar();
            });
            
        }
    }
    getShowDate(time){
        const date = new Date(time)
        const m = date.getMonth()+1
        const d = date.getDate()
        return d==1?`${m}.${d}`:d
    }
    render () {
        const { dateArr } = this.state  
        return (
            <div className={classNames(['ql-calendar-card', this.props.themeClassName ])}>
                <div className="qcc-head">
                    <div className="qcc-item">日</div>
                    <div className="qcc-item">一</div>
                    <div className="qcc-item">二</div>
                    <div className="qcc-item">三</div>
                    <div className="qcc-item">四</div>
                    <div className="qcc-item">五</div>
                    <div className="qcc-item">六</div>
                </div>
                <div className="qcc-date">
                    {
                        dateArr.map((item,index)=>{ 
                            return <div className="qcd-item" key={index}>
                                    {
                                        item.status=='now-success'?
                                        <div className="qcd-on success">
                                            <span>今</span>
                                            <i></i>
                                        </div>
                                        :
                                        item.status=='now'?
                                        <div className="qcd-on now">
                                            <span>今</span>
                                        </div>
                                        :  item.status=='success'?
                                        <div className="qcd-on success">
                                            <span>{this.getShowDate(item.curTiem) }</span>
                                            <i></i>
                                        </div>
                                        :   item.status=='playing'?
                                        <div className="qcd-on play">
                                            <span>{this.getShowDate(item.curTiem)}</span>
                                        </div>
                                        :   item.status=='fail'?
                                        <div className="qcd-on fail">
                                            <span onClick={()=>this.props.onCard(item.curTiem)}>补</span>
                                        </div>
                                        :item.status=='begin'?
                                        <div className="qcd-on success">
                                            <span>开始</span>
                                        </div>
                                        :<div>
                                            {this.getShowDate(item.curTiem)}
                                        </div>
                                    }
                                </div>
                        })
                    }
                </div>
            </div>
        )
    }
}

// CalendarCard.propTypes = {
//     col: PropTypes.number, 
//     value: PropTypes.array,
//     cancelText: PropTypes.string, 
//     cascade: PropTypes.bool, 
//     onCancel: PropTypes.func
// };

CalendarCard.defaultProps = {
    start: new Date(2019,4,26),
    timeLife: 30,
    flagCardList: [],
    onCard: ()=>{
        console.log(123)
    }
};

export default CalendarCard