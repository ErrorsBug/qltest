import React, { Component } from 'react'
import { getWithChildren, studentCourseMap, listChildren, courseTagMap } from '../../actions/home';

const CourseStatusHoc = (params) => (WrappedComponent) => {
    return class extends Component{
        state = {
            booksObj: { 
                lists : []
            },
            newBooksObj: { 
                lists : []
            },
            compulsoryObj: { 
                lists : []
            },
            isNoMore: false
        }
        page = {
            page: params.page || 1,
            size: params.size || 20,
        }
        isLoading = false;
        componentDidMount() {
            this.initData();
        }
        initData = async () => {
            const res = params.isChildren ? await listChildren({ nodeCode: params.nodeCode, ...this.page }) : await getWithChildren({ nodeCode: params.nodeCode, ...this.page });
            const arr = (!!res.menuNode && res.menuNode.children) || res.dataList || []
            const lists = await this.handleData(arr);
            if(lists.length >=0 && lists.length < this.page.size){
                this.setState({
                    isNoMore: true
                })
            } 
            this.page.page += 1;
            if(params.isBooks){
                this.setState({
                    booksObj: {
                        title: res.menuNode && res.menuNode.title || '',
                        decs: res.menuNode && res.menuNode.keyA,
                        lists: [...this.state.booksObj.lists, ...lists],
                    },
                })
            } else if(params.isNewBooks){ 
                this.setState({
                    newBooksObj: {
                        title: res.menuNode && res.menuNode.title || '',
                        decs: res.menuNode && res.menuNode.keyA,
                        lists: [...this.state.newBooksObj.lists, ...lists],
                    },
                })
            } else{
                this.setState({
                    compulsoryObj: {
                        title: res.menuNode && res.menuNode.title || '',
                        decs: res.menuNode && res.menuNode.keyA,
                        lists: [...this.state.compulsoryObj.lists, ...lists],
                    },
                })
            }
        }
        handleData = async (lists) => {
            const ids = lists.map((item) => ( item.topicId || item.channelId ));
            if(!ids.length) return lists;
            const res = await studentCourseMap({ courseIdList: ids })
            // let result = [];
            // if(Object.is(params.nodeCode, 'QL_NZDX_SY_BX')) {
            //     result = await courseTagMap({ courseIdList: ids })
            // }
            const courseObj = res.studentCourseMap || {};
            let isOnce = false;
            const path = this.props.location && this.props.location.pathname || '';
            let isPath = false;
            if(path){
                isPath = localStorage.getItem(path) === 'Y';
            }
            return lists.map((item) => {
                const id = item.topicId || item.channelId;
                item.isJoin = !!courseObj[id] && Object.is(courseObj[id], 'Y');
                if(item.isJoin && !isOnce && !isPath && !!path){
                    item.isOnce = true;
                    isOnce=true;
                    localStorage.setItem(path, 'Y')
                }
                return item;
            })
        }
        loadNext = async (next) => {
            if(this.isLoading || this.state.isNoMore) return false;
            this.isLoading = true;
            await this.initData();
            this.isLoading = false
            next && next();
        }
        componentWillUnmount() {
            this.page = {
                page: params.page || 1,
                size: params.size || 20,
            }
            this.setState({
                isNoMore: false
            })
        }
        render() {
            return <WrappedComponent 
            loadNext={ this.loadNext }
            { ...this.props }
            { ...this.state }/>
        }
    }
}

export default CourseStatusHoc