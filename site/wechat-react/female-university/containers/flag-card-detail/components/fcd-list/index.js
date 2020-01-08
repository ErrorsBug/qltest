import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import CardItem from '../../../../components/card-item'; 
import {  locationTo } from 'components/util';

@autobind
export default class extends PureComponent {
    state = {
        isMore: false,
        flagCardList:[]
    }
    componentDidMount = () => {
    };
    componentDidUpdate = (preProps) => {
        if (preProps.flagCardList != this.props.flagCardList) {
            let flagCardList=this.props.flagCardList&&this.props.flagCardList.filter((item,index)=>{
                return item.pay=='N'
            }) 
            this.setState({
                flagCardList
            }) 
        }
    }
    activeChange(i) {
        this.setState({ activeIndex: i })
    }
    sumMoney(flagList) {
        let sum = 0;
        flagList.map((item, index) => {
            sum += parseFloat(item.money)
        })
        return sum
    }

    //是否今天
    isToday(str) {
        if (new Date(str).toDateString() === new Date().toDateString()) {
            return true
        }
        return false
    }

    onClickViewPic(index, source) {
        let sourceArray = source.map((item, i) => {
            return item.url;
        });
        window.showImageViewer(sourceArray[index], sourceArray);
    }
    toggleMore() {
        const isMore = !this.state.isMore
        this.setState({
            isMore
        })
    }
    render() {
        const { flagList = [],  cardDate, cardStatus, isOther, fetchFlagHelpAdd,studentInfo } = this.props
        const { isMore,flagCardList = [], } = this.state;
        const time = (new Date()).getTime()
        return (
            <Fragment>
                {
                    flagCardList && flagCardList.length > 0 &&
                    <div className="fcd-list">
                        <div className={`fcd-content`}>
                            <div className="fcd-title">我的其他学习笔记</div>
                            <div className="fcd-details">
                                {
                                    flagCardList.map((item, index) => {
                                        if ((!isMore && index > 2)||index>9) {
                                            return false
                                        }
                                        return <CardItem
                                            key={index}
                                            {...item}
                                            isHideTime={true}
                                            addClick={this.props.addClick}
                                            logName={`落地页`}
                                            logRegion={`card-detail`}
                                            logPos={(index + 1) || 1}
                                        />
                                    })
                                }
                            </div>
                            {
                                isMore &&!studentInfo&& <div className="fcd-btn on-log on-visible"
                                    data-log-name={'加入大学'}
                                    data-log-region={'join-see-more'}
                                    data-log-pos={1}
                                    onClick={()=>{locationTo(`/wechat/page/join-university`)}}>加入大学，看他所有笔记</div>
                            }
                            <div className="fcd-more">
                                {
                                    flagCardList.length > 3 && <span className=" on-log on-visible"
                                        data-log-name={!isMore ? '查看更多' : '收起'}
                                        data-log-region={!isMore ? 'card-detail-more-put' : 'card-detail-more-cut'}
                                        data-log-pos={1}
                                        onClick={this.toggleMore}>{!isMore ? `查看更多` : `收起`}</span>
                                }

                            </div>


                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}
