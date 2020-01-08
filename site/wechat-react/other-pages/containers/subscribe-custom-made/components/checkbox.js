import React, { Component } from 'react';
import CheckboxItem from './checkbox-item';

class Checkbox extends Component {
    state = {
        
    }
    componentWillMount() {
    }
    selectCheckLabel(id,bigindex,smindex,bigOrsm){
        this.props.onCheckFunc(id,bigindex,smindex,bigOrsm);
    }

    render() {
        var labelDom = [];
        if (this.props.bigLabels) {
            let bigLabels = this.props.bigLabels;
            this.props.bigLabels.map((label, index) => {
                labelDom.push(
                   <CheckboxItem 
                       key={`all-label-${index}`}
                       index={index}
                       label={label}
                       selectCheckLabel={this.selectCheckLabel.bind(this)}
                   />
               );
            });
        }
       
        return (
            <ul className="label-list">
                {labelDom}
            </ul>
            
        );
    }
}

export default Checkbox;