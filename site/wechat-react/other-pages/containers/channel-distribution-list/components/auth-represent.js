const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
//组件
import RepresentListItemNotuse from './represent-list-item-notuse';
import RepresentListItemUsed from './represent-list-item-used';


class AuthRepresent extends Component {
    state = {
        showAuthDialog: false, // 显示发送授权对话框
        // notuseItems: [],
        // usedItems: [],
        //updated: false,
        notuseItems: [], // 未使用课代表数组
        usedItems: [],
    }
    componentDidMount() {
        //this.sortAuthClass();
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        // this.sortAuthClass();
        var self = this;
        this.setState({
            notuseItems: [],
            usedItems: []
        });
        let notuseItemsdataItem=[];
        let usedItemsdataItem=[];
        nextProps.AuthRepresents.forEach(function(item, index) {
            if (item.userId) {
                notuseItemsdataItem.push(item);
            } else {
                usedItemsdataItem.push(item);
            }
        });

        self.setState({
            usedItems: notuseItemsdataItem,
            notuseItems: usedItemsdataItem,
        });
        // this.setState({
        //     updated: true
        // });
    }
    componentDidUpdate() {
        //this.sortAuthClass();
    }
    // 将未使用和已使用的课代表分开
    // sortAuthClass() {
    //     var self = this;
    //     console.log(this.props, 'aa');
    //     this.props.AuthRepresents.forEach(function(item, index) {
    //         if (item.userId) {
    //             self.state.usedItems.push(item);
    //         } else {
    //             self.state.notuseItems.push(item);
    //         }
    //     });
    // }

    deleteAuthItem=(index, usestatus)=>{
        if (usestatus == 'notuseItems') {
            let spliceData = this.state.notuseItems;
            this.setState({
                notuseItems: spliceData.filter((d, i) => i !== index)
            });
        } else {
            let spliceData = this.state.usedItems;
             this.setState({
                usedItems:spliceData.filter((d, i) => i !== index)
            });
        }
        this.props.deleteAuthItem(this.state.notuseItems, this.state.usedItems);  
    }

    render() {
        var self = this;
        var notuseDOM = this.state.notuseItems.map(function(val, index) {
            return (
                <RepresentListItemNotuse 
                    {...val}
                    representtype="auth"
                    onAuth={self.props.showIfAuthDialog} 
                    deleteAuthItem={self.deleteAuthItem.bind(self)}
                    key={`auth-li-${index}`}
                    index={index}
                    usestatus="notuseItems"
                    />
            );
        });
        
        var usedDOM = this.state.usedItems.map(function(val, index) {
            return (
                <RepresentListItemUsed 
                    {...val} 
                    representtype="auth"
                    deleteAuthItem={self.deleteAuthItem.bind(self)}
                    key={`authused-li-${index}`}
                    index={index}
                    usestatus="usedItems"
                />
            );
        });

        return (
            <article className='auth-represent'>
                {/*<header className='header'>
                    <span>分销用户列表(已生成</span>
                    <span id='auth-all-num'>{this.props.AuthRepresents.length}</span>
                    <span>个邀请)</span>
                </header>*/}
                <ul className='notuse-lists-box'>
                     {notuseDOM}
                </ul>
                <ul className='used-lists-box'>
                     {usedDOM}
                </ul>
                
            </article>
        );
    }
}


export default AuthRepresent;