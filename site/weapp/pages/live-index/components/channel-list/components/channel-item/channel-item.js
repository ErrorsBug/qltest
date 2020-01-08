import { digitFormat, linkTo } from '../../../../../../comp/util';

Component({
    properties: {
        system: String,
        channel: Object,
    },

    data: {
        chargeItem: '',
        originMoney: '',
        // chargeTag: '',
        actualPrice: '',
        learnNum: '',
    },

    ready() {
        if (!this.data.channel.chargeConfigs || this.data.channel.chargeConfigs.length === 0) {
            return;
        }

        const chargeItem = this.data.channel.chargeConfigs[0];

        this.setData({
            chargeItem: chargeItem,
            originMoney: chargeItem.discountStatus == 'N' ? '' : (chargeItem.amount || 0),
            // chargeTag: chargeItem.discountStatus == 'Y' ? 'promotion' : chargeItem.discountStatus == 'P' ? 'group' : '',
            // actualPrice: chargeItem.chargeMonths > 0 ?
        });
    },

    methods: {
        handleItemClick() {
            wx.redirectTo({
                url: `/pages/channel-index/channel-index?channelId=${this.data.channel.id}`
            });
        }
    }
});