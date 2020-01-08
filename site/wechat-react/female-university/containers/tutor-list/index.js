import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import TutorItem from '../../components/tutor-item';
import Footer from '../../components/footer';
import { listChildren, getMenuNode } from '../../actions/home';
import { getUrlParams } from 'components/url-utils';
import { pySort } from 'components/zh';


@autobind
class TutorList extends Component {
    state = {
        isNoMore: false,
        lists: [],
        info: {}
    }
    page = {
        size: 100,
        page: 1
    }
    isLoading = false;
    get code(){
        return getUrlParams('nodeCode', '')
    }
    componentDidMount() {
       this.initData();
       this.initUniData();

       // 绑定非window的滚动层 
       typeof _qla != 'undefined' && _qla.bindVisibleScroll('tl-scroll-box');
    }
    async initUniData() {
        const { menuNode } = await getMenuNode({ nodeCode: this.code })
        this.setState({
            info: menuNode
        })
    }
    async initData() {
        const { dataList = [] } = await listChildren({ nodeCode: this.code, ...this.page });
        if(!!dataList){
            if(dataList.length >= 0 && dataList.length < this.page.size){
                this.setState({
                    isNoMore: true
                })
            } else {
                this.page.page += 1;
            } 
            pySort(dataList || [],'keyA')
            this.setState({
                lists: [...this.state.lists, ...dataList]
            })
        } 
    } 
    
    arrObjSort(arrObj,desc){
        for (var i = 0; i < arrObj.length; i++) {
          for (var j=0;j<arrObj.length;j++){ 
            let first = makePy(arrObj[i]['keyA'])[0].toUpperCase()
            let second = makePy(arrObj[j]['keyA'])[0].toUpperCase() 
            if (i < j &&( desc ? (first < second) : (first > second))){
              var big = arrObj[j];
              arrObj[j] = arrObj[i];
              arrObj[i] = big;
            }
          }
        }
   }
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore) return false;
        this.isLoading = true;
        await initData();
        this.isLoading = false;
        next && next();
    }
    render(){
        const { isNoMore, lists, info } = this.state
        return (
            <Page title={ info.title } className="tutor-list-page">
                <ScrollToLoad
                    className={"tl-scroll-box"}
                    toBottomHeight={300}
                    disable={ isNoMore }
                    loadNext={ this.loadNext }>
                    <div className="sort-info-bar">按姓氏首字母排序，排名不分先后</div>
                    { lists.map((item, index) => (
                        <TutorItem
                            key={ index } 
                            { ...item } 
                            isShowCate
                            resize={{ w: 120, h: 120 }}
                        />
                    )) }
                    { isNoMore && <Footer /> }
                </ScrollToLoad>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    user: ''
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(TutorList);