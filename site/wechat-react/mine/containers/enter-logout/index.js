import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { cancelId } from '../../actions/camp'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import Page from 'components/page';


@HandleAppFunHoc
@autobind
class EnterLogout extends Component {
  state = {
    enterBox:false
  }
  //确认注销和取消按钮
  enterLogoutBtn = (val) => {
    let enterBox = val
    this.setState({
      enterBox
    })
  }
  //调用 & 放弃
  giveUp = () => {
    this.props.handleAppSdkFun('popPage',{})
  }
  //调用 & 确认按钮
  enter = async () => {
    const res = await cancelId()
    if ( res.state.code == 0 ) {
      this.props.handleAppSdkFun('logoutAction',{})
    }
  }
  render() {
    const {enterBox} = this.state
    return (
        <Page title="确认注销" className="enter-logout">
          <div className="enter-logout-box">
            <div className="title">
                <p>确认注销</p>
            </div>
            <div className="enter-logout-content">
                <p>为防止误操作，广州沐思信息科技有限公司及关联公司（以下简称“我们”）深知个人信息对您的重要性，我们将按法律法规和业界成熟的安全标准，采取相应的安全保护措施，</p>
            </div>
            <div className="buttom">
                <div className="enter-logout-bottom">
                    <p onClick={this.enterLogoutBtn.bind(this,true)}>确认注销</p>
                </div>
                <div className="give-up">
                    <p onClick={this.giveUp}>放弃</p>
                </div>
            </div>
            { enterBox &&
                <div className="logout-pop-up" >
                <div className="pop-up">
                  <p className="pop-up-title">注销账号</p>
                  <p className="enter-title">确认注销吗？</p>
                  <button className="cancel" onClick={this.enterLogoutBtn.bind(this,false)}>取消</button>
                  <button className="enter" onClick={this.enter}>确认</button>
                </div>
              </div>
            }
          </div>
        </Page>
    );
  }
}

const mapStateToProps = function(state) {

};

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(EnterLogout);