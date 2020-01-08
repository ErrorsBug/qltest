import React, { useState, useCallback, useEffect, useMemo } from 'react'
import IdeaItem from '../../../../components/idea-item/idea-item-userinfo'
import EditIdea from '../../../../components/edit-idea'
import EditAims from '../../../../components/edit-aims'
import { locationTo } from 'components/util';
import { deleteCheckIn } from '../../../../actions/camp'
import EmptyPage from 'components/empty-page'
import PresentsList from '../../../../components/show-presents-list'
import { getCheckStatus } from '../../com'

/**
 * 打卡状态
 * @returns
 */
function CardStatus(props) {
    const { onShowCard, showAims, showAimsRule, isTarget, checkStatus, guide, isCheckIn, generatePoster,
        jumpUrl, noteCount, title, periodId, progress, targetTxt, aimsTotal, campId, action } = props;
    const renderCheck = () => {
        if (isCheckIn) {
            if (Object.is(isCheckIn, 'Y')) {
                return (
                    <div className="cf-calendar-info cf-calendar-today">
                        <div className="cf-today-data">
                            <div className="cf-data-item">
                                <p>{noteCount}篇</p>
                                <span>学习笔记</span>
                            </div>
                            <div className="cf-data-item">
                                <p>{(Number(progress || 0) * 100).toFixed(1)}%</p>
                                <span>蜕变进度</span>
                            </div>
                            <div className="cf-data-item">
                                <p>{ (Number(action || 0) * 100).toFixed(1) }%</p>
                                <span>行动力超过</span>
                            </div>
                            <div className="cf-data-item last">
                                <div className="cf-data-btn" onClick={generatePoster}></div>
                            </div>
                        </div>
                        <div className="cf-view-box" onClick={() => locationTo('/wechat/page/university-ebook')}>查看我的笔记本<i className="iconfont iconxiaojiantou-copy"></i></div>
                    </div>
                )
            } else {
                return (
                    <div className="cf-calendar-info">
                        <div className="cf-calendar-decs" >
                            <p onClick={() => locationTo(jumpUrl)}>{guide}</p>
                             <span className="icon-book" onClick={() => locationTo('/wechat/page/university-ebook')}>{ !!noteCount ? `已写${noteCount}篇笔记，查看我的笔记本` : '查看我的笔记本'  }<i className="iconfont iconxiaojiantou-copy"></i></span>
                        </div>
                        <div className="cf-calendar-btn">
                            <div onClick={() => onShowCard('check')}></div>
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <div className="cf-calendar-info cf-calendar-over" onClick={() => locationTo('/wechat/page/university-ebook')}>
                    <p>今天没有打卡任务，请继续坚持学习哦~</p>
                    <span className="icon-book">{ !!noteCount ? `已写${noteCount}篇笔记，查看我的笔记本` : '查看我的笔记本'  }<i className="iconfont iconxiaojiantou-copy"></i></span>
                </div>
            )
        }
    }
    const pageRender = () => {
        if (Object.is(checkStatus, 'unstart')) { // 打卡还未开始
            if (isTarget) {
                // 蜕变笔记
                return (
                    <div className="cf-check-notes">
                        <div className="cf-notes-info" onClick={() => locationTo('/wechat/page/university-ebook')}>
                            <h4>我的蜕变笔记本<i className="iconfont iconjiantou"></i></h4>
                            <p>小目标：{targetTxt}</p>
                        </div>
                    </div>
                )
            } else {
                // 立小目标
                return (
                    <div className="cf-check-flag">
                        <div className="cf-check-bg">
                            <div className="icon">
                                <img src={require('../../img/icon-01.png')} />
                                <p>1.立个小目标</p>
                            </div>
                            <div className="icon">
                                <img src={require('../../img/icon-02.png')} />
                                <p>2.每日学习打卡</p>
                            </div>
                            <div onClick={showAimsRule}>
                                <div className="cf-check-img">
                                    <img src={require('../../img/icon-07.png')} />
                                </div>
                                <p className="red">3.目标达成拆礼包</p>
                            </div>
                        </div>
                        <div className="cf-check-footer">
                            <div className="cf-check-btn" onClick={showAims}>立个小目标</div>
                            <p>{ !!aimsTotal ? `${aimsTotal}位同学已创建个人小目标 ` : '立个小目标，开始蜕变第一步吧!'}</p>
                        </div>
                    </div>
                )
            }
        } else if (Object.is(checkStatus, 'ing')) {
            return (
                <div className="cf-check-task">
                    <div className="cf-check-calendar">
                        <h4>{Object.is(isCheckIn, 'Y') ? '今日已打卡' : '今日打卡任务'}</h4>
                        <p onClick={() => locationTo(`/wechat/page/university/open-calendar?campId=${campId}&periodId=${periodId}`)}>
                            打卡日历<span className="iconfont iconxiaojiantou-copy"></span>
                        </p>
                    </div>
                    {renderCheck()}
                </div>
            )
        } else {
            return null
        }
    }
    return pageRender();
}

const handleLink = () => {
    locationTo('/wechat/page/university-ebook')
}

/**
 * 论文
 * @returns
 */
const Paper = ({ onShowCard, diplomaIntroduction, total, writeStatus, isSign, topicId }) => {
    const renderPage = useMemo(() => {
        if (isSign) {
            if (Object.is(writeStatus, 'Y')) {
                return (
                    <div className="cf-paper-info">
                        <span onClick={() => locationTo(`/wechat/page/university/community-topic?topicId=${ topicId }`)}>
                            点击查看校友毕业论文<i className="iconfont iconxiaojiantou-copy"></i>
                        </span>
                    </div>
                )
            } else {
                return (
                    <div className="cf-paper-info">
                        <p>{diplomaIntroduction}</p>
                        <span onClick={() => locationTo(`/wechat/page/university/community-topic?topicId=${ topicId }`)}>
                            {!!total ? `${ total }位同学已提交，点击查看` : '点击查看校友毕业论文'}<i className="iconfont iconxiaojiantou-copy"></i>
                        </span>
                    </div>
                )
            }
        } else {
            return (
                <div className="cf-paper-info" onClick={() => locationTo(`/wechat/page/university/community-topic?topicId=${ topicId }`) }>
                    <p>{diplomaIntroduction}</p>
                    <span>点击查看校友毕业论文<i className="iconfont iconxiaojiantou-copy"></i></span>
                </div>
            )
        }
    }, [isSign, writeStatus, topicId, diplomaIntroduction])
    return (
        <div className="cf-paper-box">
            <div className="cf-paper-cont">
                <div className="cf-paper-head">
                    <h4>毕业论文</h4>
                    {isSign && (
                        <>
                            {Object.is(writeStatus, "Y") ? (
                                <div className="cf-paper-over">( <i>您已提交</i> )</div>
                            ) : (
                                    <div className="cf-paper-btn" onClick={() => onShowCard('paper')}></div>
                                )}
                        </>
                    )}
                </div>
                {renderPage}
            </div>
        </div>
    )
}

/**
 * 毕业证书
 * @returns
 */
const Certificate = ({ classmateNum, learnTime, onShowCert }) => {
    return (
        <div className="cf-cert-box">
            <div className="cf-cert-cont">
                <h3>完成学习，毕业啦!</h3>
                <div className="cf-cert-txt">
                    <p>经过<span>{(Number(learnTime) || 0)}分钟</span>的学习，和<span>{classmateNum}位</span>大学同学朝夕相处，恭喜你又挑战了自我，完成一个阶段的蜕变成长~！</p>
                </div>
                <div className="cf-cert-btns">
                    <div onClick={handleLink}>蜕变笔记本</div>
                    <div className="shu" onClick={ onShowCert }>结业证书</div>
                </div>
            </div>
        </div>
    )
}

/**
 * 学习打卡
 * @returns
 */
export default function CheckIn(props) {
    const { sysTime, isTarget, diplomaOpenTime, paperInfo, aimsTotal, getSubjectInfo, onShowCert, isQlchat,
        listCheckIn, checkStartTime, diplomaTopicId, diplomaTopicName, graduationTime, learnInfo, userInfo, isSignUp, signUpType,
        diplomaIntroduction, subjectInfo, periodId, posterInfo, checkList, campId, targetTxt, generatePoster, ruleInfo } = props
    const [isAims, setIsAims] = useState(false)
    const [isIdea, setIsIdea] = useState(false)
    const [editType, setEditType] = useState('')
    const [checkStatus, setCheckStatus] = useState(false)
    const [isAimsRule, setIsAimsRule] = useState(false)
    useEffect(() => {
        // 打卡状态，不针对预报名
        const type = getCheckStatus(sysTime, checkStartTime, graduationTime)
        setCheckStatus(type)
    }, [props])
    // 打卡和写论文
    const onShowCard = useCallback((value) => {
        setEditType(value)
        setIsIdea(true)
    }, [isIdea])
    // 当前一期是否报名
    const isSign = useMemo(() => {
        return !!isSignUp && (signUpType == 'direct' || signUpType == 'reservation')
    }, [periodId])
    // 礼包规则弹窗
    const showAimsRule = useCallback(() => {
        setIsAimsRule(!isAimsRule)
    }, [isAimsRule])
    // 删除打卡
    const deleteIdea = useCallback((id) => {
        window.simpleDialog({
            title: null,
            msg: '确认将此想法删除?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            className: '',
            onConfirm: async () => {  
                const { result } = await deleteCheckIn({ checkInId: id })
                if (Object.is(result, 'Y')) {
                    localStorage.removeItem(`reward${periodId}`)
                    listCheckIn(1)
                    getSubjectInfo();
                } else {
                    window.toast('删除失败')
                }
            },
            onCancel: ()=>{ 
            },
        })  
    }, [])
    return (
        <>
            { isAims && (
                <EditAims 
                    onClose={ () => { setIsAims(false) } } 
                    periodId={ periodId } 
                    userInfo={ userInfo }
                    isQlchat={ isQlchat }
                    campName={ posterInfo.campName }
                    campId={ campId } />
            ) }
            { isIdea && (
                <EditIdea 
                    name={ Object.is(editType, 'check') ? subjectInfo.topicName : diplomaTopicName }
                    id={ Object.is(editType, 'check') ? subjectInfo.topicId : diplomaTopicId}
                    periodId={ periodId }
                    campId={ campId }
                    generatePoster={ generatePoster }
                    handleShowEdit={ () => { setIsIdea(false) } } 
                    editType={ editType || 'check' } />
            ) }
            <div className="cf-check-box">
                { !isSign && <div className="eb-tip-box">报名加入学习营，才可参与有奖的打卡学习活动哦~</div> }
                {isSign && (
                    <>
                        <CardStatus
                            {...subjectInfo}
                            {...posterInfo}
                            checkStatus={checkStatus}
                            isTarget={isTarget}
                            periodId={periodId}
                            targetTxt={targetTxt}
                            showAims={() => setIsAims(true)}
                            showAimsRule={showAimsRule}
                            generatePoster={generatePoster}
                            aimsTotal={aimsTotal}
                            campId={campId}
                            onShowCard={onShowCard} />
                        {Object.is(checkStatus, 'end') && <Certificate onShowCert={ onShowCert } {...learnInfo} />}
                    </>
                )}
                {(!!diplomaOpenTime && sysTime > diplomaOpenTime) && (
                    <Paper
                        onShowCard={onShowCard}
                        isSign={isSign}
                        diplomaIntroduction={diplomaIntroduction}
                        topicId={ diplomaTopicId }
                        {...paperInfo} />
                )}
                {checkList.map((item, index) => (
                    <IdeaItem
                        isShowTopic
                        isRouter
                        {...props}
                        key={index}
                        ideaInfo={item}
                        isShowTopic
                        topicDto={ item.communityTopicRsp }
                        deleteIdea={deleteIdea}
                        {...item}
                    />
                ))}
                {!checkList.length && <EmptyPage emptyMessage="暂无打卡数据" />}
                {isAimsRule && <PresentsList closeFun={showAimsRule} ruleInfo={ruleInfo} />}
            </div>
        </>
    )
}