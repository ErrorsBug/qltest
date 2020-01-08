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
  closeDialog(){
    localStorage.setItem('pc-back-link', 'Y')
    this.props.onClose && this.props.onClose();
  }
  render() {
    return (
      <div className="pc-back-link-container" onClick={this.closeDialog.bind(this)}>
        <div
          className="pc-back-link-main"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div className="box">
            <div className="icon_delete" onClick={this.closeDialog.bind(this)}></div>
            <div className="header">千聊Live管理后台</div>
            <div className="body">
              <div className="tip">课程介绍模板、在线设计头图等更多功能，等你来千聊Live管理后台使用。</div>
              <div className="link">管理后台：
                <span>http://v.qianliao.tv</span>
                <div id="pc-href" className="copy-btn" onClick={this.props.onConfirm} data-clipboard-text="http://v.qianliao.tv">
                复制网址
                </div>
              </div>
              <div className="example-pic"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
