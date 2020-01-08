import React, { Component } from 'react';
import { digitFormat } from 'components/util';
import Picture from 'ql-react-picture';

class Boutique extends Component {

    constructor(props){
        super(props)
    }

    state = {
        
    };

    render() {
        const info = this.props.info;
        return (
            <div className="recommend-boutique on-visible"
                 data-log-region={info.code}
                 data-log-name={info.name}
            >
                <div className="block-header">
                    <span className="title">{info.name}</span> 
                </div>
                <div className="boutique-container">
                    <div className="main-item on-log"
                         onClick={_=> this.props.courseItemTapHandle(info.courses[0], {
                             name: info.code,
                             pos: 0
                         })}
                         data-log-id={info.courses[0].businessId}
                         data-log-type={info.courses[0].businessType}
                         data-log-region={info.code}
                         data-log-pos="0">
                        <div className="content-wrap">
	                        {
		                        info.courses[0].flag && <div className="tag">{info.courses[0].flag.substring(0, 6)}</div>
	                        }
                            <div className="name">{info.courses[0].businessName}</div>
                            <div className="aud-count">{digitFormat(info.courses[0].learningNum)}次学习</div>
                        </div>
                        <div className="bg">
                            <div className="c-abs-pic-wrap">
                                <Picture src={info.courses[0].indexLogo}
                                         placeholder={true}
                                         resize={{
	                                         w: 336,
	                                         h:458
                                         }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="sub-item-wrap">
                        <div className="content-wrap">
	                        {
		                        info.courses.length > 1 && info.courses.map((c, i) => (
			                        i > 0 ?
                                        <div className="sub-item on-log" key={i}
                                             onClick={_=> this.props.courseItemTapHandle(c, {
                                                name: info.code,
                                                pos: i
                                             })}
                                             data-log-id={c.businessId}
                                             data-log-type={c.businessType}
                                             data-log-region={info.code}
                                             data-log-pos={i}
                                        >
					                        {
						                        c.flag && <div className="tag">{c.flag.substring(0, 6)}</div>
					                        }
                                            <div className="name">{c.businessName}</div>
                                            <div className="aud-count">{digitFormat(c.learningNum)}次学习</div>
                                            <div className="bg">
                                                <div className="c-abs-pic-wrap">
                                                    <Picture src={c.indexLogo}
                                                             placeholder={true}
                                                             resize={{
	                                                             w: 336,
	                                                             h: 222
                                                             }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
				                        :
				                        null
		                        ))
	                        }
                        </div>
                    </div>
                </div>
                
                <div className="check-more-btn on-log"
                    data-log-name={info.name}
                    data-log-region="check-more-btn"
                    onClick={_ => this.props.getMoreBtnTapHandle(info)}>
                    <span>查看更多<i className="icon_enter"></i></span>
                </div>
            </div>
        )
    }
}

export default Boutique;
