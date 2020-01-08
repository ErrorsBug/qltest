/**
 * Created by dylanssg on 2017/5/27.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Detect from 'components/detect';
import { connect } from 'react-redux';
import FileInput from 'components/file-input';
import { autobind} from 'core-decorators';
import { uploadImage } from '../../../../actions/common';
import { addPPT, removePPT, sortPPT, sortUp, sortDown, resetMaterial ,pushPPT } from '../../../../actions/thousand-live-normal'
import shallowCompare from 'react-addons-shallow-compare';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { locationTo } from 'components/util';
import { fixScroll } from 'components/fix-scroll';


@autobind
class MaterialBank extends Component {

	state = {
		isSortMode: false,
		materialList: []
	};

	data = {
		localUrls: [],
	};
	componentDidMount() {
		// 修正滚动露底
		setTimeout(() => {
            fixScroll("#material-container");
        },0)
	}

	shouldComponentUpdate(nextProps){
		return shallowCompare(this,nextProps);
	}


	sortUpHandle(index){
		if(index === 0) return;
		this.props.sortUp(index);
	}

	sortDownHandle(index){
		if(index === this.props.materialList.length - 1) return;
		this.props.sortDown(index);
	}

	sortBtnHandle(){
		this.data.oldMaterialList = [...this.props.materialList];
		this.setState({isSortMode: true});
	}

	cancelBtnHandle(){
		this.props.resetMaterial([...this.data.oldMaterialList]);
		this.setState({
			isSortMode: false
		});
	}

	async confirmBtnHandle(){
		let fileList = this.props.materialList.map((material, index) => {
			return {
				id: material.id,
				sortNum: index + 1,
				topicId: material.topicId
			}
		});
		let result = await this.props.sortPPT({
			fileList
		});
		if(result.state.code === 0){
			window.toast('保存成功');
			this.setState({
				isSortMode: false
			})
		}
	}

	async uploadInputFocusHandle(e){
		if(this.state.isSortMode){
			e.preventDefault();
			if(await window.confirmDialogPromise('是否保存当前排序？','尚未保存当前排序')) this.confirmBtnHandle();
		}
	}

	async wxImgUpload(localIds) {
		let serverIds = [];
		while (localIds.length > 0){
	        let loaclUrl = localIds.shift();
            window.loading(true);
			await new Promise((resolve, reject) => {
				wx.uploadImage({
					localId: loaclUrl,
					isShowProgressTips: 0,
					success: async (res) => {
						serverIds.push(res.serverId);
						resolve();
					},
					fail: (res) => {
						window.toast("部分图片上传失败，请重新选择");
						reject();
					},
					complete: (res) => {
						window.loading(false);
						resolve();
					}
				});
			})
		}
		this.uploadImgHandle(serverIds);
	};

	selectImageHandleWx()  {
		if (Detect.os.weixin && Detect.os.phone) {
			wx.chooseImage({
				count: 9,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success:  (res) =>  {
					this.wxImgUpload(res.localIds);
				},
				cancel:  (res) => {
				}
			});

		}
	}



	async selectImageHandlePc(e) {
		let filesUploadTask = [];
		const files = e.target.files;
		Array.prototype.forEach.call(files, (f) => {
			filesUploadTask.push(this.props.uploadImage(f));
		});
        e.target.value = '';
		try {
			let imgLinks = await Promise.all(filesUploadTask);
			this.uploadImgHandle(imgLinks);
		} catch (error) {
		}
	}


	async uploadImgHandle(imgArr){
		let materialFiles = imgArr.map((item) => {
			return {
				topicId: this.props.topicId,
				status: this.props.topicStyle === 'normal' ? 'N' : 'Y',
				type: 'image',
				url: !(Detect.os.weixin&& Detect.os.phone)? item : '',
				resourceId: (Detect.os.weixin&& Detect.os.phone) ? item : '',

			}
		});

		let result = await this.props.addPPT({
			topic: {
				id: this.props.topicId,
				materialFiles
			}
		});

		if (result.state && result.state.code == '0' && this.props.currentPPTFileId == '') {
			let currentFileId = result.data.files[0].fileId || '';
			this.props.onPPTSwiped(currentFileId);
		}
		console.log(result);
	}

	async sendBtnHandle(material){

		let result;
		if(this.props.topicStyle === 'normal'){
			await this.props.addTopicSpeak('image',material.url);
            result = await this.props.pushPPT(material.id);
		}else if(material.status != 'Y'){
			result = await this.props.pushPPT(material.id);
		}

		if(result.state.code === 0){
			let materialList = [...this.state.materialList];
			materialList = materialList.map((item) => {
				if(item.fileId === material.fileId) {
                    item.status = 'Y';
                }
				return item;
			});
			this.setState({
				materialList
			});
		}else{
			window.toast('发送失败，请稍后再试');
		}
	}

	async removeBtnHandle(id){
		if(this.state.isSortMode){
			if(await window.confirmDialogPromise('是否保存当前排序？','尚未保存当前排序')) this.confirmBtnHandle();
		} else {
			window.confirmDialog(
				'是否确定删除PPT？',
				() => { this.props.removePPT(id);}
			);
		}
	}

	async backBtnHandle(){
		if(this.state.isSortMode){
			if(await window.confirmDialogPromise('是否保存当前排序？','尚未保存当前排序')) this.confirmBtnHandle();
		}else{
			this.props.hideMaterialBank();
		}
	}


	get isEmptyPictureItem () {
		return !this.props.materialList || this.props.materialList.length === 0;
	}

	render() {
		return (
			<div className="material-bank">
				<div className="operation-tip">
					{
						this.state.isSortMode ?
							'点击图片右侧的箭头可移动图片位置'
							:
							(
								this.props.topicStyle === 'ppt' ?
									<p>
										上传完图片后，在主屏翻到指定图片进行录音，即可完成绑定，播放此语音时会展示所绑定的图片。
										<a className="on-log" href="javascript:void(0);"
											onClick={e => locationTo("https://mp.weixin.qq.com/s/MjemF7MtPJu5-TZun3UPog")}
											data-log-region="material-panel"
											data-log-pos="guide-link"
											>查看使用指南</a>
									</p>
									:
									'直播前预先上传图片，点击已上传的图片直接发送，省去上传时间。'
							)
					}
				</div>
				
				{
					this.state.isSortMode ?
					<div className='header-panel'>
						<div className="sort-mode-box">
							<div className="cancel-btn on-log"
								onClick={this.cancelBtnHandle}
								data-log-region="material-panel"
								data-log-pos="cancel-sort-btn"
								data-log-name="取消"
								>
								取消
							</div>
							<div className="confirm-btn on-log"
								onClick={this.confirmBtnHandle}
								data-log-region="material-panel"
								data-log-pos="confirm-sort-btn"
								data-log-name="完成"
								>
								完成
							</div>
						</div>
					</div>
					:
					((this.props.topicStyle === 'ppt' && !this.isEmptyPictureItem) ?
						<div className='header-panel'>
							<div className="sort-btn on-log"
								onClick={this.sortBtnHandle}
								data-log-region="material-panel"
								data-log-pos="sort-btn"
								data-log-name="排序"
							>
								<img src={require('./img/icon-sort.png')} alt=""/>
								排序
							</div> 
						</div> 
					: null)
				}
				<ul className="material-list" id='material-container'>
					{
						this.props.materialList.map((material,index) => {
							return (
								<li className="item" key={index}>
									<div className="img-wrap"
										style={{backgroundImage: `url(${material.url}?x-oss-process=image/resize,h_360)`}}
										onClick={this.sendBtnHandle.bind(this,material)}
										data-log-region="material-panel"
										data-log-pos="send-btn"
										data-log-name="发送">
										{
											material.status === 'Y' ?
												<div className="sended-tip">已发送</div>
												:
												<div className="send-btn on-log">
													发送
												</div>
										}
									</div>
									<div className="sort-controller">
										{this.state.isSortMode &&
											<div className={`up-btn${index === 0 ? ' disable' : ''} on-log`}
												onClick={this.sortUpHandle.bind(this, index)}
												data-log-region="material-panel"
												data-log-pos="sort-up-btn"
												>
											</div> || null}
										{this.state.isSortMode &&
											<div className={`down-btn${index === this.state.materialList.length - 1 ? ' disable' : ''} on-log`}
												onClick={this.sortDownHandle.bind(this, index)}
												data-log-region="material-panel"
												data-log-pos="sort-down-btn"
												>
											</div> || null}
									</div>
									<div className="remove-btn on-log"
										onClick={this.removeBtnHandle.bind(this,material.id)}
										data-log-region="material-panel"
										data-log-pos="remove-btn"
										>
									</div>
								</li>
							)
						})
					}
				</ul>

				<div className="footer-panel">
					<div className="upload-img-btn on-log"
						onClick={this.selectImageHandleWx}
						data-log-region="material-panel"
						data-log-pos="upload-img-btn"
						>
						上传图片素材
						{
							!(Detect.os.weixin && Detect.os.phone) ?
							<input type="file" ref="input-file" multiple="multiple" onFocus={this.uploadInputFocusHandle} onChange={this.selectImageHandlePc}/>
							:null
						}
					</div>
				</div>
			</div>

		)
	}
}

MaterialBank.defaultProps = {
	topicStyle: 'normal',
};

function mapStateToProps (state) {
	return {
		materialList: state.thousandLive.materialList
	}
}

const mapActionToProps = {
	uploadImage,
	addPPT,
	removePPT,
	sortPPT,
	sortUp,
	sortDown,
	resetMaterial,
	pushPPT
};

export default connect(mapStateToProps, mapActionToProps)(MaterialBank);

// module.exports = connect(mapStateToProps, mapActionToProps)(MaterialBank);
