import React, { Component, PureComponent } from "react";
import styles from './style.scss';
import classnames from "classnames";

interface DropDownProps {
    className?: string;
    onSelect: (params: any) => void;
    itemList: Array<any>;
    children?: Component;
    currentItemIdx?: number;
}

type DropDownState = {
    showItemList: boolean;
}

export class DropDown extends PureComponent<DropDownProps, DropDownState> {
    constructor(props) {
        super(props);
    }

    state = {
        showItemList: false
    }

    static defaultProps = {
        itemList: [],
        children: null,
        className: '',
        onSelect: () => {},
        currentItemIdx: 0
    }

    selectItem = (item) => {
        return () => {
            this.props.onSelect(item)
            this.hideItemList();
        }
    };
    
    showItemList = () => {
        this.setState({
            showItemList: true
        })
    }

    hideItemList = () => {
        this.setState({
            showItemList: false
        })
    }

    render () {
        let {currentItemIdx, itemList} = this.props;
        return (
            <div className={styles.dropDownWrap} onMouseOver={this.showItemList} onMouseLeave={this.hideItemList}>

                <div className={styles.content}>排序： <span>{itemList[currentItemIdx].value}</span> <span className={styles.triangle}></span></div>
                <div className={styles.dropDownOuter}>
                    <ul className={styles.dropDown}>
                        {
                            this.state.showItemList &&
                            itemList.map((item, idx) => {
                                return <li key={idx} className={classnames(styles.dropDownItem, itemList[currentItemIdx] == item ? styles.selected : '')} onClick={this.selectItem(item)}>{item.value}</li>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
