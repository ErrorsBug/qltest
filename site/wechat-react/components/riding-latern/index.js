import * as React from 'react';

function getNumberFromPx (px) {
    return Number(px.split('px')[0]);
}

export default class RidingLantern extends React.Component {

    ridingEle = undefined;
    componentDidMount () {
        var { ridingEle } = this;
        var { content } = this;
        var ridingEleWidth = getNumberFromPx(getComputedStyle(ridingEle).width);
        var contentWidth = getNumberFromPx(getComputedStyle(content).width);
        var contentWrapWidth = getNumberFromPx(getComputedStyle(this.contentWrap).width);
        var contentLeft = 0;
        function wordScroll() {
            
            contentLeft = (contentLeft - 1);

            if (contentLeft < -contentWidth) {
                contentLeft = ridingEleWidth;
            }

            content.style.transform = `translate3D(${contentLeft}px,0,0)`,
            content.style.webkitTransform = `translate3D(${contentLeft}px,0,0)`;
        };
        
        if (ridingEle && contentWidth > contentWrapWidth) {
            setInterval(wordScroll, 20)
        }

    }
    render () {
        let { content, link} = this.props;
        return (
            <div className="riding-latern" onClick={() => {
                location.href = link;
            }}>
                <div className="riding-latern-wrap" ref={(ridingEle) => {
                    this.ridingEle = ridingEle;
                }}>
                    <div className="img-wrap"></div>
                    <div className="content-wrap" ref={contentWrap => {
                        this.contentWrap = contentWrap;
                    }}>
                        <div className="content" ref={(content => {
                            this.content = content;
                        })}>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static defaultProps = {
        icon: '',
        content: '',
        link: ''
    }
}