import React, { PureComponent, Fragment } from 'react'
import { autobind } from 'core-decorators';
import PortalCom from '../../../../components/portal-com';
import { formatDate } from 'components/util'
import ClipBoard from 'clipboard';

const FileInfoItem = ({ title, content }) => {
    return (
    <div className="file-info-item">
        <h4>{ title }</h4>
        { typeof(content) == 'string' ? <p>{ content }</p> : content.map((item, index) => (
            <p key={ index }>{ item }</p> 
        )) }
    </div>
)
}

@autobind
export default class extends PureComponent{
    componentDidMount () {
        this.initClipBoard();
    }
    initClipBoard(){ 
        let clipboard = new ClipBoard('#copy-no');
        clipboard.on('success', function(e) {
            window.toast('复制成功！');
        });  
        clipboard.on('error', function(e) { 
            window.toast('复制失败！请手动复制');
        });
    }
    userCopy(){
        window.toast('复制成功！');
    }
    getFileBox = () => {
        if(this.fileBox){
            const height = this.fileBox.getBoundingClientRect().height
            return height
        }
    }
    render() {
        const { url, handleShowEdit, address, bio, hobby, say, isSelf, expireTime ,studentNo, showNotice, showFileCard, isHide, remark, coolThing } = this.props;
        const area = address && address.split('&')[0] || ''
        return (
            <React.Fragment>
                <section className="scroll-content-container" style={{ opacity: (isHide) ? '0': '1' }}>
                    <div className="pbtom">
                        <div className={ `my-student-card ${ !isSelf ? 'ptm' : '' }` }>
                            <img src={ url } />
                            <p  onCopy={this.userCopy}
                                id="copy-no" 
                                onClick={this.initClipBoard} 
                                data-clipboard-text={studentNo}
                                >{studentNo}</p>
                        </div>
                        { isSelf && (
                            <div className="my-info-box">
                                <p className="my-notice-btn on-visible on-log" 
                                    data-log-name="我的录取通知书"
                                    data-log-region="un-file-notice"
                                    data-log-pos="0"
                                    onClick={ showNotice }><span>我的录取通知书</span></p>
                                <p className="my-file-card on-visible on-log" 
                                    data-log-name="我的录取通知书"
                                    data-log-region="un-file-card"
                                    data-log-pos="0"
                                    onClick={ showFileCard }>
                                        <span>生成个人档案</span>
                                    </p>
                            </div>
                        ) }
                        { (isSelf || (address || bio || hobby || say || coolThing || remark)) && (
                            <div className="my-info-show">
                                { isSelf && (
                                    <div className="my-time">
                                        <div>
                                            <p>大学有效期至：{formatDate(expireTime)}</p>
                                        </div>
                                        <div className="my-file-right on-visible on-log"
                                            data-log-name="编辑档案"
                                            data-log-region="un-file-edit"
                                            data-log-pos="0"
                                            onClick={ (e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleShowEdit()
                                        } }>编辑档案</div>
                                    </div>      
                                ) }
                                {(address || bio || hobby || say || coolThing || remark) && (
                                    <div className={ `my-edit-info ${ isSelf ? "" : "my-edit-no" }` } ref={ r => this.fileBox = r }>
                                        { area && <FileInfoItem title={ '地区' } content={ area.replace(',',"，") } /> }
                                        { bio && <FileInfoItem title={ '职业' } content={ bio.split('\n') } /> }
                                        { hobby && <FileInfoItem title={ '擅长' } content={ hobby.split('\n') } /> }
                                        { coolThing && <FileInfoItem title={ '做过最酷的事' } content={ coolThing.split('\n') } /> }
                                        { say && <FileInfoItem title={ '可以帮助大家的地方' } content={ say.split('\n') } /> }
                                        { remark && <FileInfoItem title={ '其他' } content={ remark.split('\n') } /> }
                                    </div>
                                )}
                            </div>
                        ) }
                        { isSelf && (!address && !bio && !hobby && !say && !coolThing && !remark) && (
                            <Fragment>
                                <div className="my-no-data">
                                    <p>你擅长的事情怎么能不让人知道呢，</p>
                                    <p>快来完善你的档案吧🌹</p>
                                </div>
                            </Fragment>
                        ) }
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

