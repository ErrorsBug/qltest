import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import  CalendarCard  from 'components/calendar-card';
import classNames from 'classnames' 
import Dialog from '../dialog'; 
import { locationTo } from 'components/util'


@autobind
export default class extends PureComponent{
    state = { 
        isLong:true, 
        isShow: false, 
        cardDate:''
    }
    componentDidMount = () => {
    }; 
    dateToggle(){
        this.setState({
            isLong:!this.state.isLong
        }) 
    }
    onCard(cardDate){
        this.show()
        this.setState({ 
            cardDate
        })
        // 手动触发打点日志 
        typeof _qla != 'undefined' && _qla('click', {
            region:'un-flag-mine-recard',
        });

    }
    show(){
        this.setState({
            isShow: true 
        })
    }
    confirm(){
        this.setState({
            isShow: false,
        }) 
        locationTo(`/wechat/page/flag-recard?cardDate=${this.state.cardDate}`)
    }
    colse(){
        this.setState({
            isShow: false,
        })
    }
    dayHas(now,before){
        if(now&&before){ 
            return Math.ceil((new Date(now)-new Date(before))/(1000*60*60*24))
        }
    }
    render() { 
        const { flagCardList=[] ,cardDate } = this.props 
        const { isLong  , isShow } = this.state; 
        return (
            <Fragment> 
               <div className="fh-date">
                    <div className="fhd-head">
                        <div className="fhd-title">打卡学习日历</div>
                        <div className="fhd-num">已进行{this.dayHas(new Date(),cardDate)}天，打卡{flagCardList.length}次</div>
                    </div>
                    <div className={classNames('fh-tiem-container',{
                        on:isLong
                    }) }>
                        {
                            cardDate&&flagCardList&&
                            <CalendarCard
                                className="fh-time"
                                start={ cardDate}
                                timeLife={ 30}
                                flagCardList={ flagCardList} 
                                onCard={this.onCard}
                            /> 
                        }
                        
                    </div>
                    <div className="fh-toggle">
                        <span onClick={this.dateToggle}
                            className={classNames('',{
                                on:isLong
                            }) }
                        ></span>
                    </div>
                    {
                        createPortal(
                            <Dialog isShow={ isShow }  close={ this.colse } confirm={this.confirm}/>,
                                document.getElementById('app')
                            ) 
                    }
                    
                </div>
            </Fragment>
        )
    }
}
