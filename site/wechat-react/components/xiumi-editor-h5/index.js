import React from 'react';

/**
 * 
 * @param {传过来的px} px  23px,  0 0 2px 3px, 20% 0
 * @param {*} dpr 
 */
const multiplePx = (styleValue, dpr) => {
    styleValue = styleValue.replace(/(\d+?)px/g, function(value, number){
        return `${number * dpr}px`;
    });
    return styleValue;
}

function scale(dom, dpr) {
    let { style } = dom;
    switch (dom.tagName.toLowerCase()) {
        case 'img':
            if (style.width && style.height) {
                dom.style.width = multiplePx(style.width, dpr);
                dom.style.height = multiplePx(style.height, dpr);
            }
            break;
        case 'iframe':
            let actualWidth = dom.clientWidth;
            dom.style.width = actualWidth + 'px';
            dom.style.height = dom.height / dom.width * actualWidth + 'px';
            break;
        default:
            ['width', 'height', 'padding', 'fontSize', 'lineHeight', 'margin'].forEach(item => {
                if (style[item] && style[item].indexOf('px') != -1) {
                    dom.style[item] = multiplePx(style[item], dpr);
                    return;
                }
            });
            break;
    }
    Array.prototype.forEach.call(dom.children, c => {
        if(c){
	        scale(c, dpr);
        }
    })
    // for (let c of dom.children) {
    //     console.log(c)
    //     scale(c, dpr);
    // }
}

const replaceImgToPicture = (content) => {
    // const node = DOMParser(content);
    // console.log(node);
    if(!content){
        return;
    }
    try{
	    const $document = new DOMParser().parseFromString(content, "text/html");
	    const $imgs = $document.querySelectorAll('img');
	    $imgs.forEach(img => {
		    const url = new URL(img.src);
		    if(!url.host.includes('img.qlchat.com')){
		        return false;
            }
            const ossProcess = url.searchParams.get('x-oss-process');
		    if(!ossProcess){
			    url.searchParams.set('x-oss-process', 'image/format,webp');
		    }else if(ossProcess.includes('image') && !ossProcess.includes('/format,webp')){
			    url.searchParams.set('x-oss-process', ossProcess + '/format,webp');
		    }
		    // searchParams的set方法会转义
		    url.search = decodeURIComponent(url.search);
		    const picture = document.createElement('picture');
		    picture.innerHTML = `<source type="image/webp" srcset="${url.toString()}" />`;
		    picture.appendChild(img.cloneNode(true));
		    img.parentNode.insertBefore(picture, img);
		    img.remove();
	    });
	    return $document.body.innerHTML;
    }catch(e){
        console.log(e)
        return content
    }
};

export default class XiumiEditorH5 extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            dpr: document.querySelector('html').dataset.dpr,
            visibility: 'hidden',
            content: replaceImgToPicture(this.props.content)
        }
    }

    componentDidMount () {
        scale(this.xiumiEditorH5, this.state.dpr);
        this.setState({
            visibility: 'visible'
        })
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.content != this.props.content) {
            this.setState({
                content: nextProps.content,
                visibility: 'hidden'
            }, () => {
                scale(this.xiumiEditorH5);
                replaceImgToPicture(this.xiumiEditorH5)
                this.setState({
                    visibility: 'visible'
                })
            })    
        }
    }

    render () {
        return (
            <div className="ql-editor-h5-wrap" style={{
                height: this.state.contentHeight
            }}>
                <div className="ql-editor-h5" 
                style={{
                    visibility: this.state.visibility
                }}
                ref={input => this.xiumiEditorH5 = input}
                dangerouslySetInnerHTML={{__html: this.state.content}}>
                    
                </div>
            </div>
        )
    }
}