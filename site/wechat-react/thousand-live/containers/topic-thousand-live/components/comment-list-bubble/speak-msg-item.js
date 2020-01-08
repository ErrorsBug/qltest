import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {imgUrlFormat,formatMoney,dangerHtml,locationTo} from 'components/util';
import Detect from 'components/detect';
import SpeakMsgContainer from './speak-msg-container'
import { autobind } from 'core-decorators';
// import shallowCompare from 'react-addons-shallow-compare';



/**
 *
 * 文本消息
 * @export
 * @class TextItem
 * @extends {Component}
 */
@autobind
export class TextItem extends PureComponent {

    addLink(content){
        var linkReg = /((http|https):\/\/)?(\w|\/|\.|-|:|\%)*(\.(com|cn|html|htm|net|org))+(\w|\/|\.|-|:|\%)*(\?+(\w)*.+(\w|\%)*(&+(\w)*.+(\w|\%)*)?)?/gi;
        var reContent = content,
            hasHttp = "",
            linkArr;
        let __html = reContent.__html;
        if(linkReg.test(__html)){
            linkArr = __html.match(linkReg);
            for(let ia1 in linkArr){
                __html = __html.replace(linkArr[ia1],"@lA"+ia1+"@");
            };
            for(let ia2 in linkArr){
                if(/(http|https|ftp)/.test(linkArr[ia2])){
                    hasHttp="";
                }else{
                    hasHttp="http://";
                };
                __html = __html.replace("@lA"+ia2+"@","<a href='"+hasHttp+linkArr[ia2]+"' >"+linkArr[ia2]+"</a>");
            };
            reContent.__html = __html;
        };
        return reContent;
    };

    textNewLine(content){
        var reContent = content;
        let __html = reContent.__html;
        __html = __html.replace('\n','<br>');

        reContent.__html = __html;

        return reContent;
    }

    textHandle(content){
        let reContent = this.addLink(content);
        reContent = this.textNewLine(reContent);
        return reContent;
    }

    onFeedback(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.onFeedback({
            name: this.props.content,
            id: this.props.id,
            type: 'replyMic',
            userId: this.props.createBy
        },true);
    }

    scrollIntoView(){
		setTimeout(() => {
			this.refs['msg-text'].scrollIntoView(true);//自动滚动到视窗内
		},300)
    }

	getOffsetTop(){
		// console.log(this.refs['speakMsgContainer'].getWrappedInstance())
		return this.refs['speakMsgContainer'].getWrappedInstance().getOffsetTop();
	}

    render() {
        return (
            <SpeakMsgContainer
                ref="speakMsgContainer"
                isRight = {this.props.creatorRole == 'visitor'}
                {...this.props}
            >
                    <div className="msg-text" ref="msg-text">
                        <pre className='div-p' dangerouslySetInnerHTML={this.props.creatorRole != 'visitor'?this.textHandle(this.props.dangerHtml(this.props.content)):this.props.dangerHtml(this.props.content)}></pre>
                    </div>
            </SpeakMsgContainer>
        )
    };
}

