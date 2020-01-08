import React from 'react';

import { timeBefore } from 'components/util';

const ConsultItem = props => {
    return (
        <section className='consult-item-v2'>
            <div className="left-portrait">
                <img src={`${props.headImgUrl}@132h_132w_1e_1c_2o`} alt=""/>
            </div>
            <main className='right-content'>
                <section className="name-row">
                    <div className="left">
                        <span className='nick-name'>{ props.name }</span>
                        <span className="time-before">{ timeBefore(props.consultTime) }</span>
                    </div>    
                    <div className="right">
                        <span className={`btn-like on-log ${props.isLike == 'Y' && 'on'}`} 
                            data-log-name={props.isLike === 'Y' ? '取消喜欢' : '喜欢'}
                            data-log-region={props.isLike === 'Y' ? 'cancel-like' : 'like'}
                            data-log-pos="consult-list"
                            onClick={()=>{props.consultPraise(props.id)}} >{props.praise}</span>
                    </div>
                </section>

                <section className="content">
                    { props.content }
                </section>

                {
                    props.isReply === 'Y' &&
                        <section className="replay-container">
                            <section className="replay-info">
                                <span className='replay-label'>直播间回复</span>
                                <span className='time-before'>{ timeBefore(props.replyTime) }</span>
                            </section>

                            <section className="replay-content">
                                { props.replyContent }
                            </section>
                        </section>
                }
            </main>
        </section>
    );
};

ConsultItem.defaultProps = {
    
};

export default ConsultItem;
