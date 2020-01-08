import React, { Component } from 'react';
import { digitFormat } from 'components/util';
import Picture from 'ql-react-picture';

class Boutique extends Component {

    constructor(props){
        super(props)
    }

    state = {
	    currentIndex: 0
    };

	changeBtnTapHandle = _=> {
		const currentIndex = this.state.currentIndex < this.props.interestData.courses.length - 1 ? (this.state.currentIndex + 1) : 0;
		this.setState({ currentIndex });
    };

    render() {
        return (
            <div className="recommend-interest on-visible"
                 data-log-region={this.props.interestData.code}
                 data-log-name="兴趣相投"
            >
                <div className="block-header">
                    <span className="title">兴趣相投</span>
                    <span className="change-btn on-log"
                          onClick={this.changeBtnTapHandle}
                          data-log-region="interest-change-btn"
                          data-log-name="换一换">
                        换一换
                    </span>
                </div>
                <div className="list-wrap">
                    {
                        this.props.interestData.courses.map((c, i) => (
                            i === this.state.currentIndex ?
                            <div className="list-item on-log"
                                 key={i}
                                 onClick={_=> this.props.courseItemTapHandle(c)}
                                 data-log-id={c.businessId}
                                 data-log-type={c.businessType}
                                 data-log-region={this.props.interestData.code}
                            >
                                <Picture className="poster"
                                         placeholder={true}
                                         resize={{
	                                         w: 240,
	                                         h: 148
                                         }}
                                         src={c.headImage}/>
                                <div className="info">
                                    <div className="name">{c.name}</div>
                                    <div className="course-count">{c.topicCount}节课</div>
                                    <div className="aud-count">{digitFormat(c.learningNum)}人在学</div>
                                </div>
                            </div>
                            :
                            null
                        ))
                    }
                </div>
                <div className="tips">根据您的浏览《{this.props.interestData.name}》推荐</div>
            </div>
        )
    }
}

export default Boutique;
