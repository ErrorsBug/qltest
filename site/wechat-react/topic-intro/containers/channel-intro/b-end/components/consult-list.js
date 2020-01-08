import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat, timeBefore } from 'components/util';

const Item = (props) => {
    return <section>
        <aside>
            <img src={`${imgUrlFormat(props.headImgUrl,'?x-oss-process=image/resize,w_100,h_100,limit_1')}`} alt="" />
        </aside>
        <main className='consult-content'>
            <article>
                <div className="name-container">
                    <h2>{props.name}</h2>
                    <span className='time'>{timeBefore(props.replyTime, props.sysTime)}</span>
                </div>
                <p>{props.content}</p>
                <span
                    className={props.isLike === 'Y' ? 'like ed' : 'like'}
                    onClick={() => { props.onConsultPraiseClick(props.id, props.isLike) }}
                >
                    {props.praise}
                </span>
            </article>
            {
                props.isReply === 'Y' &&
                <blockquote>
                    <div className="reply-container">
                        <h2>直播间回复</h2>
                        <span>{timeBefore(props.replyTime, props.sysTime)}</span>
                    </div>
                    <p>{props.replyContent}</p>
                </blockquote>
            }
        </main>
    </section>
}

class ConsultList extends PureComponent {
    render () {
        return (
            <div>
                <div className='consult-list'>
                    <h1>
                        <div>留言 <var className='num'>{this.props.consultList.length}</var></div>
                    </h1>
                    {
                        this.props.consultList.map((val, index) => {
                            if(index < 1){
                                return <Item {...val} key={`consult-list-${index}`} sysTime={this.props.sysTime} onConsultPraiseClick={this.props.onConsultPraiseClick} />
                            }
                        })
                    }
                </div>
                {
                    this.props.consultList.length > 1 &&
                    <div className="check-more" onClick={this.props.onShowConsultPop}>查看更多留言</div>
                }
            </div>
        );
    }
}

ConsultList.propTypes = {
    consultList: PropTypes.array.isRequired,
    onConsultPraiseClick: PropTypes.func.isRequired,
};

export default ConsultList;
