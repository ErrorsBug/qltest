import React, { Component } from 'react';
import { digitFormat } from 'components/util';
import NewCourseItem from 'components/common-course-item/new-course';
import Picture from 'ql-react-picture';
import FlagUI from 'components/flag-ui'
const Fragment = React.Fragment;

class Classify extends Component {

    constructor(props){
        super(props)
    }

    state = {
        
    };

    render() {
        const info = this.props.info;
        const { playing:onPlay } = this.props;
        return (
            <div className="recommend-classify on-visible"
                 data-log-region={info.code}
                 data-log-name={info.name}
            >
                <div className="block-header">
                    <span className="title">{info.name}</span>
                </div>
                <div className="ad-list">
                    {
	                    info.courses.map((c, i) => (
	                        i < 1 ?
                            <div 
                                className="img-wrap on-log" 
                                key={i}
                                data-log-id={c.businessId}
                                data-log-type={c.businessType}
                                data-log-region={info.code}
                                data-log-pos={i} 
                                onClick={_=> this.props.courseItemTapHandle(c,{
                                    name: info.code,
                                    pos: i
                                })}>
                                <Picture src={c.wideLogo || c.indexLogo}
                                         className="pic-wrap"
                                         placeholder={true}
                                         resize={{
                                             w: 670,
                                             h: 200
                                         }}
                                />
                            </div>
                            :
                            null
                        ))
                    }
                </div>
                <div className="list-wrap">
                    {
	                    info.courses.map((c, i) => (
                            i > 0 && i < 4 ?
                            <NewCourseItem
                                className="on-log"
                                key={i}
                                data={c}
                                onClick={_=> this.props.courseItemTapHandle(c,{
                                    name: info.code,
                                    pos: i
                                })}
                                playing={ !!onPlay && onPlay }
                                isFlag={ true }
                                bsId={ this.props.bsId }
                                type={ this.props.type }
                                auditionPause={ this.props.auditionPause }
                                playStatus={ this.props.playStatus }
                                idx={ i }
                                selctId={ this.props.selctId }
                                data-log-id={c.businessId}
                                data-log-type={c.businessType}
                                data-log-region={info.code}
                                data-log-pos={i}
                            />
                            :
                            null
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

export default Classify;
