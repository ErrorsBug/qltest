const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
//组件
import RepresentListItemNotuse from './represent-list-item-notuse';
import RepresentListItemUsed from './represent-list-item-used';

class AutoRepresent extends Component {
    state = {
        AuthRepresents: [1,2,3]
    }
    componentDidMount() {
    }
    getAuthRepresent () {
        this.setState({
            AuthRepresents: [1,2,3]
        })
        return [1,2,3]
    }
    render() {
        var AuthRepresentsDOM = this.props.AuthRepresents.map(function(val, index) {
            return (
                <RepresentListItemUsed {...val} key={'used'+index} representtype="auto"/>
            );
        })
        return (
            <article className='auth-represent'>
                {/*<header className='header'>
                    <span>分销用户列表(已生成</span>
                    <span id='auto-all-num'>{this.state.AuthRepresents.length}</span>
                    <span>个邀请)</span>
                </header>*/}
                {AuthRepresentsDOM}
            </article>
        );
    }
}


export default AutoRepresent;