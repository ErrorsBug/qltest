import React from 'react';
import { locationTo } from 'components/util';
import { createPortal } from 'react-dom';
import {queryMuneNodeMsg} from '../../../../actions/search'

export default class RecommendList extends React.Component {
    state={
        recommendDataList:[],
        requestNodeCode:'QL_SS_H5_UNIVERSITY'//大学：QL_SS_H5_UNIVERSITY。主站：QL_SS_H5_MASTER
    }
    async componentDidMount(){
        if(!this.props.query || !this.props.query.source || !this.props.query.source === 'university'){
            this.setState({
                requestNodeCode:'QL_SS_H5_MASTER'
            },() => {
                this._queryMuneNodeMsg()
            })
        }else{
            this._queryMuneNodeMsg()
        }
    }
    _queryMuneNodeMsg(){
        queryMuneNodeMsg({
            nodeCode:this.state.requestNodeCode,
            page:{
                size:10,
                page:1
            }
        }).then(({dataList}) => {
            console.log(dataList)
            if(Array.isArray(dataList)){
                this.setState({
                    recommendDataList:dataList
                })
            }
        })
    }
    linkTo(targetUrl){
        targetUrl && (locationTo(targetUrl))
    }
    render() {
        const {recommendDataList } = this.state
        // if(recommendDataList.length <= 0){
        //     return ''
        // }
        console.log(recommendDataList, 'recommendDataList')
        return <div className="recommend-list">
            <h2  className="recommend-list-title" title="为你推荐"></h2>
            <div className="recommend-list-content">
                <ul>
                    {recommendDataList.map((item,index) => <li onClick={()=>{this.linkTo(item.keyD)}} className="recommend-item" key={index}>
                        <div className="recommend-item-img">
                            <img src={item.keyA} alt={item.keyB} />
                        </div>
                        <div className="recommend-item-desc">
                            <p className="course-main-title multi-elli">{item.keyB}</p>
                            <p className="course-sub-title elli">{item.keyC}</p>
                        </div>
                    </li>  )}
                </ul>
            </div>
        </div> 
    }
}