import React, { Component } from 'react';
import { digitFormat, formatDate } from 'components/util';
import Picture from 'ql-react-picture';

class Exclusive extends Component {

    constructor(props){
        super(props)
    }

    state = {
        info: this.props.info,
        isPlay: false,
        loading: true,
        idx: -1,
    };

    componentWillReceiveProps(nextProps){
        if(Object.is(nextProps.playStatus, 'playing')){
            this.setState({
              loading: true,
              idx: -1,
            })
        }
    }

	moreBtnTapHandle(data){
        const { bsId,  playStatus } = this.props;
        if(data.businessId == bsId && Object.is(playStatus,'playing')){
            this.props.auditionPause();
        } else {
            this.setState({
                loading: false,
                idx: data.idx
            }, () => {
                this.props.playing(data.businessType,data.businessId);
            })
            
        }
    };

	detailsPanelTapHandle(i){
		const info = {...this.state.info};
		info.courses[i].showDetails = false;
		this.setState({info});
	}

    render() {
        const info = this.state.info;
        const { type, bsId,  playStatus } = this.props;
        return (
            <div className="recommend-exclusive on-visible"
                 data-log-region={info.code}
                 data-log-name={info.name}
            >
                <div className="block-header">
                    <span className="title">{info.name}</span>
                </div>
                <div className="list-wrap">
                    {
                        info.courses.map((c, i) => (
                            <div className="list-item" key={i}>
	                            <div className="poster">
                                    <div className="c-abs-pic-wrap on-log"
                                         data-log-id={c.businessId}
                                         data-log-type={c.businessType}
                                         data-log-region={info.code}
                                         data-log-pos={i}
                                    >
			                            <Picture src={c.indexLogo}
				                                 placeholder={true}
				                                 resize={{
					                                 w: 330,
					                                 h:206
				                                 }}
				                                 onClick={_=> this.props.courseItemTapHandle(c,{
		                                             name: info.code,
		                                             pos: i
		                                         })}
			                            />
                                    </div>
	                            </div>
                                <div 
                                    className="info on-log"
                                    onClick={_=> this.props.courseItemTapHandle(c,{
                                        name: info.code,
                                        pos: i
                                    })}
                                    data-log-id={c.businessId}
                                    data-log-type={c.businessType}
                                    data-log-region={info.code}
                                    data-log-pos={i}>
                                    <div className="name">{c.businessName}</div>
                                    <div className="tips">
                                        {
	                                        c.flag ?
                                                <div className="tag">{c.flag.substring(0, 6)}</div>
                                                :
                                                <div className="category">{c.liveTagName}{c.courseTagName ? '·' + c.courseTagName : c.courseTagName}</div>
                                        }
                                        <div className={ `play-btn ${ (this.state.idx == i && !this.state.loading) ? 'loading' : '' } ${ (c.businessId == bsId && type == c.businessType && Object.is(playStatus,'playing') && this.state.loading) ? 'played' : ''  }` } 
                                            onClick={_=> { _.stopPropagation();this.moreBtnTapHandle({
                                                ...c,
                                                idx: i
                                            }) }}>
                                            <div>
                                                <span className="line1"></span>
                                                <span className="line2"></span>
                                                <span className="line3"></span>
                                            </div>
                                            { !this.state.loading && this.state.idx == i && <i></i> }
                                            {  (this.state.loading && this.state.idx !== i) ?
                                                !!bsId && c.businessId == bsId && Object.is(playStatus,'playing') ? <p className="pause">暂停</p> : '试听' : (!this.state.loading && this.state.idx == i) ? '' : "试听" }
                                        </div>
                                    </div>
                                </div>
                                <div className={`details ${c.showDetails ? 'show' : ''}`} onClick={_=> this.detailsPanelTapHandle(i)}>
                                    <div className="details-name">{c.liveName}</div>
                                    <div className="details-category">{c.businessType === 'channel' ? '共' + (c.planCount || c.topicCount) + '节' : (c.style === 'video' || c.style === 'videoGraphic' ? '视频课' : '音频课')}·{c.chargeType === 'flexible' ? '支持回听' : '支持回听'}</div>
                                    <div className="tip-container">
                                        <div className="tip">{c.startTimeParsed}</div>
                                        {/*<div className="tip-icon"></div>*/}
                                    </div>
                                </div>
                            </div>
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

export default Exclusive;
