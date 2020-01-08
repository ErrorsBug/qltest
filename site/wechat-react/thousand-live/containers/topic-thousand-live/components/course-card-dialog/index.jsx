import React, { PureComponent, Component } from "react";
import { createPortal } from "react-dom";
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit';
import Picture from 'ql-react-picture';
import { apiService } from 'components/api-service';
import CommonTextarea from 'components/common-textarea';
import FileInput from "components/file-input";
import { isCompetitorLink } from "components/util";
import { fillParams } from 'components/url-utils';
import Detect from 'components/detect'

import {
    uploadImage
} from 'thousand_live_actions/common';

class CourseCardDialog extends PureComponent {

    data = {
        allData: {},
        typeList: [{
            val: 'channel',
            label: '系列课'
        }, {
            val: 'topic',
            label: '单课'
        }, {
            val: 'traningPeriod',
            label: '训练营'
        }, {
            val: 'liveCamp',
            label: '打卡'
        }, {
            val: 'customize',
            label: '自定义'
        }]
    }

    state = {
        type: 'channel',
        pageData: {
            page: 1,
            size: 20,
            isEnd: false
        },
        selected: {},
        customizeContent: {}
    }

    componentDidMount () {
        document.querySelector('.co-dialog-container') && limitScrollBoundary(document.querySelector('.co-dialog-container'))
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.show) {
            this.setState({
                type: 'channel',
                pageData: {
                    page: 1,
                    size: 20,
                },
                selected: {}
            }, this.fetchDataList)
            setTimeout(() => {
                typeof _qla != 'undefined' && _qla.collectVisible();
            }, 0);
        }
    }
    
	// 列表数据装载
	async fetchDataList() {
        const {
            type
        } = this.state

        if (/customize/.test(type)) {
            return
        }

        let config = this.data.allData[type]
        if (!config) {
            config = {
                list: [],
                isEnd: false
            }
        }

        const pageData = {...this.state.pageData}

        const count = pageData.page * pageData.size
		// 当存储数据不满足装载量且没到底，请求增加数据
		if (count > config.list.length && !config.isEnd) {
            let result = null
            let list = []
			switch (type) {
				case 'channel':
                    result = await apiService.post({
                        url: '/h5/channel/getPcChannelList',
                        body: {
                            liveId: this.props.liveId,
                            ...pageData,
                            displayStatus: 'Y',
                            isCamp: 'N'
                        },
                    })

                    list = result && result.data && result.data.channelList.map(item => {
                        return {
                            headImage: item.headImage,
                            businessId: item.id,
                            title: item.name,
                            learningNum: item.learningNum
                        }
                    }) || []
					break;
                case 'topic':
                    result = await apiService.post({
                        url: '/h5/topic/mediaTopicList',
                        body: {
                            liveId: this.props.liveId,
                            ...pageData,
                            displayStatus: 'Y'
                        },
                    })

                    list = result && result.data && result.data.mediaTopicList.map(item => {
                        return {
                            headImage: item.backgroundUrl,
                            businessId: item.topicId,
                            title: item.name,
                            learningNum: item.browseNum
                        }
                    }) || []
                    break;
                case 'traningPeriod':
                    result = await apiService.post({
                        url: '/h5/channel/getPcChannelList',
                        body: {
                            liveId: this.props.liveId,
                            ...pageData,
                            displayStatus: 'Y',
                            isCamp: 'Y',
                            showPeriodName: 'Y'
                        },
                    })

                    list = result && result.data && result.data.channelList.map(item => {
                        return {
                            headImage: item.headImage,
                            businessId: item.id,
                            title: `${item.periodName}-${item.name}`,
                            learningNum: item.learningNum
                        }
                    }) || []
                    break;
                case 'liveCamp':
                    result = await apiService.post({
                        url: '/h5/camp/pcCampList',
                        body: {
                            liveId: this.props.liveId,
                            ...pageData,
                            displayStatus: 'Y'
                        },
                    })

                    list = result && result.data && result.data.campList.map(item => {
                        return {
                            headImage: item.headImage,
                            businessId: item.id,
                            title: item.name,
                            buyNum: item.authNum
                        }
                    }) || []
                    break;
            }
        
            config.list.push(...list)
            if (list.length < pageData.size) {
                config.isEnd = true
            }

            console.log(config)
            this.data.allData[type] = config
        }

        pageData.page += 1
        this.setState({
            pageData
        })
	}

	isLock = false
	loadMore = async (next) => {

		if (!this.isLock) {
			this.isLock = true
			await this.fetchDataList()
			this.isLock = false
		}

		next && next()
    }

    toggleClassify = (type) => {
        return () => {
            this.setState({
                type,
                pageData: {
                    page: 1,
                    size: 20
                }
            }, this.fetchDataList)

            this.scrollContainerRef && (this.scrollContainerRef.scrollTop = 0)
        }
    }

    onSelected = (item) => {
        return () => {

            if (this.canSubmit && this.state.selected.businessType === 'customize') {
                this.setState({
                    toggleConfirmHandle: () => {
                        this.setState({
                            selected: {
                                ...item,
                                businessType: this.state.type
                            },
                            toggleConfirmHandle: null
                        })
                    }
                })
                return
            }

            this.setState({
                selected: {
                    ...item,
                    businessType: this.state.type
                }
            })
        }
    }

    onConfrim = async () => {
        if (!this.canSubmit) return

        const params = {...this.state.selected}

        if (params.businessType === 'customize' && params.url && await isCompetitorLink(params.url)) {
            return
        }

        if (params.businessType) {
            switch (params.businessType) {
                case 'channel':
                    params.url = `${window.location.origin}/live/channel/channelPage/${params.businessId}.htm`
                    break;
                case 'topic':
                    params.url = `${window.location.origin}/topic/details?topicId=${params.businessId}`
                    break;
                case 'traningPeriod':
                    params.url = `${window.location.origin}/live/channel/channelPage/${params.businessId}.htm`
                    break;
                case 'liveCamp':
                    params.url = `${window.location.origin}/wechat/page/camp-detail?campId=${params.businessId}`
                    break;
            }
        }

        params.url = fillParams({
            ch: 'massageCard'
        }, params.url)

        this.props.onConfrim && this.props.onConfrim(params)
    }

    onClose = () => {
        this.props.onClose && this.props.onClose()
    }

    onChangeInput = (key) => {
        return (e) => {
            let selected = {...this.state.selected}
            if (selected.businessType !== 'customize') {
                selected = {}
            }

            this.setState({
                selected: {
                    ...selected,
                    [key]: e.target.value,
                    businessType: 'customize'
                }
            })
        }
    }

    onImageInput = async (event) => {
        const file = event.target.files[0]
        event.target.value = '';
        try {
            const filePath = await this.props.uploadImage(file, "liveComment");
            if (filePath) {
                let selected = {...this.state.selected}
                if (selected.businessType !== 'customize') {
                    selected = {}
                }
                this.setState({
                    selected: {
                        ...selected,
                        headImage: filePath,
                        businessType: 'customize'
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    onWxImageInput = () => {
        window.wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                this.wxImgUpload(res.localIds);
            },

            cancel: (res) => {
            }
        });
    }

    async wxImgUpload(localIds) {
        while (localIds.length > 0){
	        let loaclUrl = localIds.shift();
            window.loading(true);
			await new Promise((resolve, reject) => {
				wx.uploadImage({
					localId: loaclUrl,
					isShowProgressTips: 0,
					success: async (res) => {
                        let selected = {...this.state.selected}
                        this.setState({
                            selected: {
                                ...selected,
                                headImage: loaclUrl,
                                imageId: res.serverId,
                                businessType: 'customize'
                            }
                        })
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
	};

    get canSubmit () {
        const {
            headImage,
            businessType,
            businessId,
            title,
            url
        } = this.state.selected
        if (businessType === 'customize') {
            return headImage && url && title
        } else {
            return businessId && headImage
        }
    }

    render () {
        const {
            type,
            pageData,
            selected
        } = this.state

        console.log('selected', selected)
        
        const isCustomize = type === 'customize'
        const {list = [], isEnd} = this.data.allData[type] || {}
        const showList = !isCustomize ? list.slice(0, pageData.page * pageData.size) : []

        return this.props.show ? createPortal(
            <div className="send-course-card-dialog">
                <div className="_layer"></div>
                <div className="send-course-card-container">
                    <div className="_header">
                        <span className="icon-close" onClick={this.onClose}></span>
                        <div className="_title">
                            请选择一个课程<br/>将以卡片的形式发送到课堂中
                            <div className="example-btn" onClick={() => {
                                this.setState({showCourseCardTips: true})
                            }}>示例</div>
                        </div>
                        {
                            this.data.typeList && this.data.typeList.length > 0 ?
                            <div className="classify-list">
                                {
                                    this.data.typeList.map(item => (
                                        <span 
                                            key={item.val} 
                                            className={`classify-item on-log on-visible ${type === item.val ? ' act' : ''}`} 
                                            data-log-region="set_card"
                                            data-log-pos={item.val}
                                            onClick={this.toggleClassify(item.val)}>{item.label}</span>
                                    ))
                                }
                            </div> : null
                        }
                    </div>
                    <div className="_content">
                        <ScrollToLoad
                            ref={r => this.scrollContainerRef = r}
                            className="scroll-container scroll-box"
                            toBottomHeight={300}
                            loadNext={this.loadMore}
                            disable={isCustomize}
                            noMore={isCustomize || isEnd && showList.length === list.length}
                            noOne={!isCustomize || isEnd && list.length == 0}
                            >
                                {
                                    !isCustomize ? 
                                    showList.map((item, index) => (
                                        <CourseCardItem 
                                            key={`course-card-item-${index}`} 
                                            isCheck={selected.businessType === type && selected.businessId == item.businessId} 
                                            {...item} 
                                            onClick={this.onSelected(item)} 
                                            />
                                    )) 
                                    : 
                                    <CustomizeBusiness 
                                        data={selected.businessType === type && selected || {}}
                                        onChangeInput={this.onChangeInput}
                                        onImageInput={this.onImageInput}
                                        onWxImageInput={this.onWxImageInput}
                                        />
                                }
                        </ScrollToLoad>
                    </div>
                    <div className="_footer">
                        <span className={`send-btn${this.canSubmit ? '' : ' disable'}`} onClick={this.onConfrim}>确定发送</span>
                    </div>
                </div>
                {
                    this.state.showCourseCardTips ?
                    <div className="example-dialog">
                        <div className="_layer"></div>
                        <div className="_container">
                            <div className="_header">
                                <span className="icon-close" onClick={() => {
                                    this.setState({showCourseCardTips: false})
                                }}></span>
                                <div className="_title">
                                    图文卡
                                </div>
                            </div>
                            <div className="_content">
                                <div className="_desc">
                                    把你想要发送的内容，以图文卡片的形式发送到课堂中，点击率提升<em>45%～120%</em>
                                </div>
                                <Picture src="https://img.qlchat.com/qlLive/liveCommon/course-card-tips.png" />
                            </div>
                        </div>
                    </div> : null
                }
                {
                    this.state.toggleConfirmHandle ?
                    <div className="toggle-confirm-dialog">
                        <div className="_layer"></div>
                        <div className="_container">
                            <div className="_content">
                                你刚设置的自定义内容还未发送，如果勾选了课程，自定义内容会被清空。确定要选择吗？
                            </div>
                            <div className="_footer">
                                <span onClick={this.state.toggleConfirmHandle}>确定</span>
                                <span className="ok" onClick={() => {
                                    this.setState({toggleConfirmHandle: null})
                                }}>再想想</span>
                            </div>
                        </div>
                    </div> : null
                }
            </div>,
            document.querySelector(".portal-high")
        ) : null
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapActionToProps = {
    uploadImage
}

export default connect(mapStateToProps, mapActionToProps)(CourseCardDialog);

const CourseCardItem = (props) => (
    <div className="course-card-item" onClick={props.onClick}>
        <div className={`check-box${props.isCheck ? ' check' : ''}`}></div>
        <div className="cover">
            {
                props.headImage ? 
                <Picture src={props.headImage} resize={{w:126,h:80}} /> : null
            }
        </div>
        <div className="info">
            <p className="title elli">{props.title}</p>
            {
                typeof props.learningNum === 'number' ?
                <p className="study">{props.learningNum} 次学习</p> 
                : 
                typeof props.buyNum === 'number' ?
                <p className="study">{props.buyNum} 人购买</p> : null
            }
        </div>
    </div>
)

const CustomizeBusiness = (props) => (
    <div className="customize-business">
        <div className="business-head-image">
            {
                props.data.headImage ? <Picture src={props.data.headImage} resize={{w:517,h:324}} /> 
                : 
                <div className="not-pic">
                    <p>点击上传配图</p>
                    <p>（建议尺寸800*500）</p>
                </div>
            }
            {
                Detect.os.weixin && Detect.os.phone ?
                <div className="media-file-input" onClick={props.onWxImageInput}></div>
                :
                <FileInput
                    className='media-file-input'
                    onChange={props.onImageInput}
                    accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
                />
            }
        </div>
        <div className="business-name">
            <CommonTextarea
                className='comment-textarea'
                placeholder="请输入标题（必填）"
                value={props.data.title}
                maxLength="36"
                onChange={props.onChangeInput('title')}
                />
            <p className="max-length">{props.data.title && props.data.title.length || 0}/36</p>
        </div>
        <div className="business-url">
            <CommonTextarea
                className='comment-textarea'
                placeholder="请输入跳转链接（必填）"
                value={props.data.url}
                onChange={props.onChangeInput('url')}
                />
        </div>
    </div>
)