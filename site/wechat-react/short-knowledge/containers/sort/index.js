import React, { Component } from 'react';
import { connect } from 'react-redux';
import { collectVisible } from 'components/collect-visible';
import Page from 'components/page';
import { imgUrlFormat } from 'components/util';
import { getVideoList } from "../../actions/short-knowledge";
import ScrollToLoad from "components/scrollToLoad";

import { request } from 'common_actions/common';

class Sort extends Component {
    state = {
        liveId: this.props.location.query.liveId,
        videoList: [],
        client: 'B',
    }

    data = {
        pageSize:20,
        pageNum:1,
    }

    componentDidMount() {
        this.initData();   
    }

    initData = async() => {
        let result = await this.props.getVideoList(this.state.liveId,this.state.client,this.data.pageSize,this.data.pageNum);
        if(result.state.code === 0){
            const dataList = result.data.list || [];
            if(this.data.pageNum ===1 && dataList && dataList.length<=0){
                this.setState({
                    noOne: true,
                });
            }else if(this.data.pageNum >= 1 && dataList && dataList.length < this.data.pageSize){
                this.setState({
                    noMore: true,
                });
                
            }
            this.setState({
                videoList: [...this.state.videoList,...dataList],
            });
            this.data.pageNum++;
            
        }

    }

    changeInput(e,index){
        let videoList = this.state.videoList;
        let value = e.target.value;
        if(value!='' && /^(0|[1-9][0-9]*)$/.test(value)){
            videoList[index].sort = value;
            this.setState({
                videoList,
            });
        }else{
            toast("请输入正整数");
            videoList[index].sort = '';
            this.setState({
                videoList,
            });
        }
    }

    onKeyPressFunc(e){
        console.log(e)
        let value = e.keyCode;
        // if(value!="" && !/^(0|[1-9][0-9]*)$/.test(value)){
        //     event.preventDefault();
        //     toast("请输入正整数");
        //     return false;
        // }
        // console.log(value);
        // window.toast(value);
    }

    loadNext(next){
        next && next();

    }

    setSortSave(){
        window.loading(true);
        let sortList = [];
        this.state.videoList.forEach((element)=>{
            sortList.push({
                id: element.id,
                sort: element.sort,
            });
        })
        request.post({
            url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/setKnowledgeSort',
            body: {
                liveId: this.props.location.query.liveId,
                sortList,
            }
        }).then(res => {
            window.toast('设置成功');
            history.back();
        }).catch(err => {
            window.toast(err.message);
        }).then(() => {
            window.loading(false);
        })
    }

    onBlur(){
        // 解决iOS系统下收起键盘后页面被截断的问题
        window.scroll(0, 0);
    }
    

    render(){ 

        return (
            <Page title="排序" className="short-knowledge-sort">
                <div className="header">在框内输入数值整数，数值越大排序越靠前，不填时则默认排序，默认排序以最新创建的排前面</div>
                <div className="sort-list">
                    <ScrollToLoad
                        loadNext={this.loadNext}
                        noMore={this.state.noMore}
                        emptyPicIndex={3}
                        emptyMessage="暂无课程"
                        noneOne={this.state.noneOne}
                        >
                        {
                            this.state.videoList.map((item,index)=>{
                                return <div className="item" key={`item-${index}`}> 
                                    <div className="overimg"><img src = {imgUrlFormat(item.coverImage,'?x-oss-process=image/resize,m_fill,limit_0,h_50,w_80')} /></div> 
                                    <div className="name">{item.name}</div>
                                    <div className="input"><input type='tel' value={item.sort} placeholder="输入数值"  onChange = {(e)=>this.changeInput(e,index)}  onBlur = {this.onBlur.bind(this)}/></div>
                                </div>;
                            })
                        }
                    </ScrollToLoad>
                </div>
                <div className="bottom"> <div className="btn-save" onClick={this.setSortSave.bind(this)}>保存</div> </div>
            </Page>
        )
    }
}

export default connect(state => ({
}), {
    getVideoList,
})(Sort)