import React, { Component } from 'react';
import PropTypes from 'prop-types';

class IntroList extends Component {

    constructor(props){
        super(props)
    }
    componentWillReceiveProps(nextProps) {
    }


    introItemChange(e,id){

        this.props.introItemChange(id,"content",e.target.value.replace(/(\u0085)|(\u2028)|(\u2029)/g, ""));
    }

    render() {
        // let listItem =

        return (
            <dl className="profiles-list">
                {
                    this.props.introList.map((introItem,index)=>(
                        <dd className="profiles-item" key={`intro-item-${index}`}>
                            {
                                (introItem.type == "text")?
                                <div className="item-main">
                                    <textarea placeholder="请输入文字" name="" id="" cols="30" rows="10" onChange ={(e)=>{ this.introItemChange(e,index)}} value={introItem.content} ></textarea>
                                </div>
                                :
                                (introItem.type == "image")?
                                <div className="item-main">
                                    <img src={`${introItem.content}@750w_1l_2o`} alt=""/>
                                </div>
                                :""
                            }
                            <div className="control-bar flex-other flex-body">
                                <span className="del icon_cross flex-other" onClick ={()=>{ this.props.introItemDel(index)}} ></span>
                                <span className="up icon_up" onClick ={()=>{ this.props.introItemUp(index)}} ></span>
                                <span className="down icon_down" onClick ={()=>{ this.props.introItemDown(index)}} ></span>
                            </div>
                        </dd>
                    ))
                }
            </dl>
        );
    }
}

IntroList.propTypes = {

};

export default IntroList;
