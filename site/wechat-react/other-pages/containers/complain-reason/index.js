import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { stringify } from 'querystring';
import { getReasonTypes } from '../../actions/complain'
import Page from 'components/page';


class ComplainReason extends Component {


    state = {
          reasonList: {
              data: {
                reasonList: []
              }
         },
         sort:this.props.location.query.sort,
    }

    componentDidMount() {
        this.getReasonText();
    }

    async getReasonText() {
        const list = await this.props.getReasonTypes();
        console.log(list)
        this.setState({
            reasonList: list,
            sort:this.props.location.query.sort,
        });
        console.log();
    }

    gotoDetail(e) {
        let data = {
            type:e.target.dataset.type,
            ...this.props.location.query,
        };

        const queryResult = stringify(data);
        window.location.href = '/wechat/page/complain-details?' + queryResult;
    }
    
    render() {
        const that = this;
        return (
            <Page title="投诉" className='complain'>
                <div className='complain-reason'> 请选择投诉原因 </div>
                <dl className='complain-reason-list'>  
                {this.state.reasonList.data.reasonList.map(
                    
                    (value, index) => {
                        if(!this.state.sort&&value.type!="clearinglate"){
                            return <dd data-type={value.type} onClick={(value) => this.gotoDetail(value)}> {value.text} </dd>
                        }else if(this.state.sort==="guest"&&(value.type=="clearinglate"||value.type=="guestreal"||value.type=="other")){
                            return <dd data-type={value.type} onClick={(value) => this.gotoDetail(value)}> {value.text} </dd>
                        }
                        
                    }

                    )}
                </dl>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
    getReasonTypes,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ComplainReason);
