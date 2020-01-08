import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import { formatMoney, locationTo, imgUrlFormat } from 'components/util';
import CardContent from '../../../../components/card-item-content'
import ToggleContent from '../../../../components/toggle-content'
import Lottie from 'lottie-react-web' 

@autobind
export default class extends PureComponent {
    state = {
        isShowProcess: false 
    }

    componentDidMount = () => {
    };

    render() { 
        const {
            id,
            userId,
            desc,
            resource,
            likedUserNameList,
            addClick,
            isShow,
            clickText } = this.props;
        return (
            <Fragment>
                <div className="fcd-mine-card">
                    <CardContent
                        desc={desc}
                        resource={resource}
                        maxLine={6}
                        logName={`落地页打卡`}
                        logRegion={`card-detail-content`}
                        logPos={1}
                    />
                    <div className="cmc-click-item" style={{zIndex:isShow?10:1}}>
                        {
                            <div className="cmc-animation">
                                <Lottie
                                    options={{
                                        path: 'https://static.qianliaowang.com/frontend/rs/lottie-json/animation.json',
                                        autoplay: false
                                    }}
                                    isPaused={!isShow}
                                />
                                {
                                    isShow && <div className="cmc-a-text"><img src={clickText || 'https://img.qlchat.com/qlLive/business/OCVYND3M-9ZED-7C2R-1563950168916-6NUO2QKZ1WQ2.png'} /></div>
                                }

                            </div>
                        }

                        <div className="cmc-icon on-log on-visible"
                            data-log-name={'落地页大赞'}
                            data-log-region={'card-detail-click-big'}
                            data-log-pos={1} onClick={() => addClick(id)}>
                        </div>
                        <div className="cmc-text">点赞鼓励一下</div>
                    </div>

                    {
                        likedUserNameList && likedUserNameList.length > 0 && <ToggleContent
                            className="fcd-click-list"
                            children={likedUserNameList.join('，')}
                            likedUserNameList={likedUserNameList}
                            logName={`落地页大赞`}
                            logRegion={`card-detail-click-big`}
                            logPos={1}
                        />

                    }
                </div>
            </Fragment>
        )
    }
}
