import React, { Component } from 'react';
import NewCourseItem from 'components/common-course-item/new-course';
import Picture from 'ql-react-picture';
import ScoreStar from 'components/score-star';
import { digitFormat } from 'components/util';
import { autobind } from 'core-decorators';

@autobind
class Rank extends Component {

    constructor(props) {
        super(props)
    }

    state = {
    };

    // 播放
    onPlaying(e) {
        e.preventDefault();
        e.stopPropagation();
        const { bsId, idx, playStatus, selctId } = this.props;
        const data = this.props.info.courses[0]
        if (data.businessId == bsId && Object.is(playStatus, 'playing')) {
            this.props.auditionPause();
        } else {
            this.props.playing && this.props.playing(data.businessType, data.businessId, 0);
        }
    }

    render() {
        const info = this.props.info;
        const { playing: onPlay } = this.props;
        return (
            <div className="recommend-rank on-visible"
                data-log-region={info.code}
                data-log-name={info.name}
            >
                <div className="block-header">
                    <span className="title">{info.name}</span>
                </div>
                <div className="list-wrap">
                    {
                        info.courses.map((c, i) => (
                            i < 3 ?
                            <React.Fragment key={i}>
                                { i !== 0 && <div className={`rank-pic-title _rank${i + 1}`}></div> }
                                <NewCourseItem
                                    className="on-log"
                                    key={i}
                                    data={c}
                                    onClick={_ => this.props.courseItemTapHandle(c, {
                                        name: info.code,
                                        pos: i
                                    })}
                                    playing={!!onPlay && onPlay}
                                    isFlag={true}
                                    bsId={this.props.bsId}
                                    type={this.props.type}
                                    auditionPause={this.props.auditionPause}
                                    playStatus={this.props.playStatus}
                                    idx={i}
                                    selctId={this.props.selctId}
                                    data-log-id={c.businessId}
                                    data-log-type={c.businessType}
                                    data-log-region={info.code}
                                    data-log-pos={i}
                                />
                            </React.Fragment> : null
                        ))
                    }
                </div>
                <div className="check-more-btn on-log"
                    data-log-name={info.name}
                    data-log-region="check-more-btn-bottom"
                    onClick={_ => this.props.getMoreBtnTapHandle(info)}>
                    <span>查看更多<i className="icon_enter"></i></span>
                </div>
            </div>
        )
    }
}

export default Rank;
