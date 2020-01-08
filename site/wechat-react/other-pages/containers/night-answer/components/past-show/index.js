import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ScrollToLoad from 'components/scrollToLoad';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';

@autobind
class PastShow extends Component {

    state = {
    }

    componentDidMount() {
    }
    topicClick(e){
        let tar = e.currentTarget
        if(tar.classList.contains('active')){
            e.preventDefault()
        }else{
            locationTo('/wechat/page/night-answer?topicId='+tar.getAttribute('data-log-id'))
        }
    }
    render() {
        return (
            <div className={classnames('past-show-container',this.props.show?'p-show':'p-hide')}>
                <div className="past-show">
                    <div className="black" onClick={this.props.hideHistory}></div>
                    <div className="content">
                        <h3 className="head">
                            <span>往期节目</span>
                            <div className="close" onClick={this.props.hideHistory}></div>
                        </h3>
                        <ul className="show-container">
                            {
                                this.props.audioList.map((item,index)=>{
                                    return (
                                        <li key={`audioList-${index}`}
                                            className={classnames('on-log',item.id === this.props.topicId? 'active':'')}
                                            onClick={this.topicClick}
                                            data-log-id={item.id} 
                                            data-log-region="topic">
                                                <span className={item.id === this.props.topicId? 'active_icon':'icon_audio_play'}></span>
                                                <div className="title">{item.topic}</div>
                                                <span className="period">第{item.num}期</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default PastShow

