import React, { Component } from 'react';
import { digitFormat } from 'components/util';
import NewCourseItem from 'components/common-course-item/new-course';
import Picture from 'ql-react-picture';
import FlagUI from 'components/flag-ui'
const Fragment = React.Fragment;

class Camp extends Component {

    constructor(props){
        super(props)
    }

    state = {
        
    };

    render() {
        const info = this.props.info || {};
        return (
            <div className="recommend-camp on-visible"
                 data-log-region={info.code}
                 data-log-name={info.name}
            >
                <div className="block-header">
                    <span className="title">{info.name}</span>
                    <div className="more-btn on-log"
                         data-log-name={info.name}
                         data-log-region="check-more-btn"
                         onClick={_=> this.props.getMoreBtnTapHandle(info)}>
                        <span>查看更多<i className="check-more-icon"></i></span>
                    </div>
                </div>
                <div className="list-wrap">
                    {
	                    info.courses?.map((c, i) => (
                            <div className="list-item on-log"
                                 key={i}
                                 data-log-id={c.businessId}
                                 data-log-type={c.businessType}
                                 data-log-region={info.code}
                                 data-log-pos={i}
                                 onClick={_=> this.props.courseItemTapHandle(c,{
                                     name: info.code,
                                     pos: i
                                 })}
                            >
                                <div className="cover">
                                    <Picture
                                        src={c.indexLogo}
                                        className="pic-wrap"
                                        placeholder={true}
                                        resize={{
                                            w: 332,
                                            h: 202,
                                        }}
                                    />
                                    {
                                        c.flag && <div className="tip-bar"><div className="text">{c.flag}</div></div>
                                    }
                                </div>
                                <div className="item-info">
                                    <div className="name">{c.businessName}</div>
                                    <div className="tip">{c.remark || c.liveName}</div>
                                    <div className="joined">
                                        <div className="flag-icon"></div>
                                        <div className="user-list">
                                            {
                                                c.userHeadImageList && c.userHeadImageList.map((avatar, i) => {
                                                    if(i < 3){
                                                        return (
                                                            <div className="avatar" key={i}>
                                                                <Picture
                                                                    src={avatar}
                                                                    resize={{
                                                                        w: 32,
                                                                        h: 32,
                                                                    }}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                            {
                                                c.userHeadImageList?.length > 3 && <div className="more-user"></div>
                                            }
                                        </div>
                                        <div className="count">{digitFormat(c.learningNum)}人参加</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Camp;
