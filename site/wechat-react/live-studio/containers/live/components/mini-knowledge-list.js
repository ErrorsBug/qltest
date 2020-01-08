import React, { Component } from 'react';
import Picture from 'ql-react-picture';
import { locationTo, digitFormat } from 'components/util';




export default class MiniKnowledgeList extends Component {

    render() {
        const { knowledgeList } = this.props;
        if (!knowledgeList || !knowledgeList.length) return false;
        return (
            <div>
                <div className="new-knowledge">
                    <div className="header flex flex-row flex-vcenter jc-between">
                        <div className="text link" onClick={this.props.onLinkClick}>{this.props.name || "短知识"}</div>
                    </div>
                    <div
                        className="new-knowledge-list-wrap"
                    >
                        <ul>
                            {
                                knowledgeList.map((item, index) => {
                                    return <li className="knowledge-item" key={item.id} onClick={() => this.onClickItem(item)}>
                                        <div className="entity">
                                            <div className="banner-wrap">
                                                <div className="c-abs-pic-wrap"><Picture src={item.coverImage} placeholder={true} resize={{w: 325, h: 183}}/></div>
                                                {
                                                    this.props.showPlayNumStatus === "Y" &&
                                                    <div className="play-num"><i></i><span>{digitFormat((item.playNum||0),10000,['千','w'])}</span></div>
                                                }
                                            </div>
                                            <div className="title">{item.name}</div>
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    onClickItem = item => {
        locationTo(`/wechat/page/short-knowledge/video-show?knowledgeId=${item.id}&liveId=${item.liveId}`);
    }
}
