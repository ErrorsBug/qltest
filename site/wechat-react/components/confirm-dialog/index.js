import React from "react";
import ClipBoard from 'clipboard';

export default class ConfirmDialog extends React.Component {

    constructor (props) {
        super(props);
    }
    componentDidMount () {
        this.initClipBoard();
    }

    initClipBoard = () => {
        let clipboard = new ClipBoard('#pc-href');
        clipboard.on('success', function(e) {
            window.toast('复制成功！');
        });  
        clipboard.on('error', function(e) { 
            window.toast('复制失败！请手动复制');
        });
    }
  render() {
    return (
      <div className="confirm-dialog-vintro-wrap" onClick={this.props.onClose}>
        <div
          className="confirm-dialog-vintro"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div className="header">{this.props.headerText}</div>
          <div className="body">{this.props.children}</div>
          <div className="bottom-panel">
            <div id="pc-href" className="btn confirm" onClick={this.props.onConfirm} data-clipboard-text="http://pc.qlchat.com">
              {this.props.confirmText}
            </div>
            <div className="btn cancel" onClick={this.props.onCancel}>
              {this.props.cancelText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
