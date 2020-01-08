import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
// import { authInfo } from '../../model'
import { loadavg } from 'os';
import Page from 'components/page';
import cookie from 'cookie'

import { getVal, locationTo} from 'components/util';
import { 
    campAuthInfoModel, 
    campBasicInfoModel, 
    campCheckInListModel, 
    campTopicsModel,
    campUserListModel,
    campUserInfoModel,
    campIntroModel,
} from '../../model';

const { fetchAuthInfo } = campAuthInfoModel;
const { fetchCampBasicInfo } = campBasicInfoModel;
const { requestCheckInList } = campCheckInListModel;
const { requestCampTopicList,requestTodayTopicList } = campTopicsModel;
const { requestCampUserList, requestUserHeadList,requestCheckInHeadList,requestCheckInTopNList } = campUserListModel;
const { requestCampUserInfo } = campUserInfoModel;
const { requestCampIntroList } = campIntroModel;

@autobind
export class UserManage extends Component {
    static propTypes = {

    }
    
    constructor(props) {
        super(props)
        
        this.state = {
        
        }
    }

    get campId() {
        return getVal(this.props, 'params.campId');
    }

    componentDidMount = () => {
        const campId = this.campId;
        // console.log(campId)
        // console.log(this.props)
        requestCampUserList({ campId, page: {page:1,size:9999},  searchName:''});
    }
    
    
    loadNext() {

    }
    

    render() {
        const noMore = this.props.hasMoreData === 'N' || this.state.curTabType !== 'check-in-tab';
        // console.log(this.props.userList)
        return (
            <Page title="打卡训练营" className="user-manage-container">
                <ScrollToLoad 
                    className={`user-list-container`}
                    loadNext={this.loadNext}
                    noMore={noMore}
                    emptyPicIndex={3}
                    emptyMessage="暂无课程"
                    noneOne={false}
                    scrollToDo={this.scrollToDo}
                    // disableScroll={true}
                >

            </ScrollToLoad>
            </Page>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        allowMGLive: state.campAuthInfo.allowMGLive,
        hasMoreData: state.campUserList.hasMoreData,
        userList: state.campUserList.userList,
    }
};

export default connect(mapStateToProps)(UserManage);
