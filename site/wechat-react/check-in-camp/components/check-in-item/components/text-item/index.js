import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import { htmlTransferGlobal } from 'components/util';

@autobind
export class TextItem extends Component {
    static propTypes = {
       
    }

    constructor(props) {
        super(props)
        
        this.state = {
            maxHeight: 0,
            needHideText: false,
            showAll: false,
        }
    }

    componentDidMount = () => {
        this.computeHeight()
    }
    

    computeHeight(){
        let needHideText = false;
        const textContentHeight = this.textContent.clientHeight;
        const textAreaHeight = this.textArea.clientHeight;
        if (textContentHeight > textAreaHeight) {
            needHideText = true
        }

        this.setState({needHideText, maxHeight:textContentHeight});
    }
    
    handleBtnClick(){
        this.setState({showAll: !this.state.showAll});
    }

    render() {
        return (
            <div className="text-item-container" >
                <div 
                    className="text-area" 
                    ref={(el) => this.textArea = el} 
                    style={ this.state.showAll ? {maxHeight: `${this.state.maxHeight}px`} : {}}
                >
                    <div className="text-content" ref={(el) => this.textContent = el} >
                        <code>{htmlTransferGlobal(this.props.content)}</code>    
                    </div>
                </div>
                {
                    this.state.needHideText ? 
                    <div className="show-btn" onClick={this.handleBtnClick}>{this.state.showAll ? '收起' : '展开'}</div> :
                    null
                }
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}


export default connect(mapStateToProps, mapDispatchToProps)(TextItem)
