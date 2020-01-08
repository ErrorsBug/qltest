import React, { Component } from 'react'

export default class extends Component {
    state = {
        scrollTop : 0,
        isScroll: false
    }
    componentDidMount() {
        this.initScroll();
    }
    initScroll(){
        const scrolNode = document.querySelector('.cl-scroll-box');
        scrolNode.addEventListener('scroll',(e) => {
            const { isScroll } = this.state
            const { top } = this.cateBox.getBoundingClientRect();
            if(top > 0){
                this.catePos.classList.remove('scroll')
                this.setState({
                    scrollTop: e.target.scrollTop,
                    isScroll: false
                })
            } else {
                this.catePos.classList.add('scroll')
                if(!isScroll){
                    this.setState({
                        scrollTop:  e.target.scrollTop,
                        isScroll: true
                    })
                }
            }
        })
    }
    render() {
        const { getSelectCateData, curId, tags } = this.props;
        const { scrollTop } = this.state
        const height = this.catePos?.getBoundingClientRect()?.height || 0
        return (
            <div className="cl-cate-box" style={{ height: height + 'px' }} ref={ r => this.cateBox = r }>
                <div className="cl-cate-pos" ref={ r => this.catePos = r }>
                    <div className="cl-cate-cont">
                        { tags.map((item, index) => (
                            <p 
                                key={index} 
                                className={ Object.is(item.id,curId) ? 'action' : '' } 
                                onClick={ () => getSelectCateData(item.id, scrollTop) } 
                                data-name={ item.name }>
                                { item.name }
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}