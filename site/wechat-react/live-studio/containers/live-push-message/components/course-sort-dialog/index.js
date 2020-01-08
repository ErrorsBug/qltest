import React from 'react';
import { autobind } from 'core-decorators'

@autobind
class CourseSortDialog extends React.Component {

    state = {
        show: false,
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.tagObj && !this.update){
            this.update = true
            this.tagObj = nextProps.tagObj
        }
    }

    show(){
        this.setState({show: true})
    }

    hide(){
        this.setState({show: false})
    }

    selectCourseSort(id, name){
        this.tagObj = {id, name}
        this.props.selectCourseSort && this.props.selectCourseSort(id)
    }

    complete(){
        if(!this.tagObj.id){
            window.toast('未选中任何分类')
            return
        }
        this.props.selectTag(this.tagObj)
        this.setState({show: false})
    }

    render() {
        if(!this.state.show){
            return ''
        }
        return (
            <div className = "course-sort-dialog">
                <div className="bg" onClick={this.hide}></div>
                <div className="course-sort-dialog-content">
                    <div className="header">课程分类（单选）</div>
                    <div className="middle">
                        {
                            this.props.tagList.map((itemP, indexP) => (
                                <div className="part" key={`p-${indexP}`}>
                                    <div className="label">{itemP.name}:</div>
                                    <div className="item-group">
                                        {
                                            itemP.childenList.length > 0 && itemP.childenList.map((itemC, indexC)=>(
                                                <span className={`item${itemC.active ? ' active' : ''}`} data-index = {`${indexP}-${indexC}`} onClick={()=>{this.selectCourseSort(itemC.id, itemC.name)}} key={`c-${indexC}`}>{itemC.name}</span>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="footer">
                        <div className="btn" onClick={this.complete}>完成</div>
                    </div>
                </div>
            </div>
        );
    }
}


export default CourseSortDialog;