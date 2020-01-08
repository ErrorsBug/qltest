import React, { Component } from 'react';

class CourseList extends Component {

    async changeSort(e){
        var id =e.currentTarget.dataset.id;
        var weight=e.currentTarget.value;
        
        this.props.changeSort(id,weight);
    }
    render() {
        const { sortKey = "weight"} = this.props;
        var itemLi=this.props.items.map((item)=>{
            return (     
                <li key={item.id}>
                    <div className="course-img"><img src={`${item.headImage}`} /></div>
                    <div className="course-title elli">{item.name}</div>
                    <div className="course-Num">
                        <input type="text" value={item[sortKey] || 0} data-id={item.id} onChange={this.changeSort.bind(this)} />
                    </div>
                </li>
            );
        })

        return (
            <ul className="cl-course-list">
                {itemLi}
                
            </ul>
        );
    };
};



export default CourseList;