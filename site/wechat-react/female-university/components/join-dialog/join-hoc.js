import React, { Component } from 'react'
import { locationTo } from 'components/util';
import { addStudentCourse,removeCourseId ,addStudentCourseBatch } from '../../actions/home'; 

const JoinHoc = (WrappedComponent) => {
    return class extends Component{
        state = {
            isShowDialog: false,
            isAnimite: false,
            curId: '',
            type: '',
            joinArr: [],
            delList:[],
            isDelete:false,
            isAddAll:false
        }
        isLoading = false
        componentWillUnmount(){
            this.close();
        }
        close = ()  => {
            this.setState({
                isShowDialog: false
           })
        }
        // 确认加入计划
        joinPlan =  () => {
            const { curId, type } = this.state;
            this.hadnleData(curId, type);
        }
        // 处理加入学习计划
        handleStudyPlan = (id, type, isJoin, isHome) => {
            const { joinArr } = this.state;
            if(joinArr.includes(id) || isJoin){
                locationTo("/wechat/page/university/my-course-list");
                return false
            };
            const joinCourses = localStorage.getItem("joinCourses");
            if((isHome && Object.is(joinCourses, "Y")) || !isHome){
                this.hadnleData(id, type,isHome);
            } else {
                localStorage.setItem("joinCourses", "Y")
                this.setState({
                    isShowDialog: true,
                    curId: id,
                    type: type,
                    isAnimite: false
                })
            }
        }
        hadnleData = async (curId, type, isHome) => { 
            if(this.isLoading) return false
            this.isLoading = true
            const res = await addStudentCourse({
                businessId: curId,
                businessType: type
            });
            if(res && res.state && res.state.code == 0){
                const i= this.state.delList.map((item,index)=>{
                    return item.businessId==curId
                })
                this.state.delList.splice(i,1)
                this.setState({
                    curId: curId,
                    type: type,
                    isAnimite: true,
                    isShowDialog: false,
                    joinArr: [...this.state.joinArr, curId] 
                })
            } else {
                this.setState({
                    isShowDialog: false
                })
                window.toast("加入课表失败")
            }
            this.isLoading = false;
        }
        onAnimationEnd = () => {
            this.setState({
                isAnimite: false,
            })
        }
        //删除
        delStudyPlan= (id, type, idx)=>{  
            window.simpleDialog({
                title: null,
                msg: '确定移除该课程吗?',
                buttons: 'cancel-confirm',
                confirmText: '确认',
                cancelText: '取消',
                className: 'my-study-advice-delete-dialog',
                onConfirm: async () => {
                    try {
                        const { state } = await removeCourseId({
                            businessId: id,
                            businessType: type,
                        });
                        if(state && state.code == 0){ 
                            const { joinArr } = this.state;
                            const i=joinArr.findIndex((item,index)=>{
                                return item==id
                            })
                            joinArr.splice(i,1)
                            this.state.delList.push({
                                businessId: id,
                                businessType: type
                            }) 
                            this.setState({  
                                joinArr, 
                            })
                            window.toast("删除成功");
                             
                        } else {
                            window.toast("删除失败");
                        } 
                    } catch (error) {
                        
                    }
                },
                onCancel: ()=>{
                     
                },
            }) 
        }
        
        //批量添加
        addAll = async () => {  
            const {delList} = this.state
            const res=await addStudentCourseBatch({
                courseList:delList
            })
            if(res.state.code==0){  
                delList.map((item,index)=>{
                    this.state.joinArr.push(item.businessId) 
                }) 
                this.setState({
                    delList:[], 
                    isAddAll:true
                })
            }
        }
        render() {
            return <WrappedComponent 
            joinPlan={ this.joinPlan }
            handleStudyPlan={ this.handleStudyPlan }
            delStudyPlan={ this.delStudyPlan }
            addAll={this.addAll}
            onAnimationEnd={ this.onAnimationEnd }
            close={ this.close }
            { ...this.props }
            { ...this.state }/>
        }
    }
}

export default JoinHoc