import React,{ PureComponent, Fragment } from 'react'
import classnames from 'classnames'
import { locationTo } from 'components/util';
import { getCookie } from '../../../../../components/util';

const handleStatusReturn = (flagStatus) => {
    if(Object.is(flagStatus, 'unstart')){
        return '未上榜'
    }
    if(Object.is(flagStatus, 'ing')){
        return '未上榜'
    }
    if(Object.is(flagStatus, 'uncard')){
        return '打卡才能上榜哦'
    }
    if(Object.is(flagStatus, 'noweek')){
        return '未上榜'
    }
}

const RankItem = ({ index, cardNum, likeNum, score, userName, userHeadImgUrl, flagInfo, flagStatus, handleFlagBtn,userId }) => {
    const cls = classnames("rank-info",{
        "rank-info-com": index === 1 || index === 2 || index === 3,
        "one": index === 1,
        "two": index === 2,
        "three": index === 3,
    })
    const picCls = classnames('rank-pic', {
        "one": index === 1,
    })
    const toFlag =() =>{ 
        if(getCookie('userId')==userId){
            locationTo(`/wechat/page/flag-home`)
            return 
        }
        locationTo(`/wechat/page/flag-other?flagUserId=${userId}`)
    }
    return (
        <div className="rank-item  on-log on-visible"
                data-log-name='进入目标页'
                data-log-region={`class-info-to-flag`}
                data-log-pos={index}  onClick={()=>{!flagStatus &&toFlag()}}>
            <div className={ cls } data-ranking={index}>
                <div className={ picCls }><img src={ userHeadImgUrl || flagInfo && flagInfo.userHeadImg } /></div>
                <div className="rank-intro">
                    <p>{ userName || flagInfo && flagInfo.userName }</p>
                    { flagStatus && <span>{ handleStatusReturn(flagStatus) }</span> }
                    { !flagStatus && <span> <span className="cir-num">打卡{ cardNum || 0 }次</span>获得{ likeNum || 0 }个赞</span>}
                </div>
            </div>
            { !flagStatus && <div className="rank-fraction">{ score || 0 }分</div> }
            { Object.is(flagStatus, 'uncard') && !index && 
                <div className="rank-btn on-log on-visible"
                    data-log-name='按钮'
                    data-log-region={
                        Object.is(flagStatus, 'unstart')?
                        `class-info-btn-unstart`
                        : Object.is(flagStatus, 'ing')?
                        `class-info-btn-ing`
                        : Object.is(flagStatus, 'uncard')?
                        `class-info-btn-uncard`
                        :
                        `class-info-btn-noweek`
                    }
                    data-log-pos={index} onClick={ () => (handleFlagBtn && handleFlagBtn(flagStatus,flagInfo?.cardDate)) }>
                { Object.is(flagStatus, 'unstart') && '去定目标' }
                { Object.is(flagStatus, 'ing') && '邀请见证人' }
                { Object.is(flagStatus, 'uncard') && '打卡上榜' }
                { Object.is(flagStatus, 'noweek') && '去分享' }
            </div> }
        </div>
    )
}

// 处理flag状态
const handlefalgStaus = ({ status, helpNum }, { cardTime },mineRankIdx) => {
    if(!status){  // 定目标
        return 'unstart'
    }
    if(Object.is(status, 'join') && helpNum < 3){ // 邀请好友
        return 'ing'
    }
    if(!cardTime&&mineRankIdx == -1){ // 未打卡且未上榜
        if(Object.is(status, 'success') ||Object.is(status, 'pay') || Object.is(status, 'fail')){
            return 'noweek' // 已完成flag活动，但是周榜没有数据
        }
        return 'uncard' // 
    }
    return ''
}

export default class extends PureComponent {
    handleFlagBtn(status,cardDate) {
        if(Object.is(status, 'unstart')){
            locationTo('/wechat/page/university/flag-add')
        }
        if(Object.is(status, 'ing')){
            locationTo('/wechat/page/university/flag-wait')
        }
        if(Object.is(status, 'uncard')){
            const time =(new Date() ).getTime() 
            if(time<cardDate){
                window.toast('明天才正式开始打卡哦')
                return
            }
            locationTo('/wechat/page/university/flag-publish')
        }
        if(Object.is(status, 'noweek')){
            locationTo('/wechat/page/flag-home')
        }
    }
    render() {
        const { ranks, mineRank, flagInfo, mineRankIdx, rankInfo,studentInfo } = this.props;
        const flagStatus = handlefalgStaus(flagInfo, rankInfo,mineRankIdx) 
        return (
            <div className="rank-box">
                <div className="rank-head">
                    { rankInfo.rankOverview && 
                        <Fragment>
                            <span>班级累计{ rankInfo.rankOverview.studentNum||0 }人打卡，打卡次数{ rankInfo.rankOverview.cardNum||0 }次，点赞数{ rankInfo.rankOverview.likeNum||0 }个</span>
                            { mineRankIdx == -1 && Object.is(flagStatus, 'noweek') && (
                                <span>周榜每周日24点整数据清零，重新统计。</span>
                            ) }
                        </Fragment>
                    }
                </div>
                <div className="rank-mine">
                    <RankItem 
                        { ...mineRank } 
                        index={ mineRankIdx > -1 ? (mineRankIdx + 1) : '' } 
                        flagStatus={ flagStatus } 
                        handleFlagBtn={ this.handleFlagBtn }
                        flagInfo={ flagInfo } 
                        userId={flagInfo?.userId}
                        userHeadImgUrl={studentInfo.headImgUrl}
                        userName={studentInfo.userName}
                        />
                </div>
                { !!ranks.length && ranks.map((item, index) => (
                    <RankItem key={ `${ item.type }-${ item.id }` } index={ index + 1 } { ...item }/>
                )) }
                { !ranks.length && <div className="no-more">早行动，早上榜~</div> }
            </div>
        )
    }
}