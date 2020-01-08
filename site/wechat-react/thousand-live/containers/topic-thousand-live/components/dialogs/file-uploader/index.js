import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import FileInput from 'components/file-input';
import { autobind, debounce, throttle } from 'core-decorators';
import {extname, basename} from 'path';
import { Confirm } from 'components/dialog';
import { eventLog } from 'components/log-util';
import { validLegal } from 'components/util';
/**
 * 文件上传弹框
 */
@autobind
class FileUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: '',
        }
    }

    /**
     * public
     * 显示弹框
     *
     * @param {any} e
     *
     * @memberOf FileUploader

     */
    show () {
        this.refs.docUploaderDialog.show();
    }

    /**
     * 文件上传弹框选择文件后
     *
     * @param {any} e
     *
     * @memberof ThousandLive
     */
    async onChangeDocFile (e) {
        const money = this.state.price;

        if (money !== null && money !== "" && !isNaN(money)) {
            const file = e.target.files[0];
            this.refs.docUploaderDialog.hide();
            this.props.startUpload();


            try {
                const url = await this.props.uploadDoc(file, 'document', '', {
                    showLoading: false,
                    onProgress: (progress) => {
                        this.props.onProgress(~~(progress * 100));
                    },
                    interruptUpload: () => {
                        return false;
                    },
                    onError: () => {
                        this.props.onProgress(100);
                    },
                    maxSizeSwitch:this.props.isLiveAdmin == 'Y'?true:false,

                });


                // TODO: 接入提交文档的接口
                const extName = extname(file.name).slice(1);
                const name = basename(file.name);

                const saveResult = await this.props.saveFile(url, money, name, extName);

                // 打印文件上传日志
                if (saveResult.state && saveResult.state.code === 0) {
                    eventLog({
                        category: 'file-upload',
                        action: 'success',
                    });
                } else {
                    eventLog({
                        category: 'file-upload',
                        action: 'success',
                    });
                }
                console.log(extName);
            } catch (error) {
                console.error(error);
                this.props.onProgress(1);
            }

        } else {
            window.toast('请输入正确的收费金额!');
        }
    }

    handlePriceOnchange(e) {
        this.setState({
            price: e.target.value
        });
    }

    isValidInput() {
        const price = this.state.price;
        if(price){
            if(Number(price) > 50000 || Number(price) < 0){
                return false;
            }
        }

        if (price !== null && price !== "" && !isNaN(price)) {
            return true;
        }


        return false
    }

    handleBgClick(e) {
        const price = this.state.price;
        validLegal("money", "文件价格", price, 50000, 0);
    }


    render() {
        return (
            <Confirm
                className = 'dialog-fixed'
                ref = 'docUploaderDialog'
                buttons = 'none'
                title = '上传文件'
            >
                <main className='doc-upoloader-container'>
                    <div className='doc-money-row'>
                        <input
                            ref='docMoney'
                            type="text"
                            placeholder='请输入收费金额'
                            value={this.state.price}
                            onChange={this.handlePriceOnchange}
                        />
                        <span>（元）</span>
                    </div>

                    <p className='input-tip'>设置为0则无需付费即可查看此文件</p>
                    <p className='doc-tip'>可支持上传word、excel、ppt、pdf四种类型的文件，最大不能超过{this.props.isLiveAdmin == 'Y'?'60':'20'}M</p>
                </main>

                <footer className='doc-upload-footer on-log'
                    data-log-region="file-upload-dialog"
                    data-log-pos="upload-btn"
                    >
                    <span className='doc-upload-btn'>
                        现在去上传

                        <span className='doc-file-uploader'>
                            {
                                !this.isValidInput() ?
                                <span className='doc-file-bg' onClick={this.handleBgClick}></span> :
                                null
                            }
                            <FileInput
                                className='doc-file-input'
                                onChange={this.onChangeDocFile}
                            />
                        </span>
                    </span>
                </footer>
            </Confirm>

        );
    }
}

FileUploader.propTypes = {
    uploadDoc: PropTypes.func,
    onProgress: PropTypes.func,
    saveFile: PropTypes.func,
};

export default FileUploader;
