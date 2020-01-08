import React, { Component, PureComponent } from "react";
import styles from './style.scss';
import classnames from "classnames";

interface sectionHeaderProps {
    className?: string;
    title: string;
    description: string;
    children?: React.ReactNode;
    id?: string;
}

interface sectionHeaderState {

}

export default class SectionHeader extends PureComponent<sectionHeaderProps, sectionHeaderState> {

    constructor (props) {
        super(props);
    }

    anchor = null;

    componentDidMount () {
        // let height = window.innerHeight / 2;
        // this.anchor.style.top = '-' + 130 + 'px';
    }

    render () {
        let { title, description, id } = this.props;
        return (
            <div className={classnames(styles.sectionHeader, this.props.className)}>
                <div ref={(input) => {this.anchor = input}} id={id} className={styles.anchor}></div>
                <div className={styles.inner}>
                    <div className={styles.mainHeader}>{title}</div> <br />
                    <div className={styles.subHeader}>{description}</div>
                </div>
                {this.props.children}
            </div>
        )
    }
}