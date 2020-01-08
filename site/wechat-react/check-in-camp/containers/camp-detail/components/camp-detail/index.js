import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators';
import FixTopBar from '../../../../components/fixed-top-bar';
import ScrollToLoad from '../../../../components/scrollToLoad';
import { campCheckInListModel } from '../../../../model';
import DetailCheckInList from '../detail-check-in-list';
import DetailIntro from '../detail-intro';
import DetailTopicList from '../detail-topic-list';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@autobind
export class CampDetail extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {
            currentTab: 'intro-tab',
            isTypeChanged: false,
        }
    }
    

    componentDidMount = () => {
        this.checkIfChangeType(this.props.campCheckInList);
        // console.log(requestCheckInList)
        // requestCheckInList({});
    }

    componentWillReceiveProps(nextPorps) {
        this.checkIfChangeType(nextPorps.campCheckInList);
    }

    checkIfChangeType(campCheckInList) {
        if (campCheckInList.length > 0 && !this.state.isTypeChanged) {
            this.topbar.clickTab('check-in-tab');
            this.setState({isTypeChanged: true});
        }
    }
    

    onTabChange(type) {
       this.setState({currentTab: type}, () => {
           this.props.onTabChange(type)
       });
    }

    getComponents() {
        switch(this.state.currentTab) {
            case 'intro-tab': return <DetailIntro groupComponent={this.props.groupComponent}/>
            case 'topic-tab': return <DetailTopicList />
            case 'check-in-tab': return <DetailCheckInList />
        }
    }

    loadNext(){

    }

    scrollToDo() {
        
    }

    render() {
        // console.log(this.props.campCheckInList)
        return (
            <div className="camp-detail-container">
                <FixTopBar
                    tabList={[{type:"intro-tab",title:'简介'},{type:"topic-tab", title:'课程'},{type:"check-in-tab", title:'动态'}]}
                    defaultActiveTab="intro-tab"
                    onTabChange={this.onTabChange}
                    scrollContainer="camp-list-container"
                    ref={el => this.topbar = el}
                />
                    {   this.getComponents() }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    campCheckInList: state.campCheckInList.data,
})

export default connect(mapStateToProps)(CampDetail)