'use strict';

import log from '../../comp/log';
import { linkTo, imgUrlFormat, getVal } from '../../comp/util';
import { api } from '../../config';
import * as regeneratorRuntime from '../../comp/runtime';

import { ChannelService } from '../../service/channel.service';
import { wxm } from '../../service/wx-method.service';
import { CommonService } from '../../service/common.service';
import ImageService from './card-service/image.service';
import TemplateManager from './card-templates/index';
import { ShareCardType } from './card-service/card-type';
import { LiveService } from '../../service/live.service';


const app = getApp();

Page({

    lastChangePos: 0,
    animating: false,

    data: {
        liveId: '',
        money: 0,
        discount: 0,
        discountStatus: 'N',
        switch: '',
        isDistribution: false,
        // 分销比例
        shareRatio: 0,
        // 分销key
        shareKey: '',
        // 分销类型
        shareType: '',
        // 邀请卡高度
        shareCardHeight: '',
        // 邀请卡容器的高度
        shareCardWrapHeight: '',
        // 当前滑动的位置
        activeIndex: 0,
        // 邀请卡信息
        shareData: null,

        imgUrls: [],
        noticeList: [],

        shareIconPath: '',
        system: app.globalData.system,

    },

    async onLoad(options) {
        try {
            await app.login()

            wx.stopPullDownRefresh()

            global.loggerService.pv()

            this.channelService = new ChannelService();
            await this.initChannelData(options);
            this.templateManager = await TemplateManager.newInstance(ShareCardType.channel, this.data.shareData);

            this.initNotice();

            // 业务区
            this.isShare();
            await this.initShareIcon();
            this.initShareCardSlider();

        } catch (error) {
            console.error(error);
        }
    },

    async initChannelData(options) {
        let shareData;
        if (options.businessType === 'channel') {
            const [channelRes, shareDataRes] = await Promise.all([
                this.channelService.fetchChannelInfo(options.businessId),
                LiveService.getShareData({
                    businessType: options.businessType,
                    businessId: options.businessId,
                    userId: (wx.getStorageSync('userId')).value,
                }),
            ]);

            const qrCodeRes = await this.getQrCode(options.businessId, shareDataRes.sharekey);

            shareData = {
                ...channelRes.channel,
                ...shareDataRes,
                // 这里注意，后端这个接口返回sharekey的k是小写的，现在统一成驼峰的   Em.........
                shareKey: shareDataRes.sharekey,
                discountStatus: getVal(channelRes, 'chargeConfigs.0.discountStatus'),
                discount: getVal(channelRes, 'chargeConfigs.0.discount'),
                money: getVal(channelRes, 'chargeConfigs.0.amount'),
                qrCode: qrCodeRes,
            };
        }

        this.setData({
            businessId: options.businessId,
            businessType: options.businessType,
            liveId: shareData.liveId,
            shareData,
        });
    },

    async initShareIcon() {
        try {
            const shareIcon = await this.templateManager.drawShareIcon({ headImage: getVal(this.data.shareData, 'headImage') });
            this.setData({
                shareIconPath: shareIcon,
            });
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * 初始化邀请卡，一开始只显示第一第二张邀请卡
     */
    async initShareCardSlider() {
        const shareCardTotalCount = await this.templateManager.getAllCardCount();
        const imgUrls = Array(shareCardTotalCount).fill('');
       
        imgUrls[0] =  await this.templateManager.drawCard(0);
        this.setData({ imgUrls });

        setTimeout(async () => {
            if (shareCardTotalCount > 1) {
                imgUrls[1] = await this.templateManager.drawCard(1);
                this.setData({ imgUrls });
            }
        }, 0);

        this.adjustImageSize();

        this.deltaTime = Date.now();
    },

    /**
     * 更新邀请卡，必要的时候调用canvas画卡
     */
    async updateShareCard() {
        if (this.__waitingDraw) {
            return;
        }

        if (this.animating) {
            return;
        }

        // 开始画卡
        this.__waitingDraw = true;
        // 当前画的卡
        let pos = this.lastChangePos;
        
        setTimeout(async () => {
            let imgUrls = this.data.imgUrls;

            if (!imgUrls[pos]) {
                imgUrls[pos] = await this.templateManager.drawCard(pos);
            }

            this.setData({ imgUrls });

            // 优先画完当前邀请卡，左右两张就之后再画
            setTimeout(async () => {
                // 画左边那张卡
                if (pos != 0 && !imgUrls[pos - 1]) {
                    console.log('left lastChangePos ', pos - 1);
                    imgUrls[pos - 1] = await this.templateManager.drawCard(pos - 1);
                }
                
                // 画右边那张卡
                if (pos < imgUrls.length - 1 && !imgUrls[pos + 1]) {
                    imgUrls[pos + 1] = await this.templateManager.drawCard(pos + 1);
                }

                this.setData({ imgUrls });

                this.__waitingDraw = false;
            }, 0);
        }, 200);
    },

    /**获取二维码 */
    async getQrCode(businessId = '', shareKey = '') {
        try {
            const result = await CommonService.getQr({
                userId: (wx.getStorageSync('userId')).value,
                channel: 'weappShareCard',
                toUserId: shareKey,
                channelId: businessId,
                showQl: 'Y',
            });

            return result.qrUrl;
        } catch (error) {
            console.error(error);
        }
    },

    /**邀请卡滑动事件 */
    onChangeSwiper(event) {
        this.lastChangePos = event.detail.current;
        this.animating = true;

        this.setData({
            activeIndex: event.detail.current
        });
    },

    /**滑动动画结束 */
    onAnimatinoFinish() {
        this.animating = false;
        this.updateShareCard();
    },

    /**调整邀请卡的大小以适应屏幕 */
    async adjustImageSize() {
        const res = await this.getElementById('#shareCardItem');
        if (!res || res.length === 0) {
            return;
        }

        const itemHeight = res[0].width * 1.773;

        const systemInfo = wx.getSystemInfoSync();
        const wrapHeight = itemHeight + (systemInfo.screenWidth / 750  * 90);

        this.setData({
            shareCardHeight: `height: ${itemHeight}px;`,
            shareCardWrapHeight: `height: ${wrapHeight}px`,
        });
    },

    /**根据ID获取节点 */
    getElementById(id) {
        return new Promise((resolve, reject) => {
            const query = wx.createSelectorQuery()
            query.select(id).boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec((res) => {
                resolve(res);
            });
        });
    },

    /**关注千聊按钮点击 */
    async onFocusClick() {},

    /**分享给好友按钮点击 */
    async shareToFriend(e) {
        global.loggerService.click(e);
    },

    /**保存邀请卡按钮点击 */
    async saveShareCard(e) {
        let settings = await wxm.getSetting();
        if (settings.authSetting['scope.writePhotosAlbum'] === false) {
            await wxm.showModal({
                title: '提示',
                content: '请打开“保存到相册”的权限，这样我们才能保存邀请卡到您的手机',
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#f73657',
            });
            await wxm.openSetting();
        }

        try {
            wx.saveImageToPhotosAlbum({
                filePath: this.data.imgUrls[this.lastChangePos],
                success: (res) => {
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success'
                    });

                    global.loggerService.click(e);
                },
                fail: (res) => console.log(res),
            });
        } catch (error) {
            console.error(error);
        }
    },

    /**判断是否分销 */
    async isShare() {
        let params = {
            liveId: this.data.liveId,
            businessId: this.data.businessId,
            userId: (wx.getStorageSync('userId')).value,
            type: this.data.businessType,
        };
        const result = await this.channelService.isShare(params);
        /**增加开关 */
        this.setData({switch: result.switch ? result.switch : 'Y' });
        if(result.isShare === 'N'){
            this.setData({isDistribution: false})
        }
        if(result.isShare === 'Y'){
            this.setData({
                isDistribution: true,
                shareRatio: result.shareRatio,
            })

            this.setData({
                shareType: result.shareType,
                shareKey: result.shareKey,
            });
        }
    },

    /**
     * 初始化左上角notice
     */
    async initNotice() {
        this.animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease-out',
        });

        try {
            // const result = await this.bonusesService.getAccountRedpackList(this.data.confId);
            const result = [];
            const list = await LiveService.getShareUserList();

            this.setData({
                noticeList: list,
                notice1: this.getRandomNotice(list),
                notice2: this.getRandomNotice(list),
            })
        } catch (error) {
            console.error(error);
        }

        this.updateNotice();
    },

    updateNotice() {
        this.animation.translateY('-100%').opacity(0).step();
        let animationData1 = this.animation.export();
        this.animation.translateY('0').opacity(1).step();
        let animationData2 = this.animation.export();

        this.setData({
            animationData1,
            animationData2,
            notice2: this.getRandomNotice(),
        })

        setTimeout(() => {
            this.resetNotice();
        }, 1000);

        setTimeout(() => {
            this.updateNotice();
        }, 2000);
    },

    resetNotice() {
        let animReset = wx.createAnimation({
            duration: 0,
            timingFunction: 'step-start'
        });
        animReset.translateY('0').opacity(1).step();
        let animationData1 = animReset.export();
        animReset.translateY('100%').opacity(0).step();
        let animationData2 = animReset.export();
        
        this.setData({
            animationData1,
            animationData2,
            notice1: this.data.notice2,
            notice2: this.data.notice1,
        })
    },

    /**
     * 获取随机的notice
     */
    getRandomNotice(list) {
        try {
            let tmpList = this.data.noticeList.length > 0 ? this.data.noticeList : list;
            if (!tmpList || tmpList.length === 0) {
                return '';
            }

            let idx = Math.floor(Math.random() * tmpList.length);
            let obj = tmpList[idx] || {};

            return `${obj.userName}\n已赚${obj.earning / 100}`;
        } catch (error) {
            console.error('error -- ', error);
            return '';
        }
    },

    onShareAppMessage(e) {
        let {
            shareKey,
            shareType,
            businessId,
            businessType,
            shareData: {
                userName
            }
        } = this.data;

        let shareLink = '';

        if (shareType == 'live') {
            shareLink = '&lshareKey=' + shareKey;
        } else {
            shareLink = '&shareKey=' + shareKey;
        }

        let shareCardData = encodeURIComponent(`businessId=${businessId}&businessType=${businessType}${shareLink}`);

        return {
            title: `您已成功接收${userName}的邀请，点击查看详情报名>>`,
            imageUrl: this.data.shareIconPath,
            path: `/pages/index/index?weappShareCard=Y&shareCardData=${shareCardData}`,
            success: (res)=>{}
        };
    }
});
