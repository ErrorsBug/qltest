import React, { Component } from 'react';
import classnames from 'classnames';

class SecondMenu extends Component {
    state = {
        menuList: JSON.parse(JSON.stringify(this.props.list))
    };
	componentWillReceiveProps(props){
		if(this.props.list !== props.list){
			// console.log('props.list');
			// console.log(props.list);
			let menuList = JSON.parse(JSON.stringify(props.list));
			menuList.parentId = props.list.parentId;
			// console.log('menuList');
			// console.log(menuList);
			this.setState({
				menuList
			});
		}
	}
	componentWillMount(){
		if(this.props.activeId){
			let menuList = [...this.state.menuList];
			menuList.forEach((item) => {
				item.activated = item.id === this.props.activeId;
			});
			this.setState({
				menuList
			});
		}
	}
    menuItemHandle(id, isActivated){
		if(isActivated) return false;
	    let menuList = [...this.state.menuList];
	    menuList.forEach((item) => {
		    item.activated = item.id === id;
	    });
	    this.setState({
		    menuList
	    });
	    this.props.onItemClick(id, true);
    }
    render() {

    	const isAll = this.state.menuList.every((item) => {
    		return !item.activated;
	    });

        return (
            <div className={classnames("second-menu", this.props.className)}>
                <div className="menu-wrap">
                    <div className="item-wrap">
	                   <div className={`menu-item${isAll ? ' current' : ''}`} key={`menu-item-all`} onClick={this.menuItemHandle.bind(this, this.props.list.parentId, isAll)}>全部</div>
                    </div>
                    {
		                this.state.menuList.map((item, i) => {
		                	return (
                                <div key={`menu-item-${i}`}
                                    className="item-wrap on-log"
                                    data-log-region="sub-menu"
                                    data-log-pos={i}
                                    data-log-tag_id={item.id}
                                    data-log-tag_name={item.name}
                                    data-log-business_id={item.id}
                                    data-log-name={item.name}
                                    data-log-business_type={'sub-tag'}>
                                        <div className={`menu-item${item.activated ? ' current' : ''}`}  onClick={this.menuItemHandle.bind(this, item.id, item.activated)}>{item.name}</div>
                                </div>
                            )
		                })
	                }
                </div>
            </div>
        );
    }
}

export default SecondMenu;
