import React, { Component } from 'react';
import { digitFormat } from 'components/util';
import NewCourseItem from 'components/common-course-item/new-course';

const Fragment = React.Fragment;

class Master extends Component {

    constructor(props){
        super(props)
    }

    state = {
        
    };

    render() {
        const info = this.props.info;
        return (
            <div className="recommend-master on-visible"
                 data-log-region={info.code}
                 data-log-name={info.name}
            >
                <div className="block-header">
                    <span className="title">{info.name}</span>
                </div>
                <div className="list-wrap">
                    {
                        info.courses.map((c, i) => (
                            <NewCourseItem
                                className="on-log"
                                key={i}
                                data={c}
                                onClick={_=> this.props.courseItemTapHandle(c,{
                                    name: info.code,
                                    pos: i
                                })}
                                isFlag={ true }
                                playing={ this.props.playing }
                                auditionPause={ this.props.auditionPause }
                                playStatus={ this.props.playStatus }
                                bsId={ this.props.bsId }
                                type={ this.props.type }
                                idx={ i }
                                selctId={ this.props.selctId }
                                data-log-id={c.businessId}
                                data-log-type={c.businessType}
                                data-log-region={info.code}
                                data-log-pos={i}
                            />
                        ))
                    }
                </div>
                <div className="check-more-btn on-log"
                     data-log-name={info.name}
                     data-log-region="check-more-btn-bottom"
                     onClick={_=> this.props.getMoreBtnTapHandle(info)}>
                    <span>查看更多<i className="icon_enter"></i></span>
                </div>
            </div>
        )
    }
}

export default Master;
