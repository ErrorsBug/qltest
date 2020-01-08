import React, { Component } from 'react'
import classnames from 'classnames'
import { autobind } from 'core-decorators'
import JobListDialog from '../dialogs-colorful/job-list-dialog'
import { topicJodLists } from '../../actions/common'
import { locationTo } from 'components/util';


@autobind
export default class extends Component {
  state = {
    isShow: true,
    showJobListDialog: false,
    homeworkList: []
  }
  async componentDidMount(){
    const { targetNode } = this.props;
    this.init(targetNode);
    const params = {
      channelId: this.props.channelId,
      topicId: this.props.topicId
    }
    const { data } = await topicJodLists(params);
    const topic = data.dataList && data.dataList.length > 0 && data.dataList.find(topic => topic.id === this.props.topicId)
    let homeworkList = []

    if (topic) {
      homeworkList = topic.homeworkList || []
    }
    this.setState({
      homeworkList,
    })
    
    
  }
  componentWillReceiveProps({ targetNode }){
    this.init(targetNode);
  }
  // 监听滚动条事件
  init(targetNode){
    const appNode = document.getElementById("app");
    const curNode = targetNode || appNode;
    curNode.addEventListener('scroll', this.debounce((e) => {
      this.changeState(true);
    },400))
  }
  // 改变去做作业按钮的样式
  changeState(flag){
    this.setState({
      isShow: flag
    })
  }
  // 防抖
  debounce(fn, delay){
    var timer;
    const that = this;
    return function (){
      const { isShow } = that.state;
      if(isShow){
        that.setState({
          isShow: false
        })
      }
      var context = this
      var args = arguments
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
  // 点击事件
  showState(status){
    const { homeworkList=[] } = this.state;
    if(Object.is(status,"single")){
      locationTo(`/wechat/page/homework/details?id=${ homeworkList[0].id }`);
    } else if(Object.is(status,"more")) {
      this.setState({
        showJobListDialog: true,
      })
      this.props.showDislog &&this.props.showDislog();
    }
  }
  // 隐藏更多学习按钮
  closeJobListDialog(){
    this.setState({
      showJobListDialog: false,
    })
  }
  render() {
    const { className } = this.props;
    const { isShow, showJobListDialog, homeworkList = [] } = this.state;
    const finishLists = homeworkList.filter((item) => Object.is(item.finishStatus,'Y'));
    const cls = classnames("job-reminder-box",className, {
      "no-show": !isShow
    })
    const showCamp = () => {
      const len = homeworkList.length;
      const finishLen = finishLists.length;
      if(!!len){
        if(len === 1){
          return <div className={ cls } onClick={ () => this.showState("single") }><span>{ !!finishLen ? '查看作业' : '去做作业' }</span></div>
        } else if(len !== 1){
          return <div className={ cls } onClick={ () => this.showState("more") }><span>{ finishLen === len ? '查看作业' : `去做作业${ finishLen }/${ len }` }</span></div>
        }
      }
      return null;
    }
    return (
      [
        showCamp(),
        this.props.showDislog ? null : <JobListDialog 
        isShow={showJobListDialog}
        onClose={this.closeJobListDialog}
        data={homeworkList} />
      ]
    );
  }
}