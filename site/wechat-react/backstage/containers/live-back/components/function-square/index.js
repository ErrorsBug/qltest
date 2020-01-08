import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locationTo } from 'components/util';
import Redpoint from "components/redpoint";


class FunctionSquare extends Component {

    state = {
        showAll: false
    }

    componentDidMount(){
    }

    onClickFuncSquare(value){
        if (/LIVE_PROMOTION/.test(value.code)) {
            this.props.toggleDialogShow('showCoursePromotionDialog', true)
        } else if (/LIVE_COUPON/.test(value.code)) {
            this.props.toggleDialogShow('showCourseCouponDialog', true)
        } else if (value.isPc === 'Y'){
            this.props.showPcManageBox();
            if (window._qla) {
                window._qla('click', {
                    region: "pc-function",
                    pos: value.code
                });
            }
        } else {
            locationTo(value.link);
        }
    }

    render() {
        const { squareInfo, commentNum, toGuestShare, isQlchat, pushStatus, hasBottomBorder = false, liveTagId } = this.props;

        const h5List = [], pcList = [];
        
        let showAll = this.state.showAll

        if (squareInfo && squareInfo.list) {
            if (squareInfo.list.length > 0) {
                squareInfo.list.forEach(item => {
                    if (item.isPc === 'Y') pcList.push(item)
                    else h5List.push(item)
                });
            }
            if (squareInfo.list.length <= 4) {
                showAll = null
            }
        }
        
        return (
            <div className={`function-square${hasBottomBorder ? ' border-bottom': ''}`}>
            <div className="function-type">{squareInfo.name}</div>
            <div className={`fucntion-list-container${!showAll ? ' brief' : ''}`}>
            {
                [h5List, pcList].map((list, index) => list.length > 0 ? (
                    <div className={`function-list${index == 1 ? ' pc' : ''}`}>
                        { index == 1 ? <p className="tips-text">电脑端-管理后台特有功能</p> : null }
                        {
                            list.map((value,index)=>{
                                return (
                                <div className="square on-log on-visible" 
                                    key={`square-${index}`}
                                    onClick={()=>{this.onClickFuncSquare(value)}}
                                    data-code = {value.code}
                                    data-log-region = {squareInfo.type}
                                    data-log-pos = {value.code}
                                    data-log-name={value.name}
                                    >
                                    <div className="img">
                                        <img src={value.icon} />
                                        {
                                            value.code === "LIVE_SET" && !liveTagId ? (
                                                <div className="red-spot"></div>
                                            ) : null
                                        }
                                    </div>
                                    <div className="square-name">{value.name}</div>
                                    {
                                        value.isNew === 'Y'?(
                                            value.code == 'college' ?(
                                                isQlchat ?
                                                <Redpoint pointContent='new'
                                                pointStyle={'font-red-point'}
                                                pointWrapStyle="function-red" 
                                                pointNpval={`九宫格-${value.name}`} 
                                                /> : null
                                            ) 
                                            :
                                            <Redpoint pointContent={
                                                value.code == "pinke"?
                                                '快捷开启':
                                                (   value.code == "UNIVERSAL_COUPON"?
                                                    '直播间通用':
                                                    (   value.code == "ONE_TO_ONE"?
                                                        '有问必答':
                                                        (   value.code == 'USER_MGR'?
                                                            '嘉宾分成':
                                                            (   value.code=='jigouban'||(value.code=="SHAREOPEN" && pushStatus=="Y")?
                                                                '':
                                                                (   value.code ==='COURSE_CONSULT'? 
                                                                    (commentNum>0 ? commentNum : ''):
                                                                    'new'
                                                                )
                                                            )
                                                        )
                                                    ) 
                                                )
                                            } 
                                            pointStyle={value.code=='jigouban'||(value.code=="SHAREOPEN" && pushStatus=="Y")?'':'font-red-point'}
                                            pointWrapStyle="function-red" 
                                            pointNpval={`九宫格-${value.name}`} 
                                            isNotLocalstorage={value.code == "pinke"||value.code == "UNIVERSAL_COUPON"||value.code == "ONE_TO_ONE"||value.code == 'USER_MGR'?"Y":'N'} />
                                        )
                                        :
                                        (value.code == 'USER_MGR' && toGuestShare=="Y"?<Redpoint pointContent='嘉宾分成'
                                            pointStyle={'font-red-point'}
                                            pointWrapStyle="function-red" 
                                            pointNpval={`九宫格-${value.name}`} 
                                            isNotLocalstorage="Y" />:
                                            (
                                                value.code=="SHAREOPEN" && pushStatus=="Y"?
                                                <Redpoint pointContent=''
                                                    pointStyle={''}
                                                    pointWrapStyle="function-red" 
                                                    pointNpval={`九宫格-${value.name}`} 
                                                />
                                                :
                                                null
                                            )
                                            
                                        )
                                    }
                                </div>
                                )
                            })
                        }
                    </div>
                ) : null)
            }
            </div>
            {
                showAll !== null ? 
                <div className="flex flex-center">
                    <span 
                        className={`show-all-btn on-log ${showAll ? 'up' : 'down'}`}
                        data-log-region = "show-all-btn"
                        data-log-pos = {squareInfo.type}
                        onClick={() => {
                        this.setState({
                            showAll: !showAll
                        })
                        }}>{showAll ? '收起' : '展开'}</span>
                </div> : null
            }
            </div>
        );
    }
}

FunctionSquare.propTypes = {

};

export default FunctionSquare;