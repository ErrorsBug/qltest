import React, { Component } from 'react'
import { cardUserList } from '../actions/family'
import { getUrlParams } from 'components/url-utils';

/**
 * 女大通用配置数据
 * @param {*} WrappedComponent
 * @returns
 */
const InvitationList = (WrappedComponent) => {
    return class extends Component {
        state = {
            userList: {},
        }

        get cardId(){
            return getUrlParams("cardId", "")
        }

        componentDidMount() {
            this.initData();
        }
        initData = async() => {
            const { userRefList } = await cardUserList({ cardId: this.cardId});
            this.setState({
                userList: userRefList || []
            })
        }
        render() {
            return (
                <WrappedComponent { ...this.props } { ...this.state } />
            )
        }
    }
}
export default InvitationList