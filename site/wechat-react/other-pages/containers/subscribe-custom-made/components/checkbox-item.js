import React,{Component} from 'react';
import classnames from 'classnames';
import {
    imgUrlFormat,
} from 'components/util';
export default class CheckItem extends Component {
    state = {
    }
    data = {
    }
    toggleSmLabel() {
        //处理来自父级组件的方法
        this.props.selectCheckLabel(this.props.label.id,this.props.index,"","big");
    }
    clkBigLabel(e) {
        this.toggleSmLabel();
    }
    chooseSmLabel(e, index, self) {
        e.preventDefault();
        e.stopPropagation();

        //处理来自父级组件的方法
        self.props.selectCheckLabel(this.props.label.smLabels[index].id,this.props.index,index,"sm");
    }
    render() {
        var smLabels = this.props.label.smLabels,
            liDOM = [];
        var actionSmNum=0;
        if (smLabels) {
            smLabels.forEach((label, index) => {
                if(label.action){
                    actionSmNum++;
                }
                
                liDOM.push(
                    <li 
                        key={'smlabels-'+index}
                        ref={`smLabels${index}`}
                        className={classnames("sm-label", {active: label.action}, {show: this.props.label.action})}
                        onClick={(e) => {this.chooseSmLabel(e, index, this)}}
                        >
                        <div className="inner-l">
                            <div>
                                {label.name}
                            </div>
                        </div>

                     </li>
                );
            });
            // 没有选择小标签默认选择第一个
            if(actionSmNum<=0&&this.props.label.action&&this.props.label.smLabels[0]){
                this.props.selectCheckLabel(this.props.label.smLabels[0].id,this.props.index,0,"sm");
            }
        } else {
            liDOM = null;
        }
        
        return (
            <li className="label-container"  ref="labelContainer">
                <section className="big-label-box">
                    <div className="avatar"><img src={imgUrlFormat(this.props.label.logo,"@120w_120h_1e_1c_2o","/132")}/></div>
                    <div className="info">
                        <p className="title">{this.props.label.name}</p>
                        {/*<p className="desc">{this.props.desc}</p>*/}
                    </div>
                    <div className={this.props.label.action? "check active" : "check"}  onClick={this.clkBigLabel.bind(this)}></div>
                </section>
                {smLabels.length > 0 ?
                <ul className={classnames("sm-label-box", {show: this.props.label.action})} ref="smLabelBox">
                    {liDOM}
                </ul>
                :
                null}
            </li>
        );
    }
};