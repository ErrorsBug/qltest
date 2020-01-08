import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import OneLevelLabel from '../one-level-label';

export default class TwoLevelLabel extends Component {
    static propTypes = {
        // 数组中的元素为{url: '', labelName: '', useLink: bool}
        firstListInfo: PropTypes.array,
        // li节点类名
        firstLiClassName: PropTypes.string,
        // section节点类
        firstSectionClassName: PropTypes.string,
        // ul节点类
        firstUlClassName: PropTypes.string,

        // 数组中的元素为{url: '', labelName: '', useLink: bool}
        secondListInfo: PropTypes.array,
        // li节点类名
        secondLiClassName: PropTypes.string,
        // section节点类
        secondSectionClassName: PropTypes.string,
        // ul节点类
        secondUlClassName: PropTypes.string,
        //
        containerClass: PropTypes.string,
    }
    static defaultProps = {
        firstListInfo: [],
        firstLiClassName: '',
        firstSectionClassName: '',
        firstUlClassName: '',

        secondListInfo: [],
        secondLiClassName: '',
        secondSectionClassName: '',
        secondUlClassName: '',
        containerClass: '',

        displayFirstTag: true,
        displaySecondTag: true,
    }
    state = {

    }
    render() {
        return (
            <article className={classnames("two-level-label", this.props.containerClass)}>
                <OneLevelLabel
                    listInfo = {this.props.firstListInfo}
                    liClassName = {this.props.firstLiClassName}
                    sectionClassName = {this.props.firstSectionClassName}
                    ulClassName = {this.props.firstUlClassName}
                    labelClickFunc = {this.props.firstLabelClickFunc}
                    activeLabelSign = {this.props.nowFirstLabel}
                    region={'menu'}
                />
            </article>
        );
    }
};
