import React, { Component } from 'react'
import { getStudentInfo } from '../../actions/home'

const UserHoc = (WrappedComponent) => {
    return class extends Component {
        state = {
            userInfo: {},
            shareParams: {}
        }
        componentDidMount() {
            this.initData();
        }
        async initData(){
            const { studentInfo } = await getStudentInfo();
            const params = {  }
            if(studentInfo && studentInfo.shareType && !Object.is(studentInfo.shareType, 'LEVEL_F')){
                params.userId = studentInfo.userId
            }
            this.setState({
                userInfo: studentInfo || {},
                shareParams: params
            })
        }
        render() {
            return (
                <WrappedComponent { ...this.props } { ...this.state } />
            )
        }
    }
}
export default UserHoc