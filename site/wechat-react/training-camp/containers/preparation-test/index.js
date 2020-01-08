import React,{ Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Page from 'components/page';
import { autobind } from 'core-decorators';
import { locationTo } from '../../../components/util';

//action
import {
    fetchTestList,
    confirmAnswer,
} from '../../actions/camp';

function mstp(state){
    return {

    }
}

const matp = {
    fetchTestList,
    confirmAnswer,
}

@autobind
class preparationTest extends Component {
    constructor(props){
        super(props);
    }

    state = {
        topicId: this.props.location.query.topicId,
        answerSel: null,
        testList: [],
    }

    componentDidMount(){
        this.getTestList()
        this.setState({
            answerSel: new Map(),
        })
    }

    async getTestList(){
        const result = await this.props.fetchTestList(this.state.topicId)
        if(result.state.code === 0) {
            this.setState({testList: result.data.preparations})
        }
    }

    answerSelect(titleId,optionId){
        this.saveAnswerList(titleId,optionId);
        let testList = this.state.testList;
        testList.map((item) => {
            if(item.id == titleId) {
                item.check = true
                item.options.map((option) => {
                    if(option.id == optionId){
                        option.active = true
                    }else {
                        option.active = false                        
                    }
                })
            }
        })
        this.setState({
            testList: testList
        })
    }

    async confirmTest(){
        let checkAll = true;
        this.state.testList.map((item)=>{
            if(!item.check){
                checkAll = false
            }
        });
        if(!checkAll){
            window.toast('您的测验还未完成')
        }else{
            let answer = this.strMapToObj(this.state.answerSel);
            const result = await this.props.confirmAnswer(answer,this.state.topicId);
            if(result.state.code == 0){
                locationTo('/wechat/page/camp-preparation-test-result?topicId='+this.state.topicId)
            }
        }
    }

    saveAnswerList(titleId,optionId){
        let answerSel = this.state.answerSel;
        answerSel.set(titleId,optionId)
        this.setState({answerSel: answerSel})
    }

    strMapToObj(strMap){
        let obj = {};
        for (let [k,v] of strMap) {
          obj[k] = v;
        }
        return obj;
    }

    render(){
        return (
            <Page title={`课前小测验`} className='preparation-test-container'>
                <div className="test-top-container"></div>
                <div className="test-container">
                    <div className="test-container-title">
                        <div className="b-title">180变美训练营</div>
                        <div className="s-title">第一课时课前测试</div>
                    </div>
                    <ul className="test-content">
                        {
                            this.state.testList.map((item,index)=>{
                                let {id,title,options,sort} = item;
                                return (
                                    <li className="question-container" key={`question-${index}`}>
                                        <div className="title">
                                            <span className="index">{sort}</span>
                                            <p>{title}</p>
                                        </div>
                                        <ul className="answer">
                                            {
                                                options.map((option,index)=>{
                                                    return  (
                                                        <li className={`on-log ${option.active?'active':''}`} 
                                                            data-log-id={option.id}
                                                            data-log-region="answer"
                                                            key={`answer-${index}`}
                                                            onClick={()=>{this.answerSelect(id,option.id)}}
                                                        >
                                                            <span className="index">{index == 0 ? "A" : index == 1 ? "B" : index == 2 ? "C" : "D"}</span>
                                                            <p className="list">{option.content}</p>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="test-result-confirm"
                    onClick={this.confirmTest}>提交</div>
            </Page>
        )
    }
}

export default connect(mstp, matp)(preparationTest);